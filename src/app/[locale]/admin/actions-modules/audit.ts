"use server";

import { createServiceClient } from "@/services/supabase/supabase-server";

/**
 * SYSTEM AUDIT & LOGGING ACTIONS
 */

export async function getAuditLogs() {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('system_logs')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error("[AUDIT] Failed to fetch logs:", error);
    return [];
  }
  return data || [];
}
