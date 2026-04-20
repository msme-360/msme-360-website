"use server";

import { createClient, createServiceClient, getUser } from "@/lib/supabase-server";
import { revalidateTag } from "next/cache";
import { logger } from "@/lib/logger";
import * as queries from "./queries";
import { 
  profileSchema, 
  ticketSchema, 
  teamMemberSchema, 
  progressSchema, 
  microAISchema,
  userSettingsSchema,
  communityPostSchema,
  mentorshipBookingSchema
} from "./schemas";

// --- Mutations / Actions ---

export async function updateProgress(stepId: string, completed: boolean) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;
  try {
    progressSchema.parse({ stepId, completed });

    const supabase = await createClient();
    
    // Map string IDs to numerical indices for the step_index column
    const stepMapping: Record<string, number> = {
      'udyam': 0,
      'dpiit': 1,
      'gst': 2,
      'bank': 3
    };
    const stepIndex = stepMapping[stepId] ?? 0;

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        module_name: 'formalization', // Default for this specific progress bar
        step_index: stepIndex,
        is_completed: completed,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,module_name' });

    if (error) throw error;

    logger.info("Progress updated", "actions.ts", { userId, stepId, completed });
    revalidateTag(`progress-${userId}`, "max");
    return { success: true };
  } catch (error) {
    logger.error("updateProgress error", "actions.ts", error);
    return { success: false, error: error instanceof Error ? error.message : "Update failed" };
  }
}

export async function updateProfile(profileData: Record<string, unknown>) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;
  try {
    profileSchema.parse(profileData);

    const supabase = await createClient();
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) throw error;

    logger.info("Profile updated", "actions.ts", { userId });
    revalidateTag(`profile-${userId}`, "max");
    return { success: true };
  } catch (error) {
    logger.error("updateProfile error", "actions.ts", error);
    return { success: false, error: error instanceof Error ? error.message : "Update failed" };
  }
}

