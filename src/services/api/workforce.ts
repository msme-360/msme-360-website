import { createClient } from "@/services/supabase/supabase-server";
import { Database } from "@/types/supabase";

export type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Fetches the entire organizational workforce for executive oversight.
 * Strictly level-gated by RLS at the database level.
 */
export async function getWorkforce() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('career_level', { ascending: true })
    .order('full_name', { ascending: true });

  if (error) {
    console.error("Error fetching workforce:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetches department-specific workforce for departmental managers.
 */
export async function getDepartmentalWorkforce(department: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('department', department)
    .order('full_name', { ascending: true });

  if (error) {
    console.error(`Error fetching ${department} workforce:`, error);
    return [];
  }

  return data || [];
}

