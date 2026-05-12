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
    .select("*")
    .eq("is_archived", archived)
    .order("applied_at", { ascending: false });

  if (error) return [];
  return data || [];
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

  await logSystemAction(`APPLICATION_STATUS_${status.toUpperCase()}`, `Candidate ${applicant.full_name} moved to ${status}`, 'success', verifiedUser.id);

  if (['shortlisted', 'rejected', 'hired', 'onboarded'].includes(status)) {
    await sendCandidateEmail(applicant.email, applicant.full_name, status);
  }

  revalidatePath("/[locale]/admin/hiring", "page");
  revalidatePath("/[locale]/internal/hiring", "layout");
  revalidateTag('executive', "max");
  
  return { success: true };
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

  const { data: existingUser } = await supabase.auth.admin.listUsers();
  const userExists = existingUser.users.find(u => u.email === application.email);

  if (!userExists) {
    const { error: createError } = await supabase.auth.admin.createUser({
      email: application.email,
      email_confirm: true,
      user_metadata: {
        full_name: application.full_name,
        role: 'intern',
        department: application.department || 'Operations'
      }
    });
    if (createError) return { success: false, error: createError.message };
  }

  await updateApplicationStatus(applicationId, "onboarded");
  await logSystemAction("INTERN_ONBOARDED", `Intern ${application.full_name} onboarded`, 'success', verifiedUser.id);

  return { 
    success: true, 
    message: `Intern ${application.full_name} onboarded successfully! Invitation email sent.` 
  };
}

export async function scheduleInterview(applicationId: string, date: string, time: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { data: application } = await supabase.from("intern_applications").select("*").eq("id", applicationId).single();
  if (!application) return { success: false, error: "Application not found" };

  const { data: { user } } = await supabase.auth.admin.getUserById(verifiedUser.id);
  const googleTokens = user?.user_metadata?.google_tokens;

  let meetLink = `https://meet.google.com/placeholder`;
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
        attendees: [application.email]
      });
      if (event.hangoutLink) meetLink = event.hangoutLink;
    } catch (e) {
      console.error("Calendar integration failed", e);
    }
  }

  const { error } = await supabase
    .from("intern_applications")
    .update({ 
      status: 'under_review',
      metadata: {
        ...(application.metadata as Record<string, unknown> || {}),
        interview_date: date,
        interview_time: time,
        meeting_link: meetLink
      }
    })
    .eq("id", applicationId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/[locale]/admin/hiring", "page");
  return { success: true, meetLink, isRealGoogleMeet: !!googleTokens };
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
