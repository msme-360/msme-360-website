"use server";

import { createServiceClient, getUser } from "@/services/supabase/supabase-server";
import { revalidatePath } from "next/cache";
import { logSystemAction } from "./shared";

/**
 * SUPPORT & HELP DESK ACTIONS
 */

export async function getSupportTickets(role?: string, department?: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return [];

  const supabase = await createServiceClient();
  let query = supabase
    .from('support_tickets')
    .select('*, profiles(full_name, email)');

  const isTechnical = department?.toLowerCase().includes('tech') || 
                      department?.toLowerCase().includes('eng') || 
                      role === 'super_admin';

  if (!isTechnical) {
    // Normal users only see their own tickets
    query = query.eq("user_id", verifiedUser.id);
  } else if (role !== 'super_admin') {
    // Tech/Eng users see all tickets (or you can scope to department if needed)
    // For now, let resolvers see all tickets so they can resolve them
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("[SUPPORT] Failed to fetch tickets:", error);
    return [];
  }
  return data || [];
}

export async function createSupportTicket(subject: string, message: string, category: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      user_id: verifiedUser.id,
      subject,
      message,
      category,
      status: 'open'
    })
    .select()
    .single();

  if (error) {
    console.error("[SUPPORT] Failed to create ticket:", error);
    return { success: false, error: error.message };
  }

  await logSystemAction("SUPPORT_TICKET_CREATED", `Ticket created: ${subject}`, 'success', verifiedUser.id);
  revalidatePath('/[locale]/admin/support', 'layout');
  revalidatePath('/[locale]/internal/support', 'layout');
  
  return { success: true, data };
}

export async function resolveSupportTicket(id: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('support_tickets')
    .update({ status: 'closed', resolved_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error("[SUPPORT] Failed to resolve ticket:", error);
    return { success: false, error: error.message };
  }

  await logSystemAction("SUPPORT_TICKET_RESOLVED", `Ticket ${id} resolved`, 'success', verifiedUser.id);
  revalidatePath('/[locale]/admin/support', 'layout');
  revalidatePath('/[locale]/internal/support', 'layout');
  
  return { success: true };
}
