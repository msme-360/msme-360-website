"use server";

import { createServiceClient, getUser } from "@/services/supabase/supabase-server";
import { revalidatePath, revalidateTag } from "next/cache";
import { logSystemAction } from "./shared";

/**
 * RBAC & PROFILE MANAGEMENT ACTIONS
 */

export async function updateUserRole(userId: string, role: string, department: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('profiles')
    .update({ role, department })
    .eq('id', userId);

  if (error) {
    console.error("Error updating user role:", error);
    await logSystemAction("Role Update Failed", `User: ${userId} to ${role}`, 'error', verifiedUser.id);
    return { success: false, error: error.message };
  }

  await logSystemAction("Role Modified", `User: ${userId} assigned ${role} (${department})`, 'success', verifiedUser.id);
  revalidatePath('/[locale]/admin/roles', 'page');
  revalidateTag('profiles', "max");
  return { success: true };
}

export async function updateUserProfile(targetUserId: string, updates: Record<string, unknown>) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { data: target } = await supabase.from('profiles').select('full_name, email').eq('id', targetUserId).single();

  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', targetUserId);

  if (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }

  await logSystemAction(
    "PROFILE_UPDATED",
    `${target?.full_name || target?.email || targetUserId}: Profile modified`,
    'success',
    verifiedUser.id
  );

  revalidatePath('/[locale]/admin/roles', 'page');
  revalidateTag('profiles', "max");
  return { success: true };
}

export async function inviteUser(payload: { email: string, full_name: string, role: string, department: string }) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();

  // 1. Create Auth User
  const { data: { user: newUser }, error: authError } = await supabase.auth.admin.inviteUserByEmail(payload.email, {
    data: {
      full_name: payload.full_name,
      role: payload.role,
      department: payload.department
    }
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return { success: false, error: "User already exists in the system." };
    }
    return { success: false, error: authError.message };
  }

  const newUserId = newUser?.id;
  if (newUserId) {
    // 2. Create/Update Profile (Redundant with trigger but ensures role/dept sync)
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: newUserId,
      email: payload.email,
      full_name: payload.full_name,
      role: payload.role,
      department: payload.department,
      is_verified: false,
    }, { onConflict: 'id' });

    if (profileError) {
      console.error("Error creating profile during invite:", profileError);
      return { success: false, error: "Auth account created, but profile synchronization failed." };
    }
  }

  await logSystemAction(
    "USER_INVITED",
    `${payload.full_name} (${payload.email}) invited as ${payload.role}`,
    'success',
    verifiedUser.id
  );

  revalidatePath('/[locale]/admin/roles', 'page');
  return { success: true, userId: newUserId };
}

export async function requestAccessElevation(level: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  await logSystemAction(
    "ELEVATION_REQUESTED",
    `User ${verifiedUser.id} requested elevation to ${level}`,
    'success',
    verifiedUser.id
  );

  return { success: true };
}

export async function deleteUserProfile(userId: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Error deleting user profile:", error);
    return { success: false, error: error.message };
  }

  await logSystemAction(
    "USER_DELETED",
    `Profile and Auth account for User ${userId} permanently removed by Super Admin (${verifiedUser.id}).`,
    'warning',
    verifiedUser.id
  );

  revalidatePath('/[locale]/admin/roles', 'page');
  revalidateTag('profiles', "max");
  return { success: true };
}

export async function updateUserMapping(userId: string, managerId: string | null) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { data: target } = await supabase.from('profiles').select('full_name').eq('id', userId).single();
  const { data: manager } = managerId ? await supabase.from('profiles').select('full_name').eq('id', managerId).single() : { data: null };

  const { error } = await supabase
    .from('profiles')
    .update({
      manager_id: managerId,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error("Error updating mapping:", error);
    return { success: false, error: error.message };
  }

  await logSystemAction(
    "MAPPING_UPDATED",
    `${target?.full_name}: Assigned to Lead ${manager?.full_name || "None"}`,
    'success',
    verifiedUser.id
  );

  revalidatePath('/[locale]/admin/company', 'page');
  revalidatePath('/[locale]/internal/team', 'layout');
  revalidateTag('profiles', "max");
  return { success: true };
}

export async function inviteNewUser(payload: { email: string, full_name: string, role: string, department: string }) {
  return inviteUser(payload);
}