export async function submitSupportTicket(data: { subject: string, message: string, category: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;
  try {
    ticketSchema.parse(data);

    const supabase = await createClient();
    const { error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        subject: data.subject,
        message: data.message,
        category: data.category,
        status: 'open',
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    logger.info("Support ticket created", "actions.ts", { userId, subject: data.subject });
    return { success: true };
  } catch (error) {
    logger.error("submitSupportTicket error", "actions.ts", error);
    return { success: false, error: error instanceof Error ? error.message : "Submission failed" };
  }
}

export async function submitMicroAIInterest(data: { revenue_band: string, data_readiness: string, capabilities: string[], comments: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;
  try {
    microAISchema.parse(data);

    const supabase = await createClient();
    const { error } = await supabase
      .from('microai_interest')
      .insert({
        user_id: userId,
        revenue_band: data.revenue_band,
        data_readiness: data.data_readiness,
        interested_capabilities: data.capabilities,
        comments: data.comments,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    logger.info("MicroAI interest submitted", "actions.ts", { userId });
    return { success: true };
  } catch (error) {
    logger.error("submitMicroAIInterest error", "actions.ts", error);
    return { success: false, error: error instanceof Error ? error.message : "Submission failed" };
  }
}

export async function generateGTMCampaign(title: string, roadmapData: Record<string, unknown>[]) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gtm_campaigns")
      .insert([{
        user_id: userId,
        title,
        roadmap_data: roadmapData,
        status: "Active"
      }])
      .select()
      .single();

    if (error) throw error;

    logger.info("GTM campaign generated", "actions.ts", { userId, title });
    revalidateTag(`gtm-campaigns-${userId}`, "max");
    return { success: true, data };
  } catch (error) {
    logger.error("generateGTMCampaign error", "actions.ts", error);
    return { success: false, error: error instanceof Error ? error.message : "Generation failed" };
  }
}

export async function addTeamMember(member: { full_name: string, role_key: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;
  try {
    teamMemberSchema.parse(member);

    const supabase = await createClient();
    const { error } = await supabase
      .from('team_members')
      .insert({
        user_id: userId,
        full_name: member.full_name,
        role_key: member.role_key,
        status: 'active'
      });

    if (error) throw error;

    logger.info("Team member added", "actions.ts", { userId, memberName: member.full_name });
    revalidateTag(`team-${userId}`, "max");
    return { success: true };
  } catch (error) {
    logger.error("addTeamMember error", "actions.ts", error);
    return { success: false, error: error instanceof Error ? error.message : "Addition failed" };
  }
}

export async function updateComplianceTaskStatus(taskId: string, status: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('compliance_tasks')
      .update({ status })
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;

    logger.info("Compliance task updated", "actions.ts", { userId, taskId, status });
    revalidateTag(`compliance-${userId}`, "max");
    return { success: true };
  } catch (error) {
    logger.error("updateComplianceTaskStatus error", "actions.ts", error);
    return { success: false, error: error instanceof Error ? error.message : "Update failed" };
  }
}

export async function updateUserSettings(data: Record<string, unknown>) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;
  try {
    userSettingsSchema.parse(data);

    const supabase = await createClient();
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...data,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) throw error;

    logger.info("User settings updated", "actions.ts", { userId });
    revalidateTag(`settings-${userId}`, "max");
    return { success: true };
  } catch (error) {
    logger.error("updateUserSettings error", "actions.ts", error);
    return { success: false, error: error instanceof Error ? error.message : "Update failed" };
  }
}

export async function postFounderUpdate(data: { content: string, category: string, type?: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;
  try {
    const supabase = await createClient();
    
    // Fetch profile for founder/company name
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_name')
      .eq('id', userId)
      .single();

    const payload = {
      user_id: userId,
      founder_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "Founder",
      company_name: profile?.company_name || "New Startup",
      content: data.content,
      category: data.category,
      type: data.type || 'Sparkles',
      created_at: new Date().toISOString()
    };

    communityPostSchema.parse(payload);

    const { error } = await supabase
      .from('community_posts')
      .insert(payload);

    if (error) throw error;

    logger.info("Founder update posted", "actions.ts", { userId });
    revalidateTag("community-updates", "max");
    return { success: true };
  } catch (error) {
    logger.error("postFounderUpdate error", "actions.ts", error);
    return { success: false, error: error instanceof Error ? error.message : "Post failed" };
  }
}

export async function bookMentorshipSlot(data: { mentor_name: string, expertise: string, scheduled_at: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;
  try {
    mentorshipBookingSchema.parse(data);

    const supabase = await createClient();
    const { error } = await supabase
      .from('mentorship_bookings')
      .insert({
        mentee_id: userId,
        mentor_name: data.mentor_name,
        expertise: data.expertise,
        scheduled_at: data.scheduled_at,
        status: 'pending'
      });

    if (error) throw error;

    logger.info("Mentorship booked", "actions.ts", { userId, mentor: data.mentor_name });
    revalidateTag("mentorship-slots", "max");
    return { success: true };
  } catch (error) {
    logger.error("bookMentorshipSlot error", "actions.ts", error);
    return { success: false, error: error instanceof Error ? error.message : "Booking failed" };
  }
}

export async function deleteProfile() {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;
  try {
    const supabase = await createServiceClient();
    
    // In a real app we might do more (GDPR compliance, etc)
    // Cascading deletes in schema handle related tables
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) throw error;

    logger.info("Profile deleted", "actions.ts", { userId });
    return { success: true };
  } catch (error) {
    logger.error("deleteProfile error", "actions.ts", error);
    return { success: false, error: error instanceof Error ? error.message : "Deletion failed" };
  }
}

// --- Relays (Fetching data via dynamic user context) ---

export async function fetchProgress() {
  const user = await getUser();
  if (!user) return [];
  return queries.getProgress(user.id);
}

export async function fetchUserSettings() {
  const user = await getUser();
  if (!user) return null;
  return queries.getUserSettings(user.id);
}

export async function fetchProfile() {
  const user = await getUser();
  if (!user) return null;
  return queries.getProfile(user.id, user.email);
}

export async function fetchSupportTickets() {
  const user = await getUser();
  if (!user) return [];
  return queries.getSupportTickets(user.id);
}

export async function fetchGTMCampaigns() {
  const user = await getUser();
  if (!user) return [];
  return queries.getGTMCampaigns(user.id);
}

export async function fetchTeamMembers() {
  const user = await getUser();
  if (!user) return [];
  return queries.getTeamMembers(user.id);
}

export async function fetchComplianceTasks() {
  const user = await getUser();
  if (!user) return [];
  return queries.getComplianceTasks(user.id);
}

export async function fetchFounderUpdates() {
  return queries.getFounderUpdates();
}

export async function fetchAvailableMentorshipSlots() {
  return queries.getAvailableMentorshipSlots();
}

export async function fetchSOPTemplates() {
  return queries.getSOPTemplates();
}

export async function fetchSchemes(query?: string) {
  return queries.getSchemes(query);
}

export async function fetchAIServices() {
  return queries.getAIServices();
}

export async function fetchTenders() {
  return queries.getTenders();
}

export async function fetchNicCodes() {
  return queries.getNicCodes();
}

export async function fetchGTMTemplates() {
  return queries.getGTMTemplates();
}
