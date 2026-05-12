"use server";

import { createServiceClient, getUser } from "@/services/supabase/supabase-server";
import { revalidatePath } from "next/cache";
import { logSystemAction } from "./shared";

/**
 * POLICY & COMPLIANCE ACTIONS
 */

export async function getPolicyData() {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('corporate_policies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getPolicies() {
  return getPolicyData();
}

export async function createPolicy(policy: Record<string, unknown>) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('corporate_policies')
    .insert({
      ...policy,
      created_by: verifiedUser.id,
      updated_at: new Date().toISOString()
    });

  if (error) return { success: false, error: error.message };

  await logSystemAction("POLICY_CREATED", `Title: ${policy.title}`, 'success', verifiedUser.id);
  revalidatePath("/[locale]/internal/policy", "layout");
  return { success: true };
}

export async function updatePolicyStatus(id: string, status: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('corporate_policies')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  await logSystemAction("POLICY_STATUS_UPDATED", `Policy ${id} to ${status}`, 'success', verifiedUser.id);
  revalidatePath("/[locale]/internal/policy", "layout");
  return { success: true };
}

export async function upsertPolicy(policy: Record<string, unknown>) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from('corporate_policies')
    .upsert({
      ...policy,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logSystemAction(
    policy.id ? "POLICY_UPDATED" : "POLICY_CREATED",
    `Policy: ${policy.title} (v${policy.version})`,
    'success',
    verifiedUser.id
  );

  revalidatePath("/[locale]/internal/policy", "layout");
  return { success: true, data };
}
