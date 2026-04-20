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
