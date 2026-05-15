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

  // 2. Fetch all tasks, attendance logs, and formal metrics
  const [
    { data: tasks },
    { data: attendance },
    { data: metrics },
    { data: applications }
  ] = await Promise.all([
    supabase.from('associate_tasks').select('user_id, status'),
    supabase.from('attendance_logs').select('user_id, check_in, check_out'),
    supabase.from('performance_metrics').select('user_id, productivity_score, quality_score, leadership_score').order('created_at', { ascending: false }),
    supabase.from('intern_applications').select('reviewed_by, status, reviewed_at')
  ]);

  // 3. Aggregate Performance
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return profiles.map(profile => {
    const userTasks = tasks?.filter(t => t.user_id === profile.id) || [];
    const userReviews = applications?.filter(a => a.reviewed_by === profile.id) || [];
    const userAttendance = attendance?.filter(a => a.user_id === profile.id) || [];
    const userMetric = metrics?.find(m => m.user_id === profile.id);

    const completedTasks = userTasks.filter(t => t.status === 'completed').length;
    
    // Total activity includes missions + application reviews
    const totalActivity = userTasks.length + userReviews.length;
    const completedActivity = completedTasks + userReviews.length;

    const completionRate = totalActivity > 0 ? Math.round((completedActivity / totalActivity) * 100) : 0;

    // Reliability: Based on presence consistency in the last 30 days (compared to 22 business days)
    const recentLogs = userAttendance.filter(a => new Date(a.check_in) >= thirtyDaysAgo);
    
    // Fallback: If no logs but active in recruitment, they are considered active/reliable
    let attendanceScore = Math.min(100, Math.round((recentLogs.length / 22) * 100));
    if (attendanceScore === 0 && userReviews.length > 0) {
      attendanceScore = Math.min(100, 70 + (userReviews.length * 5)); // Baseline 70 + 5 per review
    }
    
    // Culture Fit: Use formal metrics if available, otherwise fallback to heuristics
    let cultureFit: 'Exceptional' | 'Standard' | 'Developing' = 'Standard';
    if (userMetric) {
      const avg = (userMetric.productivity_score + userMetric.quality_score + userMetric.leadership_score) / 3;
      if (avg >= 85) cultureFit = 'Exceptional';
      else if (avg >= 60) cultureFit = 'Standard';
      else cultureFit = 'Developing';
    } else {
      if (completionRate >= 95 && attendanceScore >= 90) cultureFit = 'Exceptional';
      else if (completionRate < 70 || attendanceScore < 70) cultureFit = 'Developing';
    }
    
    // Determine Last Audit date based on latest activity
    const latestReview = userReviews.sort((a, b) => 
      new Date(b.reviewed_at || 0).getTime() - new Date(a.reviewed_at || 0).getTime()
    )[0];

    return {
      id: profile.id,
      name: profile.full_name || "Unknown Agent",
      role: profile.role || "Associate",
      avatar_url: profile.avatar_url,
      // Priority: Formal Metrics > Live Logs
      reliability: userMetric ? userMetric.quality_score : attendanceScore,
      completion_rate: userMetric ? userMetric.productivity_score : completionRate,
      culture_fit: cultureFit,
      last_review: latestReview?.reviewed_at || new Date().toISOString()
    };
  });
}
