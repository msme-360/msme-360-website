"use server";

import { createServiceClient } from "@/services/supabase/supabase-server";

/**
 * Shared System Action Logging
 */
export async function logSystemAction(
  action: string, 
  details: string, 
  status: 'success' | 'error' | 'warning' = 'success',
  userId?: string,
  target?: string
) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('system_logs') // Syncing with the table used in getAuditLogs
    .insert({
      action: `${action}${details ? `: ${details.substring(0, 50)}` : ''}`, 
      target: target || (details.length > 50 ? details : null),
      status,
      user_id: userId,
      created_at: new Date().toISOString()
    });

  if (error) console.error("Critical: Failed to log system action:", error);
}
