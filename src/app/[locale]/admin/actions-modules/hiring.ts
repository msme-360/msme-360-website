"use server";

import { createServiceClient, getUser } from "@/services/supabase/supabase-server";
import { revalidatePath, revalidateTag } from "next/cache";
import { CareerRole } from "@/lib/roles";
import { logSystemAction } from "./shared";
import { oauth2Client, createCalendarEvent } from "@/lib/google-calendar";
import { sendEmail } from "@/lib/email";

/**
 * HIRING & RECRUITMENT ACTIONS
 */

async function sendCandidateEmail(email: string, name: string, status: string, metadata?: Record<string, unknown>) {
  const subjectMap: Record<string, string> = {
    shortlisted: "Update from MSME360: You have been shortlisted!",
    rejected: "Update regarding your application with MSME360",
    hired: "Congratulations! You have been selected for MSME360",
    interview_scheduled: "Interview Scheduled: Meeting with MSME360",
    hr_interview_scheduled: "HR Interview Scheduled: Final Round with MSME360",
    application_received: "Application Received: Thank you for applying to MSME360",
    contacted: "Update regarding your MSME360 application",
    completed: "Congratulations on completing your MSME360 Internship!",
    promoted: "Congratulations on your promotion at MSME360!"
  };

  const subject = subjectMap[status] || "Update on your application";

  const getHtmlContent = (status: string, name: string) => {
    const logoUrl = "https://dvawendqtpulzildqyqw.supabase.co/storage/v1/object/sign/Logo/icon-512.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81NTA4ZGQ3NS1hNWM2LTQ2Y2UtYTQ5OC1lZjMzMmM4YzI0NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMb2dvL2ljb24tNTEyLnBuZyIsImlhdCI6MTc3NzYxNDE3MCwiZXhwIjoxODA5MTUwMTcwfQ.jzlv1Da1ObeCD3mZHEleQFL77eZKItbXWTjLITEqu0o";
    const websiteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://msme360.vercel.app";

    const baseStyle = "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;";
    const containerStyle = "max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);";
    const headerStyle = "padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%); border-bottom: 1px solid #f1f5f9;";
    const contentStyle = "padding: 40px; text-align: center;";
    const footerStyle = "padding: 30px; text-align: center; font-size: 12px; color: #64748b; background: #f8fafc;";
    const btnStyle = "display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 24px; transition: all 0.2s;";
    const h1Style = "color: #1e293b; font-size: 24px; margin-bottom: 16px; margin-top: 0;";
    const pStyle = "color: #475569; line-height: 1.6; font-size: 16px; margin-bottom: 16px;";
    const logoStyle = "height: 64px; margin-bottom: 20px;";

    let title = "";
    let description = "";
    let buttonText = "";
    let buttonLink = "";

    switch (status) {
      case 'application_received':
        title = "Application Received";
        description = `Thank you for applying to MSME360! We've successfully received your application. Our recruitment team will review your profile and contact you if there's a match.`;
        buttonText = "View Career Portal";
        buttonLink = `${websiteUrl}/careers`;
        break;
      case 'contacted':
        title = "Following Up";
        description = `Our team is interested in your profile and would like to move forward with your application. Please check your dashboard or stand by for further instructions.`;
        buttonText = "Go to Portal";
        buttonLink = `${websiteUrl}/login`;
        break;
      case 'interview_scheduled':
        title = "Interview Scheduled";
        const d = metadata?.date || 'To be confirmed';
        const t = metadata?.time || 'To be confirmed';
        description = `Your interview with MSME360 has been scheduled for <strong>${d}</strong> at <strong>${t}</strong> (IST). We look forward to speaking with you!`;
        buttonText = "Join Meeting";
        buttonLink = (metadata?.meet_link as string) || websiteUrl;
        break;
      case 'hr_interview_scheduled':
        title = "HR Interview Scheduled";
        const hrDate = metadata?.date || 'To be confirmed';
        const hrTime = metadata?.time || 'To be confirmed';
        description = `Congratulations! You have moved to the final stage. Your HR Interview with MSME360 has been scheduled for <strong>${hrDate}</strong> at <strong>${hrTime}</strong> (IST). This is the final round of our recruitment process.`;
        buttonText = "Join HR Interview";
        buttonLink = (metadata?.meet_link as string) || websiteUrl;
        break;
      case 'shortlisted':
        title = "Shortlisted for MSME360";
        description = `Thanks for your interest in MSME360! We are pleased to inform you that your application has been <strong>shortlisted</strong> for the next stage of our recruitment process. Our team will contact you soon to schedule an interview.`;
        buttonText = "Visit Career Portal";
        buttonLink = `${websiteUrl}/careers`;
        break;
      case 'rejected':
        title = "Application Update";
        description = `Thank you for your interest in MSME360. After careful consideration of your application, we regret to inform you that we will not be moving forward at this time. We wish you the best in your future endeavors.`;
        buttonText = "Explore Other Roles";
        buttonLink = `${websiteUrl}/careers`;
        break;
      case 'hired':
        title = "Congratulations!";
        description = `We are thrilled to offer you a position at MSME360! Your background and potential align perfectly with our mission. You will receive your onboarding instructions shortly.`;
        buttonText = "Go to Portal";
        buttonLink = `${websiteUrl}/login`;
        break;
      case 'onboarded':
        title = "Credentials Ready";
        description = `Your professional MSME360 credentials have been generated. You can now access our internal systems and start your first mission.`;
        buttonText = "Access Internal Dashboard";
        buttonLink = `${websiteUrl}/admin`;
        break;
      case 'completed':
        title = "Internship Completed!";
        description = `Congratulations on successfully completing your internship at MSME360! It has been a pleasure having you on the team. We wish you the absolute best in your next chapter.`;
        buttonText = "Download Certificate";
        buttonLink = `${websiteUrl}/admin/achievements`;
        break;
      case 'promoted':
        title = "Congratulations on Your Promotion!";
        const newRole = metadata?.new_role || 'your new role';
        description = `We are excited to announce your promotion to <strong>${newRole}</strong>! Your hard work and dedication have truly made a difference at MSME360.`;
        buttonText = "View New Role";
        buttonLink = `${websiteUrl}/admin/profile`;
        break;
      default:
        title = "Application Status Updated";
        description = `Your application status has been updated to: <strong>${status}</strong>. Please check the portal for more details.`;
        buttonText = "View Application";
        buttonLink = `${websiteUrl}/careers`;
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="${baseStyle}">
  <div style="${containerStyle}">
    <div style="${headerStyle}">
      <img src="${logoUrl}" alt="MSME360 Logo" style="${logoStyle}">
    </div>
    <div style="${contentStyle}">
      <h1 style="${h1Style}">${title}</h1>
      <p style="${pStyle}">Dear <strong>${name}</strong>,</p>
      <p style="${pStyle}">${description}</p>
      <a href="${buttonLink}" style="${btnStyle}">${buttonText}</a>
    </div>
    <div style="${footerStyle}">
      <p style="margin: 0;">&copy; 2026 MSME360. All rights reserved.</p>
      <p style="margin: 8px 0 0 0;">You received this email regarding your application on <a href="${websiteUrl}" style="color: #2563eb; text-decoration: none;">MSME360</a>.</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const html = getHtmlContent(status, name);
  const result = await sendEmail({
    to: email,
    subject,
    html
  });

  return result.success;
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
    .select("full_name, email, metadata, status")
    .eq("id", id)
    .single();

  if (!applicant) return { success: false, error: "Application not found" };

  // PREVENT DUPLICATE EMAILS & LOGS: If status is same, skip
  if (applicant.status === status) {
    return { success: true, message: "Status already set to this value." };
  }

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
  const updateRes = await updateApplicationStatus(applicationId, "hired");
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

  // Fetch reviewer name and role for UI and logic
  const { data: reviewerProfile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", verifiedUser.id)
    .single();

  const isHR = reviewerProfile?.role === 'hr_manager';

  const historyItem = {
    type: 'INTERVIEW',
    round: history.filter((h: Record<string, unknown>) => h.type === 'INTERVIEW').length + 1,
    timestamp: new Date().toISOString(),
    date: date,
    time: time,
    meet_link: meetLink,
    is_google_meet: !!googleTokens,
    label: isHR ? 'HR Interview Scheduled' : 'Interview Scheduled',
    is_hr_round: isHR
  };

  const metadataUpdate: Record<string, unknown> = {
    ...currentMetadata,
    history: [...history, historyItem]
  };

  if (isHR) {
    metadataUpdate.hr_interview_date = date;
    metadataUpdate.hr_interview_time = time;
    metadataUpdate.hr_meeting_link = meetLink;
  } else {
    metadataUpdate.interview_date = date;
    metadataUpdate.interview_time = time;
    metadataUpdate.meeting_link = meetLink;
  }

  const { error } = await supabase
    .from("intern_applications")
    .update({
      status: 'under_review',
      reviewed_by: verifiedUser.id,
      reviewed_at: new Date().toISOString(),
      metadata: metadataUpdate
    })
    .eq("id", applicationId);

  if (error) return { success: false, error: error.message };

  const isDuplicateMeeting = isHR 
    ? (currentMetadata.hr_interview_date === date && currentMetadata.hr_interview_time === time)
    : (currentMetadata.interview_date === date && currentMetadata.interview_time === time);

  if (!isDuplicateMeeting) {
    await sendCandidateEmail(application.email, application.full_name, isHR ? 'hr_interview_scheduled' : 'interview_scheduled', {
      date: date,
      time: time,
      meet_link: meetLink
    });
  }

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

export async function bulkSyncExistingEmails() {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const applicants = await getApplicants();
  const results = { sent: 0, failed: 0, skipped: 0 };

  for (const app of applicants) {
    let statusToMail = "";
    let metadata: Record<string, unknown> | undefined = undefined;

    switch (app.status) {
      case 'shortlisted': statusToMail = 'shortlisted'; break;
      case 'rejected': statusToMail = 'rejected'; break;
      case 'hired': statusToMail = 'hired'; break;
      case 'onboarded': statusToMail = 'onboarded'; break;
      case 'contacted': statusToMail = 'contacted'; break;
      case 'under_review': {
        const currentMetadata = (app.metadata as Record<string, unknown>) || {};
        const history = (currentMetadata.history as Array<Record<string, unknown>>) || [];
        const lastInterview = [...history].reverse().find((h) => h.type === 'INTERVIEW');
        if (lastInterview) {
            statusToMail = 'interview_scheduled';
            metadata = { 
              date: lastInterview.date, 
              time: lastInterview.time, 
              meet_link: lastInterview.meet_link 
            };
        } else {
            statusToMail = 'application_received';
        }
        break;
      }
      case 'pending': statusToMail = 'application_received'; break;
      default: 
        results.skipped++;
        continue;
    }

    if (statusToMail) {
      const success = await sendCandidateEmail(app.email, app.full_name, statusToMail, metadata);
      if (success) results.sent++; else results.failed++;
    }
  }

  return { success: true, results };
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
