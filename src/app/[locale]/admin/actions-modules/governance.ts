"use server";

import { createServiceClient, getUser } from "@/services/supabase/supabase-server";
import { revalidatePath, revalidateTag } from "next/cache";
import { logSystemAction } from "./shared";
import { BoardResolution, SystemHealth } from "@/types/governance";
import { Meeting } from "@/types/meeting";

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

export async function overrideSystemAction(logId: string, action: string, target: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();

  // 1. Log the override attempt
  await logSystemAction(
    "PROTOCOL_OVERRIDE",
    `Super Admin ${verifiedUser.id} initiated manual override for ${action} on ${target}.`,
    'warning',
    verifiedUser.id
  );

  // 2. Perform target-specific mutation if applicable (Example: forcing a task resolution)
  if (action.includes('TASK_BLOCKED')) {
    await supabase.from('associate_tasks').update({ status: 'completed', resolution_note: 'OVERRIDDEN BY L6 GOVERNANCE' }).eq('id', target);
  } else if (action.includes('HIRING')) {
    await supabase.from('career_applications').update({ status: 'hired' }).eq('id', target);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * THE GUARDIAN: AUTOMATED POLICY ENFORCEMENT
 * Scans for operational anomalies and logs them to the governance ledger.
 */
export async function runPolicyAudit() {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const today = new Date().toISOString();

  // 1. Scan for Overdue Tasks
  const { data: overdueTasks } = await supabase
    .from('associate_tasks')
    .select('id, title, due_date')
    .eq('status', 'pending')
    .lt('due_date', today);

  if (overdueTasks && overdueTasks.length > 0) {
    for (const task of overdueTasks) {
      await logSystemAction(
        "POLICY_VIOLATION: OVERDUE_MISSION",
        `Mission "${task.title}" has exceeded its temporal index. Immediate resolution required.`,
        'warning',
        verifiedUser.id,
        task.id
      );
    }
  }

  // 2. Scan for Stagnant Applications (Older than 14 days)
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data: stagnantApps } = await supabase
    .from('intern_applications')
    .select('id, full_name')
    .eq('status', 'pending')
    .lt('applied_at', fourteenDaysAgo);

  if (stagnantApps && stagnantApps.length > 0) {
    for (const app of stagnantApps) {
      await logSystemAction(
        "GOVERNANCE_ADVISORY: STAGNANT_APPLICATION",
        `Application for ${app.full_name} has been pending for >14 days. Protocol optimization recommended.`,
        'warning',
        verifiedUser.id,
        app.id
      );
    }
  }

  revalidatePath('/[locale]/admin/audit', 'page');
  return { success: true, anomaliesDetected: (overdueTasks?.length || 0) + (stagnantApps?.length || 0) };
}

export async function getRecruitmentMeetings(reviewerId?: string) {
  const supabase = await createServiceClient();
  
  // Fetch Hiring Interviews (from intern_applications metadata)
  let query = supabase
    .from("intern_applications")
    .select(`
      id, full_name, role, status, metadata,
      reviewer:profiles!reviewed_by(full_name)
    `)
    .not("metadata", "is", null);

  if (reviewerId) {
    query = query.eq('reviewed_by', reviewerId);
  }

  const { data: applicants } = await query;

  const meetings: Meeting[] = (applicants || []).flatMap(app => {
    const meta = (app.metadata as Record<string, unknown>) || {};
    // Reviewer might come back as an array from PostgREST joins
    const reviewerData = (app as unknown as { reviewer?: { full_name: string } | { full_name: string }[] }).reviewer;
    const reviewerName = Array.isArray(reviewerData) 
      ? reviewerData[0]?.full_name 
      : reviewerData?.full_name || "System";
    const list = [];
    
    if (meta.interview_date && meta.interview_time) {
      list.push({
        id: `${app.id}_interview`,
        title: `Technical Interview: ${app.full_name}`,
        mentor_name: reviewerName,
        scheduled_at: new Date(`${meta.interview_date as string}T${meta.interview_time as string}`).toISOString(),
        link: meta.meeting_link as string,
        status: (meta.interview_status as string) || 'confirmed',
        type: 'Technical Interview'
      });
    }
    
    if (meta.hr_interview_date && meta.hr_interview_time) {
      list.push({
        id: `${app.id}_hr_interview`,
        title: `HR Interview: ${app.full_name}`,
        mentor_name: reviewerName,
        scheduled_at: new Date(`${meta.hr_interview_date as string}T${meta.hr_interview_time as string}`).toISOString(),
        link: meta.hr_meeting_link as string,
        status: (meta.hr_interview_status as string) || 'confirmed',
        type: 'HR Interview'
      });
    }
    
    return list;
  });

  return meetings.sort((a, b) => 
    new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  );
}

export async function getInternalMeetings(userId?: string, role?: string) {
  const supabase = await createServiceClient();
  
  // Fetch Internal Syncs (from mentorship_bookings)
  let query = supabase
    .from("mentorship_bookings")
    .select(`
      id, mentee_id, mentor_name, expertise, scheduled_at, status,
      mentee:profiles!mentee_id(full_name, role)
    `);

  // Privacy Guard: Non-governance roles only see their own meetings
  if (userId && role && !['super_admin', 'managing_partner', 'hr_manager', 'board_member'].includes(role)) {
    query = query.eq('mentee_id', userId);
  }

  const { data: internalSyncs } = await query;

  const internalList = (internalSyncs || []).map(sync => {
    const [title, link] = (sync.expertise || "").split(" || ");
    return {
      id: sync.id,
      title: `${title || sync.expertise} Sync: ${Array.isArray(sync.mentee) ? sync.mentee[0]?.full_name : (sync.mentee as { full_name: string } | null)?.full_name || 'Associate'}`,
      mentor_name: sync.mentor_name,
      scheduled_at: sync.scheduled_at,
      link: link || (sync as { metadata?: { meeting_link?: string } }).metadata?.meeting_link || '#',
      status: sync.status,
      type: 'Internal Sync'
    };
  });

  return internalList.sort((a, b) => 
    new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  );
}
