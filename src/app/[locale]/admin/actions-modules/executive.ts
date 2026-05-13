"use server";

import { createServiceClient, getUser } from "@/services/supabase/supabase-server";
import { unstable_cache } from "next/cache";

/**
 * EXECUTIVE ANALYTICS & MONITORING
 */

export const getExecutiveAnalytics = unstable_cache(
  async () => {
    const supabase = await createServiceClient();
    
    // 1. Hiring Velocity
    const { data: apps } = await supabase.from('intern_applications').select('applied_at, status');
    const hiringStats = (apps || []).reduce((acc: Record<string, { month: string, applicants: number, hired: number }>, app) => {
      const month = new Date(app.applied_at).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = { month, applicants: 0, hired: 0 };
      acc[month].applicants++;
      if (app.status === 'hired' || app.status === 'onboarded') acc[month].hired++;
      return acc;
    }, {});

    // 2. Governance Health
    const { data: resolutions } = await supabase.from('board_resolutions').select('status');
    const totalRes = resolutions?.length || 0;
    const passedRes = resolutions?.filter(r => r.status === 'passed').length || 0;

    // 4. Departmental Pulses
    const [
      { data: tickets },
      { data: team },
      { data: metrics }
    ] = await Promise.all([
      supabase.from('support_tickets').select('status'),
      supabase.from('profiles').select('id'),
      supabase.from('platform_metrics').select('value').eq('label', 'Uptime')
    ]);

    return {
      hiringVelocity: Object.values(hiringStats).slice(-6),
      governance: {
        total: totalRes,
        passed: passedRes,
        pending: totalRes - passedRes,
        health: totalRes > 0 ? (passedRes / totalRes) * 100 : 100
      },
      uptime: metrics?.[0]?.value || "99.9%",
      metrics: {
        totalPresence: "14 States",
        activeInternships: apps?.filter(a => a.status === 'onboarded').length.toString() || "0",
        aiCapability: "Level 4",
        complianceScore: "98.5%",
        supportLoad: tickets?.filter(t => t.status === 'open').length.toString() || "0",
        personnelCount: team?.length.toString() || "0"
      },
      roadmap: [
        { title: "MicroAI Hub Public Release", progress: 85, status: "On Track", color: "bg-primary" },
        { title: "Enterprise Mentorship Scale-up", progress: 40, status: "In Progress", color: "bg-accent" },
        { title: "State-wide Compliance Sync", progress: 15, status: "Planning", color: "bg-muted-foreground" },
      ],
      recentDecisions: [
        { id: 1, action: "Approved Q4 GTM Strategy", responsible: "Managing Partner", date: "2h ago" },
        { id: 2, action: "AI Hub Beta Expansion", responsible: "CTO", date: "5h ago" },
        { id: 3, action: "Internship Budget Reallocation", responsible: "CEO", date: "1d ago" },
      ]
    };
  },
  ['executive-analytics'],
  { revalidate: 600, tags: ['executive'] }
);

export type ExecutiveAnalytics = Awaited<ReturnType<typeof getExecutiveAnalytics>>;

export async function promoteUser(userId: string, nextRole: string, careerLevel?: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  
  // Get current user data for logging
  const { data: target } = await supabase.from('profiles').select('full_name, role').eq('id', userId).single();

  const { error } = await supabase
    .from('profiles')
    .update({ 
      role: nextRole,
      career_level: careerLevel,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };

  const { logSystemAction } = await import("./shared");
  await logSystemAction(
    "USER_PROMOTED",
    `${target?.full_name || userId} elevated from ${target?.role} to ${nextRole}${careerLevel ? ` (${careerLevel})` : ''}`,
    'success',
    verifiedUser.id
  );

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/[locale]/admin/executive", "layout");
  return { success: true };
}

export async function getTeamPerformanceStats() {
  const supabase = await createServiceClient();

  // 1. Fetch all profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, avatar_url, career_level');

  if (!profiles) return [];

  // 2. Fetch all tasks and attendance logs
  const [
    { data: tasks },
    { data: attendance }
  ] = await Promise.all([
    supabase.from('associate_tasks').select('user_id, status'),
    supabase.from('attendance_logs').select('user_id, check_in, check_out')
  ]);

  // 3. Aggregate Performance
  return profiles.map(profile => {
    const userTasks = tasks?.filter(t => t.user_id === profile.id) || [];
    const userAttendance = attendance?.filter(a => a.user_id === profile.id) || [];

    const completed = userTasks.filter(t => t.status === 'completed').length;
    const completionRate = userTasks.length > 0 ? Math.round((completed / userTasks.length) * 100) : 100;

    // Reliability: Based on presence consistency (Mocking some variance for now based on attendance count)
    const attendanceScore = Math.min(100, Math.max(70, 70 + (userAttendance.length * 5)));
    
    return {
      id: profile.id,
      name: profile.full_name || "Unknown Agent",
      role: profile.role || "Associate",
      avatar_url: profile.avatar_url,
      reliability: attendanceScore,
      completion_rate: completionRate,
      culture_fit: completionRate > 90 ? 'Exceptional' : completionRate > 70 ? 'Standard' : 'Developing',
      last_review: new Date().toISOString()
    };
  });
}
