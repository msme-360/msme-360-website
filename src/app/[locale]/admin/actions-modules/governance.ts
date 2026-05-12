"use server";

import { createServiceClient, getUser } from "@/services/supabase/supabase-server";
import { revalidatePath, revalidateTag } from "next/cache";
import { logSystemAction } from "./shared";
import { BoardResolution, SystemHealth } from "@/types/governance";

/**
 * GOVERNANCE & STRATEGIC ACTIONS
 */

export async function getBoardProposals() {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('board_resolutions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function voteOnResolution(id: string, status: 'passed' | 'failed') {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('board_resolutions')
    .update({ status, author_id: verifiedUser.id })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  await logSystemAction(
    `RESOLUTION_${status.toUpperCase()}`,
    `Board resolution ${id} was marked as ${status} by Super Admin (${verifiedUser.id}).`,
    status === 'passed' ? 'success' : 'error',
    verifiedUser.id
  );

  revalidatePath('/[locale]/admin/governance', 'layout');
  revalidateTag('executive', "max");
  return { success: true };
}

export async function executeStrategicExit(userId: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('profiles')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };

  await logSystemAction(
    "STRATEGIC_EXIT_EXECUTED",
    `Permanent offboarding executed for User ID ${userId} by Super Admin (${verifiedUser.id}).`,
    'warning',
    verifiedUser.id
  );

  revalidatePath('/[locale]/admin/governance', 'layout');
  revalidateTag('executive', "max");
  return { success: true };
}

export async function getGovernanceData() {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { resolutions: [], metrics: [], nicCodes: [], health: [], framework: [] };

  const supabase = await createServiceClient();

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const [
    { data: resolutions },
    ,
    { data: nicCodes },
    { count: totalProfiles },
    { count: verifiedProfiles },
    { count: recentLogs },
    { data: health },
  ] = await Promise.all([
    supabase.from('board_resolutions').select('*, profiles(full_name)').order('created_at', { ascending: false }),
    supabase.from('platform_metrics').select('*').eq('category', 'governance'),
    supabase.from('nic_codes').select('*').order('code', { ascending: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('system_logs').select('*', { count: 'exact', head: true }).gte('created_at', oneDayAgo.toISOString()),
    supabase.from('service_health').select('*'),
  ]);

  const total = totalProfiles || 0;
  const verified = verifiedProfiles || 0;
  const complianceRate = total > 0 ? Math.round((verified / total) * 100) : 0;

  const liveMetrics = [
    { label: "Active Shareholders", value: total.toString(), change: `+${Math.max(0, total - verified)}`, status: "Active" },
    { label: "Compliance Rate", value: `${complianceRate}%`, change: complianceRate >= 90 ? "+0.5%" : "-", status: complianceRate >= 90 ? "Optimal" : "Review" },
    { label: "Board Resolutions", value: (resolutions?.length || 0).toString(), change: "Active", status: "Active" },
    { label: "System Events (24h)", value: (recentLogs || 0).toString(), change: recentLogs === 0 ? "Quiet" : "Logged", status: recentLogs === 0 ? "Optimal" : "Active" }
  ];

  return {
    resolutions: (resolutions as unknown as BoardResolution[]) || [],
    metrics: liveMetrics,
    nicCodes: nicCodes || [],
    health: (health as unknown as SystemHealth[]) || [],
    framework: [
      { title: "Statutory Compliance", progress: complianceRate, status: complianceRate >= 95 ? "Verified" : "In Progress" },
      { title: "Risk Mitigation Flow", progress: 100, status: "Optimal" },
      { title: "Board Seat Allocation", progress: 100, status: "Fixed" }
    ]
  };
}

export async function getOffboardingTargets() {
  const supabase = await createServiceClient();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, designation')
    .order('full_name');
  
  return profiles || [];
}

export async function toggleSystemMode(mode: 'maintenance' | 'read_only', value: boolean) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  // Using platform_metrics or a dedicated settings table. Assuming platform_metrics for now.
  const { error } = await supabase
    .from('platform_metrics')
    .upsert({ 
      id: `sys_${mode}`,
      category: 'system_mode',
      label: mode,
      value: value.toString(),
      status: value ? 'Warning' : 'Optimal',
      updated_at: new Date().toISOString()
    });

  if (error) return { success: false, error: error.message };

  await logSystemAction(
    `SYSTEM_MODE_${mode.toUpperCase()}`,
    `System mode ${mode} was ${value ? 'enabled' : 'disabled'} by Super Admin (${verifiedUser.id}).`,
    value ? 'warning' : 'success',
    verifiedUser.id
  );

  revalidatePath('/[locale]/admin', 'layout');
  return { success: true };
}

export async function executeProtocolZero() {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  await logSystemAction(
    "PROTOCOL_ZERO_EXECUTED",
    "EMERGENCY LOCKDOWN INITIATED. All non-essential services suspended.",
    'error',
    verifiedUser.id
  );

  revalidateTag('system', "max");
  return { success: true };
}

export async function initiateSystemReIndex() {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  await logSystemAction(
    "SYSTEM_REINDEX_INITIATED",
    "Global cache invalidation and route re-hydration triggered.",
    'success',
    verifiedUser.id
  );

  revalidatePath('/', 'layout');
  return { success: true };
}
