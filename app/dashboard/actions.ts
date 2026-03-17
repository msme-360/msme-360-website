"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type ProgressStep = {
  id: string;
  label: string;
  completed: boolean;
};

export async function getProgress(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('step_id, completed')
      .eq('user_id', userId);

    if (error) throw error;

    // Map database rows to expected format or merge with defaults
    const defaults = [
      { id: 'udyam', label: 'Udyam Registration', completed: false },
      { id: 'dpiit', label: 'DPIIT Startup India', completed: false },
      { id: 'gst', label: 'GST Preparation', completed: false },
      { id: 'bank', label: 'Bank Account/KYC', completed: false },
    ];

    if (!data || data.length === 0) return defaults;

    return defaults.map(d => ({
      ...d,
      completed: data.find(r => r.step_id === d.id)?.completed ?? false
    }));
  } catch (error) {
    console.error("Supabase getProgress error:", error);
    // Fallback to defaults on error (e.g. if table doesn't exist yet)
    return [
      { id: 'udyam', label: 'Udyam Registration', completed: false },
      { id: 'dpiit', label: 'DPIIT Startup India', completed: false },
      { id: 'gst', label: 'GST Preparation', completed: false },
      { id: 'bank', label: 'Bank Account/KYC', completed: false },
    ];
  }
}

export async function updateProgress(userId: string, stepId: string, completed: boolean) {
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: userId, 
        step_id: stepId, 
        completed,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,step_id' });

    if (error) throw error;
    
    // Optional: Revalidate paths if needed for server-side updates
    // revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Supabase updateProgress error:", error);
    return { success: false, error };
  }
}
