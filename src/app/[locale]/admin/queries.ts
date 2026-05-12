import { createServiceClient, getUser } from "@/services/supabase/supabase-server";
import { unstable_cache } from "next/cache";

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
 * Direct fetch (cache removed to resolve production rendering issues).
 */
export async function getAllProfiles(): Promise<AdminProfile[]> {
  try {
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
  } catch (err) {
    console.error("[getAllProfiles] Unexpected error:", err);
    return [];
  }
}
