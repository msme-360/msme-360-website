"use server";

import { createServiceClient, getUser } from "@/services/supabase/supabase-server";
import { revalidatePath, revalidateTag } from "next/cache";
import { CareerRole } from "@/lib/roles";
import { logSystemAction } from "./shared";
import { oauth2Client, createCalendarEvent } from "@/lib/google-calendar";

/**
 * HIRING & RECRUITMENT ACTIONS
 */

async function sendCandidateEmail(email: string, name: string, status: string) {
  const subjectMap: Record<string, string> = {
    shortlisted: "Update from MSME 360: You have been shortlisted!",
    rejected: "Update regarding your application with MSME 360",
    hired: "Congratulations! You have been selected for MSME 360",
    onboarded: "Protocol Active: Your MSME 360 credentials are ready"
  };

  const subject = subjectMap[status] || "Update on your application";
  console.log(`[INDUSTRIAL_NOTIFICATION] Sender: recruitment@msme360.com`);
  console.log(`[INDUSTRIAL_NOTIFICATION] Recipient: ${email} (${name})`);
  console.log(`[INDUSTRIAL_NOTIFICATION] Subject: ${subject}`);
  return true;
}

export async function getApplicants(archived: boolean = false) {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("intern_applications")
    .select(`
      *,
      reviewer:profiles!reviewed_by(full_name)
    `)
    .eq("is_archived", archived)
    .order("applied_at", { ascending: false });

  if (error) return [];
  
  return (data || []).map(app => ({
    ...app,
    reviewer_name: (app as unknown as { reviewer: { full_name: string } }).reviewer?.full_name || "System"
  }));
}

