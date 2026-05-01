"use server";

import { createServiceClient } from "@/services/supabase/supabase-server";
import { revalidatePath } from "next/cache";

/**
 * ATTENDANCE ACTIONS
 */

export async function logAttendance(userId: string, type: 'in' | 'out') {
  const supabase = await createServiceClient();
  const today = new Date().toISOString().split('T')[0];

  if (type === 'in') {
    // Check if already checked in today
    const { data: existing } = await supabase
      .from('attendance_logs')
      .select('id')
      .eq('user_id', userId)
      .gte('check_in', `${today}T00:00:00Z`)
      .lte('check_in', `${today}T23:59:59Z`)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "Already checked in today." };
    }

    const { data, error } = await supabase
      .from('attendance_logs')
      .insert({ user_id: userId, check_in: new Date().toISOString() })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    revalidatePath('/[locale]/internal/associate', 'page');
    return { success: true, data };
  } else {
    // Find active check-in today
    const { data: activeLog } = await supabase
      .from('attendance_logs')
      .select('id')
      .eq('user_id', userId)
      .is('check_out', null)
      .order('check_in', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!activeLog) {
      return { success: false, error: "No active check-in found to check out from." };
    }

    const { data, error } = await supabase
      .from('attendance_logs')
      .update({ check_out: new Date().toISOString() })
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
  status?: 'pending' | 'in_progress' | 'completed' | 'blocked';
  due_date?: string;
}) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('tasks').insert(data);

  if (error) return { success: false, error: error.message };

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

export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/[locale]/internal/associate', 'page');
  revalidatePath('/[locale]/internal/manager', 'page');
  return { success: true };
}

export async function updateTaskPoW(taskId: string, proofOfWork: string) {
  const supabase = await createServiceClient();
  const updateData: { proof_of_work: string; status?: 'pending' | 'in_progress' | 'completed' | 'blocked' } = { proof_of_work: proofOfWork };
  
  // If PoW is provided, auto-mark as completed
  if (proofOfWork && proofOfWork.trim().length > 0) {
    updateData.status = 'completed';
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

  // 1. Get official metrics
  const { data: metrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // 2. Get task stats (complementary)
  const { data: tasks } = await supabase
    .from('tasks')
    .select('status')
    .eq('assigned_to', userId);

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const inProgressTasks = tasks?.filter(t => t.status === 'in_progress').length || 0;

  // 3. Get attendance stats
  const { data: attendance } = await supabase
    .from('attendance_logs')
    .select('check_in')
    .eq('user_id', userId);

  const logs = attendance || [];
  const onTimeCheckins = logs.filter(log => {
    const checkInTime = new Date(log.check_in);
    const hour = checkInTime.getHours();
    const minute = checkInTime.getMinutes();
    // Punctuality rule: Before 10:00 AM
    return hour < 10 || (hour === 10 && minute === 0);
  }).length;

  const taskCompletion = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const attendanceConsistency = logs.length ? Math.min(Math.round((logs.length / 22) * 100), 100) : 0;
  const attendanceSync = logs.length ? Math.round((onTimeCheckins / logs.length) * 100) : 0;

  // 4. Calculate Reliability Tier
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
      total_days: logs.length,
      consistency: attendanceConsistency,
      sync: attendanceSync
    },
    reliability_tier: tier
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

export async function getTeamMembers() {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('team_members')
    .select('*, profiles(avatar_url)')
    .order('created_at', { ascending: true });

  if (error) return [];
  return data || [];
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
