"use server";

import { createServiceClient } from "@/lib/supabase-server";
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

    const { error } = await supabase
      .from('attendance_logs')
      .insert({ user_id: userId, check_in: new Date().toISOString() });

    if (error) return { success: false, error: error.message };
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

    const { error } = await supabase
      .from('attendance_logs')
      .update({ check_out: new Date().toISOString() })
      .eq('id', activeLog.id);

    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/[locale]/internal/associate', 'page');
  return { success: true };
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
  return data || [];
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
  
  // 1. Get task stats
  const { data: tasks } = await supabase
    .from('tasks')
    .select('status')
    .eq('assigned_to', userId);
    
  const taskStats = {
    total: tasks?.length || 0,
    completed: tasks?.filter(t => t.status === 'completed').length || 0,
    in_progress: tasks?.filter(t => t.status === 'in_progress').length || 0,
    completion_rate: tasks?.length ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0
  };

  // 2. Get attendance consistency
  const { data: attendance } = await supabase
    .from('attendance_logs')
    .select('check_in')
    .eq('user_id', userId);
    
  const attendanceStats = {
    total_days: attendance?.length || 0,
    // Just a placeholder for demo purposes - usually you'd compare with total workdays
    consistency: attendance?.length ? Math.min(Math.round((attendance.length / 20) * 100), 100) : 0 
  };

  return {
    taskStats,
    attendanceStats
  };
}