export async function updateApplicationStatus(id: string, status: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();

  const { data: applicant } = await supabase
    .from("intern_applications")
    .select("full_name, email, metadata")
    .eq("id", id)
    .single();

  if (!applicant) return { success: false, error: "Application not found" };

  const currentMetadata = (applicant.metadata as Record<string, unknown>) || {};
  const history = Array.isArray(currentMetadata.history) ? currentMetadata.history : [];

  if (status !== 'rejected') {
    const { data: activeApps } = await supabase
      .from("intern_applications")
      .select("id, role, status")
      .eq("email", applicant.email)
      .neq("id", id)
      .in("status", ["pending", "under_review", "shortlisted", "hired"]);

    if (activeApps && activeApps.length > 0) {
      return { 
        success: false, 
        error: `Duplicate active application found for '${activeApps[0].role}'.`
      };
    }
  }

  const historyItem = {
    type: 'STATUS_CHANGE',
    status: status,
    timestamp: new Date().toISOString(),
    by: verifiedUser.id,
    label: `Status changed to ${status.replace('_', ' ')}`
  };

  const { error } = await supabase
    .from("intern_applications")
    .update({ 
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: verifiedUser.id,
      metadata: {
        ...currentMetadata,
        history: [...history, historyItem]
      }
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  // Fetch the reviewer's name to return to the client for immediate UI update
  const { data: reviewerProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", verifiedUser.id)
    .single();

  await logSystemAction(`APPLICATION_STATUS_${status.toUpperCase()}`, `Candidate ${applicant.full_name} moved to ${status}`, 'success', verifiedUser.id);

  if (['shortlisted', 'rejected', 'hired', 'onboarded'].includes(status)) {
    await sendCandidateEmail(applicant.email, applicant.full_name, status);
  }

  revalidatePath("/[locale]/admin/hiring", "page");
  revalidatePath("/[locale]/internal/hiring", "layout");
  revalidateTag('executive', "max");
  
  return { 
    success: true, 
    reviewer_name: reviewerProfile?.full_name || "System" 
  };
}

export async function onboardIntern(applicationId: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { data: application } = await supabase
    .from("intern_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (!application) return { success: false, error: "Application not found" };

  // 1. Ensure Auth User Exists
  const { data: existingUser } = await supabase.auth.admin.listUsers();
  let userId = existingUser.users.find(u => u.email === application.email)?.id;

  if (!userId) {
    const { data: newUser, error: createError } = await supabase.auth.admin.inviteUserByEmail(application.email, {
      data: {
        full_name: application.full_name,
        role: 'intern',
        department: application.department || 'Operations'
      }
    });
    if (createError) return { success: false, error: createError.message };
    userId = newUser.user.id;
  }

  const mentorId = (application.metadata as Record<string, unknown>)?.mentor_id as string | undefined;

  // 2. Create/Update Profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    full_name: application.full_name,
    email: application.email,
    role: 'intern',
    department: application.department || 'Operations',
    designation: application.role || 'Intern',
    manager_id: mentorId,
    metadata: {
      hired_from: applicationId,
      hired_at: new Date().toISOString(),
      onboarding_status: 'active'
    }
  });

  if (profileError) console.error("Profile sync error:", profileError);

  // 3. Initialize Onboarding Checklist
  const DEFAULT_ONBOARDING_TASKS = [
    "ACCOUNT: Set up MSME 360 professional profile",
    "ACCOUNT: Enable Multi-Factor Authentication (MFA)",
    "LEGAL: Review and sign Non-Disclosure Agreement (NDA)",
    "LEGAL: Complete Data Privacy Training module",
    "DEPT: Review Departmental Operational Protocols",
    "TECHNICAL: Access internal Git repositories and tools",
    "INFRASTRUCTURE: Configure VPN and secure access nodes",
    "TECHNICAL: Complete Initial Technical Skills Assessment"
  ];

  const checklistItems = DEFAULT_ONBOARDING_TASKS.map(task => ({
    user_id: userId,
    task_name: task,
    is_completed: false
  }));

  const { error: checklistError } = await supabase
    .from('intern_onboarding_checklists')
    .insert(checklistItems);

  if (checklistError) console.error("Checklist init error:", checklistError);

  // 4. Update Application Status
  const updateRes = await updateApplicationStatus(applicationId, "onboarded");
  await logSystemAction("INTERN_ONBOARDED", `Intern ${application.full_name} onboarded and profile initialized`, 'success', verifiedUser.id);

  return { 
    success: true, 
    message: `Intern ${application.full_name} onboarded successfully! Profile and checklist initialized.`,
    reviewer_name: updateRes.reviewer_name
  };
}

export async function scheduleInterview(applicationId: string, date: string, time: string, repeat: 'none' | 'daily' | 'weekly' | 'monthly' = 'none') {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { data: application } = await supabase.from("intern_applications").select("*").eq("id", applicationId).single();
  if (!application) return { success: false, error: "Application not found" };

  const { data: { user } } = await supabase.auth.admin.getUserById(verifiedUser.id);
  const googleTokens = user?.user_metadata?.google_tokens;

  let meetLink = `https://meet.google.com/placeholder`;
  let recurrence: string[] | undefined = undefined;

  if (repeat === 'daily') recurrence = ['RRULE:FREQ=DAILY;COUNT=30'];
  else if (repeat === 'weekly') recurrence = ['RRULE:FREQ=WEEKLY;COUNT=12'];
  else if (repeat === 'monthly') recurrence = ['RRULE:FREQ=MONTHLY;COUNT=6'];

  if (googleTokens) {
    try {
      oauth2Client.setCredentials(googleTokens);
      const startTime = new Date(`${date}T${time}:00+05:30`);
      const endTime = new Date(startTime.getTime() + 45 * 60000);
      
      const event = await createCalendarEvent(oauth2Client, {
        summary: `Interview: ${application.full_name}`,
        description: `Scheduled via MSME360 Hiring Portal`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        attendees: [application.email],
        recurrence
      });
      if (event.hangoutLink) meetLink = event.hangoutLink;
    } catch (e) {
      console.error("Calendar integration failed", e);
    }
  }

  const currentMetadata = (application.metadata as Record<string, unknown>) || {};
  const history = Array.isArray(currentMetadata.history) ? currentMetadata.history : [];
  
  const historyItem = {
    type: 'INTERVIEW',
    round: history.filter((h: Record<string, unknown>) => h.type === 'INTERVIEW').length + 1,
    timestamp: new Date().toISOString(),
    date: date,
    time: time,
    meet_link: meetLink,
    is_google_meet: !!googleTokens,
    label: 'Interview Scheduled'
  };

  const { error } = await supabase
    .from("intern_applications")
    .update({ 
      status: 'under_review',
      reviewed_by: verifiedUser.id,
      reviewed_at: new Date().toISOString(),
      metadata: {
        ...currentMetadata,
        interview_date: date,
        interview_time: time,
        meeting_link: meetLink,
        history: [...history, historyItem]
      }
    })
    .eq("id", applicationId);

  if (error) return { success: false, error: error.message };

  // Fetch reviewer name for UI
  const { data: reviewerProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", verifiedUser.id)
    .single();

  revalidatePath("/[locale]/admin/hiring", "page");

  return { 
    success: true, 
    meetLink, 
    isRealGoogleMeet: !!googleTokens,
    reviewer_name: reviewerProfile?.full_name || "System"
  };
}

export async function archiveApplication(id: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from("intern_applications").update({ is_archived: true }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/[locale]/admin/hiring", "page");
  return { success: true };
}

export async function restoreApplication(id: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from("intern_applications").update({ is_archived: false }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/[locale]/admin/hiring", "page");
  return { success: true };
}

export async function getCareerRoles(type?: 'internship' | 'job') {
  const supabase = await createServiceClient();
  let query = supabase
    .from('career_roles')
    .select('*');

  if (type) {
    query = query.eq('type', type);
  }

  const { data } = await query.order('created_at', { ascending: false });
  return data || [];
}

export async function saveCareerRole(role: Partial<CareerRole>) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from("career_roles").upsert(role);
  if (error) return { success: false, error: error.message };
  revalidatePath("/[locale]/admin/hiring", "page");
  return { success: true };
}

export async function deleteCareerRole(slug: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from("career_roles").delete().eq("slug", slug);
  if (error) return { success: false, error: error.message };
  revalidatePath("/[locale]/admin/hiring", "page");
  return { success: true };
}

export async function getApplicationMetrics(applicationId?: string) {
  const supabase = await createServiceClient();
  let query = supabase.from("application_metrics").select("*");
  if (applicationId) {
    query = query.eq("application_id", applicationId);
  }
  const { data } = await query;
  return data || [];
}

export async function saveApplicationMetric(metric: Record<string, unknown>) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from("application_metrics").upsert(metric);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteApplicationMetric(applicationId: string, role: string, metricName: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from("application_metrics")
    .delete()
    .eq("application_id", applicationId)
    .eq("evaluator_role", role)
    .eq("metric_name", metricName);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// --- ONBOARDING & MENTORSHIP ---

export async function getMentorProfiles() {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, department")
    .in("role", ["team_lead", "manager", "super_admin", "supervisor"]);
  
  return data || [];
}

export async function updateOnboardingProgress(applicationId: string, checklist: Record<string, boolean>) {
  const supabase = await createServiceClient();
  const { data: applicant } = await supabase
    .from("intern_applications")
    .select("metadata")
    .eq("id", applicationId)
    .single();

  const currentMetadata = (applicant?.metadata as Record<string, unknown>) || {};

  const { error } = await supabase
    .from("intern_applications")
    .update({
      metadata: {
        ...currentMetadata,
        onboarding_checklist: checklist
      }
    })
    .eq("id", applicationId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateOnboardingDetails(applicationId: string, details: { mentor_id: string, template_id: string }) {
  const supabase = await createServiceClient();
  const { data: applicant } = await supabase
    .from("intern_applications")
    .select("metadata")
    .eq("id", applicationId)
    .single();

  const currentMetadata = (applicant?.metadata as Record<string, unknown>) || {};

  const { error } = await supabase
    .from("intern_applications")
    .update({
      metadata: {
        ...currentMetadata,
        mentor_id: details.mentor_id,
        template_id: details.template_id
      }
    })
    .eq("id", applicationId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/[locale]/admin/hiring", "page");
  return { success: true };
}

export async function updateApplicationRole(id: string, newRole: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();

  const { data: applicant } = await supabase
    .from("intern_applications")
    .select("full_name, role, metadata")
    .eq("id", id)
    .single();

  if (!applicant) return { success: false, error: "Application not found" };

  const currentMetadata = (applicant.metadata as Record<string, unknown>) || {};
  const history = Array.isArray(currentMetadata.history) ? currentMetadata.history : [];

  const historyItem = {
    type: 'ROLE_CHANGE',
    old_role: applicant.role,
    new_role: newRole,
    timestamp: new Date().toISOString(),
    by: verifiedUser.id,
    label: `Role changed from ${applicant.role} to ${newRole}`
  };

  const { error } = await supabase
    .from("intern_applications")
    .update({ 
      role: newRole,
      metadata: {
        ...currentMetadata,
        history: [...history, historyItem]
      }
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  await logSystemAction('APPLICATION_ROLE_UPDATE', `Candidate ${applicant.full_name} role updated to ${newRole}`, 'warning', verifiedUser.id);

  revalidatePath("/[locale]/admin/hiring", "page");
  revalidatePath("/[locale]/internal/hiring", "layout");
  
  return { success: true };
}
