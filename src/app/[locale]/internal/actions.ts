"use server";

import { createServiceClient } from "@/services/supabase/supabase-server";
import { revalidatePath } from "next/cache";
import { getTeamPerformanceStats as getStats } from "../admin/actions-modules/executive";
import { oauth2Client, createCalendarEvent } from "@/lib/google-calendar";
import { getUser } from "@/services/supabase/supabase-server";
import { sendEmail } from "@/lib/email";

export const getTeamPerformanceStats = getStats;

/**
 * ATTENDANCE ACTIONS
 */

export async function logAttendance(userId: string, type: 'in' | 'out') {
  const supabase = await createServiceClient();
  const today = new Date().toISOString().split('T')[0];

  if (type === 'in') {
    // 1. Block if already checked in today (Atomic guard)
    const { data: existing } = await supabase
      .from('attendance_logs')
      .select('id, check_out')
      .eq('user_id', userId)
      .gte('check_in', `${today}T00:00:00Z`)
      .lte('check_in', `${today}T23:59:59Z`)
      .is('check_out', null)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "Active mission session already in progress." };
    }

    const { data, error } = await supabase
      .from('attendance_logs')
      .insert({
        user_id: userId,
        check_in: new Date().toISOString()
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    revalidatePath('/[locale]/internal/associate', 'page');
    return { success: true, data };
  } else {
    // 2. Block if no active session exists
    const { data: activeLog } = await supabase
      .from('attendance_logs')
      .select('id')
      .eq('user_id', userId)
      .is('check_out', null)
      .order('check_in', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!activeLog) {
      return { success: false, error: "No active mission session detected. Deployment required first." };
    }

    const { data, error } = await supabase
      .from('attendance_logs')
      .update({
        check_out: new Date().toISOString()
      })
      .eq('id', activeLog.id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    revalidatePath('/[locale]/internal/associate', 'page');
    return { success: true, data };
  }
}

export async function getAttendanceLogs(userId?: string) {
  const supabase = await createServiceClient();
  let query = supabase.from('attendance_logs').select('*, profiles(full_name, avatar_url, role)');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.order('check_in', { ascending: false });
  if (error) return [];
  return data || [];
}

/**
 * TASK ACTIONS
 */

export async function createTask(data: {
  title: string;
  description?: string;
  assigned_to: string;
  assigned_by: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status?: string;
  due_date?: string;
}) {
  const supabase = await createServiceClient();
  
  let targetUserIds = [data.assigned_to];
  
  if (data.assigned_to === 'all') {
    const { data: team } = await supabase
      .from('profiles')
      .select('id')
      .eq('manager_id', data.assigned_by);
      
    if (team && team.length > 0) {
      targetUserIds = team.map(t => t.id);
    } else {
      return { success: false, error: "No team members found to assign the mission." };
    }
  }

  const tasksToInsert = targetUserIds.map(userId => ({
    title: data.title,
    description: data.description,
    assigned_to: userId,
    assigned_by: data.assigned_by,
    priority: data.priority,
    status: data.status,
    due_date: data.due_date
  }));

  const { data: createdTasks, error } = await supabase.from('tasks').insert(tasksToInsert).select();

  if (error) return { success: false, error: error.message };

  // Log creation for each
  const logsToInsert = (createdTasks || []).map(task => ({
    task_id: task.id,
    actor_id: data.assigned_by,
    action: 'created',
    new_status: data.status || 'pending',
    payload: { title: data.title }
  }));
  
  if (logsToInsert.length > 0) {
    await supabase.from('task_logs').insert(logsToInsert);
  }

  revalidatePath('/[locale]/internal/manager', 'page');
  return { success: true };
}

export async function getTasks(userId?: string) {
  const supabase = await createServiceClient();
  let query = supabase.from('tasks').select('*, assigned_by_profile:profiles!tasks_assigned_by_fkey(full_name), assigned_to_profile:profiles!tasks_assigned_to_fkey(full_name, avatar_url, role)');

  if (userId) {
    query = query.eq('assigned_to', userId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
  return data || [];
}

export async function updateTaskStatus(taskId: string, status: string, actorId?: string) {
  const supabase = await createServiceClient();

  // Get previous status for logging
  const { data: prev } = await supabase.from('tasks').select('status').eq('id', taskId).single();

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId);

  if (error) return { success: false, error: error.message };

  // Log transition
  if (actorId) {
    await supabase.from('task_logs').insert({
      task_id: taskId,
      actor_id: actorId,
      action: 'status_change',
      previous_status: prev?.status,
      new_status: status
    });
  }

  revalidatePath('/[locale]/internal/associate', 'page');
  revalidatePath('/[locale]/internal/manager', 'page');
  revalidatePath('/[locale]/internal/team', 'page');
  return { success: true };
}

export async function getTasksForVerification(mentorId: string) {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('tasks')
    .select('*, assigned_to_profile:profiles!tasks_assigned_to_fkey(full_name, avatar_url, role)')
    .eq('assigned_by', mentorId)
    .eq('status', 'pending_verification')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function handlePoWReview(taskId: string, decision: 'verified' | 'rejected', feedback: string, mentorId: string) {
  const supabase = await createServiceClient();

  // 1. Update task status and verification fields
  // 'Done' if verified, 'In Progress' if rejected (to allow re-submission)
  const status = decision === 'verified' ? 'Done' : 'In Progress';

  const { error: taskError } = await supabase
    .from('tasks')
    .update({
      status,
      verification_status: decision,
      mentor_feedback: feedback,
      verified_at: new Date().toISOString(),
      verified_by: mentorId
    })
    .eq('id', taskId);

  if (taskError) return { success: false, error: taskError.message };

  // 2. Log the event for audit
  await supabase.from('task_logs').insert({
    task_id: taskId,
    actor_id: mentorId,
    action: `review_${decision}`,
    previous_status: 'pending_verification',
    new_status: status,
    payload: { feedback }
  });

  revalidatePath('/[locale]/internal/associate', 'page');
  revalidatePath('/[locale]/internal/manager', 'page');
  return { success: true };
}

export async function commendUser(data: {
  user_id: string;
  mentor_id: string;
  category: 'Tactical' | 'Innovation' | 'Culture' | 'Reliability';
  reason: string;
  points: number;
}) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('commendations').insert(data);

  if (error) return { success: false, error: error.message };

  revalidatePath('/[locale]/internal/associate', 'page');
  revalidatePath('/[locale]/internal/team', 'page');
  return { success: true };
}

export async function getCommendations(userId: string) {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('commendations')
    .select('*, mentor:profiles(full_name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching commendations:", error);
    return [];
  }
  return data || [];
}


export async function updateTaskPoW(taskId: string, proofOfWork: string) {
  const supabase = await createServiceClient();
  const updateData: { proof_of_work: string; status?: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'pending_verification' } = { proof_of_work: proofOfWork };

  // If PoW is provided, transition to pending verification instead of auto-completion
  if (proofOfWork && proofOfWork.trim().length > 0) {
    updateData.status = 'pending_verification';
  }

  const { error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', taskId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/[locale]/internal/associate', 'page');
  revalidatePath('/[locale]/internal/manager', 'page');
  return { success: true };
}

export async function updateTaskBlocker(taskId: string, blockerReason: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('tasks')
    .update({
      status: 'blocked',
      blocker_reason: blockerReason
    })
    .eq('id', taskId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/[locale]/internal/associate', 'page');
  revalidatePath('/[locale]/internal/manager', 'page');
  return { success: true };
}

export async function resolveTaskBlocker(taskId: string, resolutionNote: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('tasks')
    .update({
      status: 'in_progress',
      resolution_note: resolutionNote
    })
    .eq('id', taskId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/[locale]/internal/associate', 'page');
  revalidatePath('/[locale]/internal/manager', 'page');
  return { success: true };
}

/**
 * COMMENT ACTIONS
 */

export async function addTaskComment(taskId: string, userId: string, comment: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('task_comments')
    .insert({ task_id: taskId, user_id: userId, comment });

  if (error) return { success: false, error: error.message };

  revalidatePath('/[locale]/internal/associate', 'page');
  return { success: true };
}

export async function getTaskComments(taskId: string) {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('task_comments')
    .select('*, profiles(full_name, avatar_url)')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });

  if (error) return [];
  return data || [];
}

export async function getMentorDetails(managerId: string) {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, designation, department')
    .eq('id', managerId)
    .single();

  if (error) {
    console.error("Error fetching mentor details:", error);
    return null;
  }
  return data;
}

/**
 * NOTIFICATION ACTIONS
 */

export async function getNotifications(userId: string) {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getPromotionStatus(userId: string) {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('promotion_pipeline')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function getUnreadNotificationCount(userId: string) {
  const supabase = await createServiceClient();
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) return 0;
  return count || 0;
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/[locale]/internal/notifications', 'page');
  return { success: true };
}

/**
 * CHECKLIST ACTIONS
 */

export async function getOnboardingChecklist(userId: string) {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('intern_onboarding_checklists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) return [];

  // Map database structure to UI OnboardingItem interface
  return (data || []).map(item => {
    const [rawCategory, ...rest] = item.task_name.split(': ');
    const itemText = rest.length > 0 ? rest.join(': ') : item.task_name;

    // Map prefix to specific category enum for UI grouping
    let category: 'ACCOUNT' | 'LEGAL' | 'TECHNICAL' | 'INFRASTRUCTURE' | 'general' = 'general';
    const prefix = rawCategory.toUpperCase();

    if (prefix === 'ACCOUNT') category = 'ACCOUNT';
    else if (prefix === 'LEGAL') category = 'LEGAL';
    else if (prefix === 'DEPT') category = 'TECHNICAL';
    else if (prefix === 'TECHNICAL') category = 'TECHNICAL';
    else if (prefix === 'INFRASTRUCTURE') category = 'INFRASTRUCTURE';

    return {
      id: item.id,
      item_text: itemText,
      is_completed: item.is_completed,
      category: category
    };
  });
}

export async function updateChecklistItem(itemId: string, isCompleted: boolean) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('intern_onboarding_checklists')
    .update({ is_completed: isCompleted })
    .eq('id', itemId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/[locale]/internal/associate', 'page');
  return { success: true };
}

/**
 * ANALYTICS & PERFORMANCE ACTIONS
 */

export async function getPerformanceData(userId: string) {
  const supabase = await createServiceClient();

  const [
    { data: metrics },
    { data: tasks },
    { data: attendance },
    { data: commendations }
  ] = await Promise.all([
    supabase.from('performance_metrics').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('tasks').select('status').eq('assigned_to', userId),
    supabase.from('attendance_logs').select('check_in').eq('user_id', userId),
    supabase.from('commendations').select('*, mentor:profiles(full_name)').eq('user_id', userId).order('created_at', { ascending: false })
  ]);

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const inProgressTasks = tasks?.filter(t => t.status === 'in_progress').length || 0;

  const logs = attendance || [];
  const onTimeCheckins = logs.filter(log => {
    const checkInTime = new Date(log.check_in);
    const hour = checkInTime.getHours();
    const minute = checkInTime.getMinutes();
    return hour < 10 || (hour === 10 && minute === 0);
  }).length;

  const taskCompletion = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const attendanceConsistency = logs.length ? Math.min(Math.round((logs.length / 22) * 100), 100) : 0;
  const attendanceSync = logs.length ? Math.round((onTimeCheckins / logs.length) * 100) : 0;

  let tier = 'Tier C';
  if (attendanceConsistency >= 95 && taskCompletion >= 95) tier = 'Tier S';
  else if (attendanceConsistency >= 85 && taskCompletion >= 85) tier = 'Tier A';
  else if (attendanceConsistency >= 70 && taskCompletion >= 70) tier = 'Tier B';

  return {
    official: metrics || null,
    taskStats: {
      total: totalTasks,
      completed: completedTasks,
      in_progress: inProgressTasks,
      completion_rate: taskCompletion
    },
    attendanceStats: {
      consistency: attendanceConsistency,
      sync: attendanceSync,
      total_days: logs.length
    },
    reliability_tier: tier,
    commendations: commendations || []
  };
}

export async function getPerformanceTrends(userId: string) {
  const supabase = await createServiceClient();

  // Fetch tasks and attendance logs from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const startDateStr = thirtyDaysAgo.toISOString();

  const [{ data: tasks }, { data: attendance }] = await Promise.all([
    supabase.from('tasks').select('status, created_at').eq('assigned_to', userId).gte('created_at', startDateStr),
    supabase.from('attendance_logs').select('check_in').eq('user_id', userId).gte('check_in', startDateStr)
  ]);

  const trendData = [3, 2, 1, 0].map((weeksAgo) => {
    const end = new Date();
    end.setDate(end.getDate() - (weeksAgo * 7));
    const start = new Date(end);
    start.setDate(start.getDate() - 7);

    const weekTasks = (tasks || []).filter(t => {
      const date = new Date(t.created_at);
      return date >= start && date < end;
    });

    const weekAttendance = (attendance || []).filter(a => {
      const date = new Date(a.check_in);
      return date >= start && date < end;
    });

    const completed = weekTasks.filter(t => t.status === 'completed').length;
    const total = weekTasks.length;

    return {
      name: weeksAgo === 0 ? 'Current' : `Week -${weeksAgo}`,
      velocity: total ? Math.round((completed / total) * 100) : 0,
      quality: weekAttendance.length ? Math.min(Math.round((weekAttendance.length / 5) * 100), 100) : 0
    };
  });

  return trendData.reverse();
}

export async function getManagedTeam(managerId: string, userRole?: string) {
  const supabase = await createServiceClient();
  
  if (userRole === 'hr_manager' || userRole === 'super_admin') {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'intern')
      .order('full_name', { ascending: true });
      
    if (error) return [];
    return data || [];
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('manager_id', managerId)
    .order('full_name', { ascending: true });

  if (error) return [];
  return data || [];
}

export async function getUnassignedInterns() {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'intern')
    .is('manager_id', null)
    .order('full_name', { ascending: true });

  if (error) return [];
  return data || [];
}

export async function assignInternToManager(internId: string, managerId: string | null) {
  const { updateUserMapping } = await import("../admin/actions-modules/rbac");
  return updateUserMapping(internId, managerId);
}

export async function getAnnouncements() {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getPlatformMetrics(category?: string) {
  const supabase = await createServiceClient();
  let query = supabase.from('platform_metrics').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query.order('label', { ascending: true });
  if (error) return [];
  return data || [];
}

/**
 * FORMAL EVALUATION ACTIONS
 */
export async function savePerformanceEvaluation(data: {
  user_id: string;
  reviewer_id: string;
  productivity_score: number;
  quality_score: number;
  leadership_score: number;
  comments: string;
  period_start: string;
  period_end: string;
}) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('performance_metrics').insert(data);

  if (error) {
    console.error("Error saving evaluation:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/[locale]/internal/manager', 'page');
  revalidatePath('/[locale]/internal/associate', 'page');
  return { success: true };
}
/**
 * REFLECTION ACTIONS
 */
export async function saveWeeklyReflection(data: {
  user_id: string;
  wins: string;
  challenges: string;
  satisfaction: number;
}) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('weekly_reflections').insert({
    ...data,
    week_ending: new Date().toISOString()
  });

  if (error) {
    console.error("Error saving reflection:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
/**
 * LEAVE REQUEST ACTIONS
 */
export async function requestLeave(data: {
  user_id: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
}) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('leave_requests').insert({
    ...data,
    status: 'pending',
    created_at: new Date().toISOString()
  });

  if (error) {
    console.error("Error requesting leave:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getTeamReflections(managerId: string) {
  const supabase = await createServiceClient();

  // 1. Get managed user IDs
  const { data: team } = await supabase
    .from('profiles')
    .select('id')
    .eq('manager_id', managerId);

  if (!team || team.length === 0) return [];
  const teamIds = team.map(m => m.id);

  // 2. Fetch reflections
  const { data, error } = await supabase
    .from('weekly_reflections')
    .select('*, profiles(full_name, role)')
    .in('user_id', teamIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching team reflections:", error);
    return [];
  }
  return data;
}

export async function getTeamLeaveRequests(managerId: string) {
  const supabase = await createServiceClient();

  // 1. Get managed user IDs
  const { data: team } = await supabase
    .from('profiles')
    .select('id')
    .eq('manager_id', managerId);

  if (!team || team.length === 0) return [];
  const teamIds = team.map(m => m.id);

  // 2. Fetch leave requests
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*, profiles(full_name, role)')
    .in('user_id', teamIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching team leaves:", error);
    return [];
  }
  return data;
}

export async function updateLeaveStatus(requestId: string, status: 'approved' | 'rejected') {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('leave_requests')
    .update({
      status,
      reviewed_by: verifiedUser.id,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', requestId);

  if (error) {
    console.error("Error updating leave status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/[locale]/internal/team', 'layout');
  return { success: true };
}

export async function getInternProfiles() {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, department, avatar_url")
    .eq("role", "intern");

  return data || [];
}

export async function getMentorProfiles() {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, department, avatar_url")
    .in("role", ["team_lead", "manager", "super_admin", "supervisor"]);

  return data || [];
}

export async function scheduleInternalMeeting(data: {
  targetUserId: string,
  title: string,
  description: string,
  date: string,
  time: string,
  repeat: 'none' | 'daily' | 'weekly' | 'monthly'
}) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();

  let attendees: string[] = [];
  let targetUserName = "All Team Members";

  if (data.targetUserId === "all") {
    const { data: interns } = await supabase
      .from("profiles")
      .select("email")
      .eq("manager_id", verifiedUser.id);
    if (interns) {
      attendees = interns.map(i => i.email).filter(Boolean) as string[];
    }
  } else {
    // 1. Get target user email
    const { data: targetUser } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", data.targetUserId)
      .single();

    if (!targetUser) return { success: false, error: "Target user not found" };
    if (targetUser.email) attendees.push(targetUser.email);
    targetUserName = targetUser.full_name || "Unknown";
  }

  // 2. Get current user google tokens
  const { data: { user } } = await supabase.auth.admin.getUserById(verifiedUser.id);
  const googleTokens = user?.user_metadata?.google_tokens;

  let meetLink = `https://meet.google.com/placeholder`;
  let recurrence: string[] | undefined = undefined;

  if (data.repeat === 'daily') recurrence = ['RRULE:FREQ=DAILY;COUNT=30'];
  else if (data.repeat === 'weekly') recurrence = ['RRULE:FREQ=WEEKLY;COUNT=12'];
  else if (data.repeat === 'monthly') recurrence = ['RRULE:FREQ=MONTHLY;COUNT=6'];

  let eventId: string | null = null;
  if (googleTokens && attendees.length > 0) {
    try {
      oauth2Client.setCredentials(googleTokens);
      const startTime = new Date(`${data.date}T${data.time}:00+05:30`);
      const endTime = new Date(startTime.getTime() + 30 * 60000); // Default 30 mins

      const event = await createCalendarEvent(oauth2Client, {
        summary: data.title,
        description: data.description || `Internal Sync via MSME360 Portal`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        attendees: attendees,
        recurrence
      });
      if (event.hangoutLink) meetLink = event.hangoutLink;
      if (event.id) eventId = event.id;
    } catch (e) {
      console.error("Calendar integration failed", e);
    }
  }

  // 3. Log meeting in mentorship_bookings for visibility
  const { error } = await supabase
    .from('mentorship_bookings')
    .insert({
      mentee_id: data.targetUserId === "all" ? null : data.targetUserId,
      mentor_name: user?.user_metadata?.full_name || "System",
      expertise: `${data.title} || ${meetLink} || ${eventId || ''}`,
      scheduled_at: new Date(`${data.date}T${data.time}:00+05:30`).toISOString(),
      status: 'confirmed'
    });

  if (error) return { success: false, error: error.message };

  revalidatePath('/[locale]/internal/team', 'page');
  revalidatePath('/[locale]/internal/associate', 'page');

  return {
    success: true,
    meetLink,
    isRealGoogleMeet: !!googleTokens
  };
}
import * as googleAuth from "../admin/actions-modules/google-auth";

export async function getGoogleConnectionUrl(...args: Parameters<typeof googleAuth.getGoogleConnectionUrl>) {
  return googleAuth.getGoogleConnectionUrl(...args);
}
export async function linkGoogleAccount(...args: Parameters<typeof googleAuth.linkGoogleAccount>) {
  return googleAuth.linkGoogleAccount(...args);
}

export async function getScheduledSyncs(userId?: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return [];

  const supabase = await createServiceClient();
  let query = supabase
    .from('mentorship_bookings')
    .select('*')
    .order('scheduled_at', { ascending: true });

  if (userId) {
    query = query.eq('mentee_id', userId);
  } else if (verifiedUser.role !== 'admin' && verifiedUser.role !== 'ceo') {
    // For mentors, they might not have their ID in the table yet if we only store mentor_name
    // But for now, let's just return all for management, or filter by mentee for associates
    if (verifiedUser.role === 'associate' || verifiedUser.role === 'intern') {
      query = query.eq('mentee_id', verifiedUser.id);
    }
  }

  const { data } = await query;

  return (data || []).map(m => {
    const [title, link] = m.expertise.split(' || ');
    return {
      ...m,
      title: title || m.expertise,
      link: link || '#'
    };
  });
}
export async function disconnectGoogleAccount(...args: Parameters<typeof googleAuth.disconnectGoogleAccount>) {
  return googleAuth.disconnectGoogleAccount(...args);
}
export async function deleteMeeting(meetingId: string, type: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();

  let eventIdToDelete: string | null = null;

  if (type === 'Internal Sync') {
    const { data: meeting } = await supabase.from('mentorship_bookings').select('expertise').eq('id', meetingId).single();
    if (meeting) {
      const parts = (meeting.expertise || "").split(" || ");
      if (parts.length > 2) eventIdToDelete = parts[2];
    }
    const { error } = await supabase.from('mentorship_bookings').delete().eq('id', meetingId);
    if (error) return { success: false, error: error.message };
  } else {
    // For interviews, the meetingId is prefixed with {applicantId}_
    const applicantId = meetingId.split('_')[0];
    const { data: app } = await supabase.from('intern_applications').select('metadata').eq('id', applicantId).single();
    if (app) {
      const meta = { ...(app.metadata as Record<string, unknown>) };
      if (type === 'Technical Interview') {
        eventIdToDelete = meta.interview_event_id as string | null;
        delete meta.interview_date;
        delete meta.interview_time;
        delete meta.meeting_link;
        delete meta.interview_status;
        delete meta.interview_event_id;
      } else if (type === 'HR Interview') {
        eventIdToDelete = meta.hr_event_id as string | null;
        delete meta.hr_interview_date;
        delete meta.hr_interview_time;
        delete meta.hr_meeting_link;
        delete meta.hr_interview_status;
        delete meta.hr_event_id;
      }
      const { error } = await supabase.from('intern_applications').update({ metadata: meta }).eq('id', applicantId);
      if (error) return { success: false, error: error.message };
    }
  }

  // 2. Delete from Google Calendar if eventId exists and user has tokens
  if (eventIdToDelete) {
    const { data: { user: fullUser } } = await supabase.auth.admin.getUserById(verifiedUser.id);
    const googleTokens = fullUser?.user_metadata?.google_tokens;
    if (googleTokens) {
      try {
        const { getOAuth2Client, deleteCalendarEvent } = await import("@/lib/google-calendar");
        const oauth2Client = getOAuth2Client();
        oauth2Client.setCredentials(googleTokens);
        await deleteCalendarEvent(oauth2Client, eventIdToDelete);
      } catch (e) {
        console.error("Failed to delete calendar event:", e);
      }
    }
  }

  revalidatePath('/[locale]/internal/team', 'page');
  revalidatePath('/[locale]/admin/hiring', 'page');
  revalidatePath('/[locale]/internal/meetings', 'page');
  return { success: true };
}

export async function updateMeetingStatus(meetingId: string, type: string, status: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();

  if (type === 'Internal Sync') {
    const { error } = await supabase.from('mentorship_bookings').update({ status }).eq('id', meetingId);
    if (error) return { success: false, error: error.message };
  } else {
    const applicantId = meetingId.split('_')[0];
    const { data: app } = await supabase.from('intern_applications').select('metadata').eq('id', applicantId).single();
    if (app) {
      const meta = { ...(app.metadata as Record<string, unknown>) };
      if (type === 'Technical Interview') meta.interview_status = status;
      else if (type === 'HR Interview') meta.hr_interview_status = status;

      const { error } = await supabase.from('intern_applications').update({ metadata: meta }).eq('id', applicantId);
      if (error) return { success: false, error: error.message };
    }
  }

  revalidatePath('/[locale]/internal/team', 'page');
  revalidatePath('/[locale]/admin/hiring', 'page');
  return { success: true };
}

export async function rescheduleMeeting(meetingId: string, type: string, date: string, time: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();

  if (type === 'Internal Sync') {
    // 1. Fetch old meeting to preserve details
    const { data: oldMeeting } = await supabase.from('mentorship_bookings').select('*').eq('id', meetingId).single();
    if (!oldMeeting) return { success: false, error: "Original meeting not found" };

    // 2. Delete old meeting (this now also deletes from calendar)
    await deleteMeeting(meetingId, 'Internal Sync');

    // 3. Create new meeting (the "create new" part)
    const [title] = oldMeeting.expertise.split(' || ');
    return scheduleInternalMeeting({
      targetUserId: oldMeeting.mentee_id,
      title: title || oldMeeting.expertise,
      description: `Rescheduled meeting.`,
      date,
      time,
      repeat: 'none'
    });
  } else {
    // For recruitment interviews, use the dedicated scheduleInterview action
    // This handles Google Meet link regeneration and history logging properly
    const applicantId = meetingId.split('_')[0];
    const { scheduleInterview } = await import("../admin/actions-modules/hiring");
    return scheduleInterview(applicantId, date, time, 'none');
  }
}

export async function terminatePersonnel(targetUserId: string, reason: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();

  // 1. Check Authority Level
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', verifiedUser.id)
    .single();

  if (!profile) {
    return { success: false, error: "Failed to verify authority." };
  }
  
  const { STARTUP_ROLES } = await import('@/lib/constants/roles');
  const roleDef = STARTUP_ROLES[profile.role] || STARTUP_ROLES.user;
  
  if (roleDef.level > 3) {
    return { success: false, error: "Insufficient authority to terminate personnel." };
  }

  // 2. Get Target Details
  const { data: targetUser } = await supabase
    .from('profiles')
    .select('email, full_name, role')
    .eq('id', targetUserId)
    .single();

  if (!targetUser) {
    return { success: false, error: "Target personnel not found." };
  }

  // 3. Perform Soft Termination
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      is_verified: false, 
      role: 'terminated',
      department: 'Terminated',
      designation: 'Terminated'
    })
    .eq('id', targetUserId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Also try to update intern_applications if they were an intern
  await supabase
    .from('intern_applications')
    .update({ status: 'rejected' })
    .eq('email', targetUser.email);

  // 4. Log the action
  await supabase.from('system_logs').insert({
    action: 'PERSONNEL_TERMINATION',
    target: targetUser.full_name,
    user_id: verifiedUser.id,
    status: 'success'
  });

  // 5. Send Email
  if (targetUser.email) {
    const logoUrl = "https://dvawendqtpulzildqyqw.supabase.co/storage/v1/object/sign/Logo/icon-512.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81NTA4ZGQ3NS1hNWM2LTQ2Y2UtYTQ5OC1lZjMzMmM4YzI0NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMb2dvL2ljb24tNTEyLnBuZyIsImlhdCI6MTc3NzYxNDE3MCwiZXhwIjoxODA5MTUwMTcwfQ.jzlv1Da1ObeCD3mZHEleQFL77eZKItbXWTjLITEqu0o";
    const websiteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://msme360.vercel.app";

    const baseStyle = "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;";
    const containerStyle = "max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);";
    const headerStyle = "padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%); border-bottom: 1px solid #fee2e2;";
    const contentStyle = "padding: 40px; text-align: left;";
    const footerStyle = "padding: 30px; text-align: center; font-size: 12px; color: #64748b; background: #f8fafc;";
    const btnStyle = "display: inline-block; padding: 14px 32px; background-color: #dc2626; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 24px; transition: all 0.2s; text-align: center;";
    const h1Style = "color: #b91c1c; font-size: 24px; margin-bottom: 16px; margin-top: 0; text-align: center;";
    const pStyle = "color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;";
    const logoStyle = "height: 64px; margin-bottom: 20px;";

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contract Termination Notice</title>
</head>
<body style="${baseStyle}">
  <div style="${containerStyle}">
    <div style="${headerStyle}">
      <img src="${logoUrl}" alt="MSME360 Logo" style="${logoStyle}">
    </div>
    <div style="${contentStyle}">
      <h1 style="${h1Style}">Contract Termination Notice</h1>
      <p style="${pStyle}">Dear <strong>${targetUser.full_name}</strong>,</p>
      <p style="${pStyle}">This email serves as formal notice that your association with MSME 360 has been terminated, effective immediately.</p>
      
      <p style="${pStyle}"><strong>Reason for Termination:</strong></p>
      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #991b1b; font-style: italic; font-size: 15px;">${reason}</p>
      </div>
      
      <p style="${pStyle}">Your access to all internal platforms and resources has been revoked. If you have any pending queries regarding your final settlement or offboarding process, please reach out to Human Resources.</p>
      
      <div style="text-align: center;">
        <a href="mailto:contact.msme360@gmail.com" style="${btnStyle}">Contact HR Department</a>
      </div>
    </div>
    <div style="${footerStyle}">
      <p style="margin: 0;">&copy; 2026 MSME360. All rights reserved.</p>
      <p style="margin: 8px 0 0 0;">This is an automated administrative notification from <a href="${websiteUrl}" style="color: #2563eb; text-decoration: none;">MSME360</a>.</p>
    </div>
  </div>
</body>
</html>
    `;

    await sendEmail({
      to: targetUser.email,
      subject: "MSME 360: Contract Termination Notice",
      html: emailHtml
    });
  }

  revalidatePath('/[locale]/internal/team', 'page');
  return { success: true };
}
