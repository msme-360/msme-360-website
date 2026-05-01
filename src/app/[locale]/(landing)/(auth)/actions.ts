"use server";

import { createServiceClient, createClient } from "@/services/supabase/supabase-server";
import { redirect } from "next/navigation";

/**
 * Activates a hired intern's account by setting their password.
 * This bridges the gap between 'hired' status and 'active' auth status.
 */
export async function activateHiredUser(email: string, password: string) {
  const supabase = await createServiceClient();

  // 1. Verify they are hired/onboarded in our registry
  const { data: application, error: fetchError } = await supabase
    .from("intern_applications")
    .select("id, status")
    .eq("email", email.toLowerCase())
    .in("status", ["hired", "onboarded"])
    .single();

  if (fetchError || !application) {
    console.error("Activation failed: Not found in hired registry", email);
    return { success: false, error: "Email not found in recruitment registry. Please contact support." };
  }

  // 2. Check if auth user exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return { success: false, error: "Internal server error" };

  const existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    // If they exist (invited), update their password and confirm them
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { 
        password: password,
        email_confirm: true 
      }
    );

    if (updateError) {
      console.error("Activation failed: Update error", updateError);
      return { success: false, error: updateError.message };
    }
  } else {
    // If they don't exist, create them
    const { error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: "intern"
      }
    });

    if (createError) {
      console.error("Activation failed: Create error", createError);
      return { success: false, error: createError.message };
    }
  }

  return { success: true };
}

/**
 * Signs out the current user and clears session cookies.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
