import { createServiceClient, getUser } from "@/services/supabase/supabase-server";

export interface AdminProfile {
  id: string;
  full_name?: string;
  email?: string;
  role: string;
  department?: string;
  is_verified?: boolean;
}

/**
 * Fetches all platform profiles for the Global RBAC manager.
 * Requires a verified session — returns empty array if unauthenticated.
 */
export async function getAllProfiles(): Promise<AdminProfile[]> {
  const verifiedUser = await getUser();
  if (!verifiedUser) return [];

  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, department, is_verified")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("[getAllProfiles] Error fetching profiles:", error);
    return [];
  }

  return data || [];
}
