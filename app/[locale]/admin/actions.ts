"use server";

import { createServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: string, department: string) {
  const supabase = await createServiceClient();
  
  const { error } = await supabase
    .from('profiles')
    .update({ role, department })
    .eq('id', userId);

  if (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/[locale]/admin/roles', 'page');
  return { success: true };
}

export async function getAllProfiles() {
  const supabase = await createServiceClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching all profiles:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetches all intern applications from the database.
 */
export async function getApplicants() {
  const supabase = await createServiceClient();
  
  const { data, error } = await supabase
    .from("intern_applications")
    .select("*")
    .order("applied_at", { ascending: false });

  if (error) {
    console.error("Error fetching applicants:", error);
    return [];
  }

  return data || [];
}

/**
 * Updates the recruitment status of an application.
 */
export async function updateApplicationStatus(id: string, status: string, reviewerId: string) {
  const supabase = await createServiceClient();

  const { error } = await supabase
    .from("intern_applications")
    .update({ 
      status, 
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/[locale]/admin/hiring", "page");
  return { success: true };
}

/**
 * Orchestrates the onboarding flow for a new Intern.
 */
export async function onboardIntern(applicationId: string, reviewerId: string) {
  const supabase = await createServiceClient();

  // 1. Fetch application details
  const { data: application, error: fetchError } = await supabase
    .from("intern_applications")
    .select("email, full_name, role")
    .eq("id", applicationId)
    .single();

  if (fetchError || !application) {
    return { success: false, error: "Application not found" };
  }

  // 2. Invite user via Supabase Auth (This triggers the onboarding email)
  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
    application.email,
    {
      data: {
        full_name: application.full_name,
        designation: application.role,
        role: "intern",
        level: "L1"
      }
    }
  );

  if (inviteError) {
    if (inviteError.message.includes("already registered")) {
      // Just update status anyway
      await supabase
        .from("intern_applications")
        .update({ status: "hired", reviewed_by: reviewerId, reviewed_at: new Date().toISOString() })
        .eq("id", applicationId);
      
      revalidatePath("/[locale]/admin/hiring", "page");
      return { success: true, message: "User already registered. Application updated." };
    }
    return { success: false, error: inviteError.message };
  }

  // 3. Update application status to 'hired'
  const { error: updateError } = await supabase
    .from("intern_applications")
    .update({ 
      status: "hired", 
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId
    })
    .eq("id", applicationId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath("/[locale]/admin/hiring", "page");
  return { success: true };
}
