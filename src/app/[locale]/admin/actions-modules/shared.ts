"use server";

import { createServiceClient } from "@/services/supabase/supabase-server";

/**
 * Shared System Action Logging
 */
export async function logSystemAction(
  action: string, 
  details: string, 
  status: 'success' | 'error' | 'warning' = 'success',
  userId?: string
) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('audit_logs')
    .insert({
      action_type: action,
      details,
      status,
      user_id: userId,
      created_at: new Date().toISOString()
    });

  if (error) console.error("Critical: Failed to log system action:", error);
}
