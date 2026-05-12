"use server";

import { createServiceClient, getUser } from "@/services/supabase/supabase-server";
import { revalidatePath } from "next/cache";

/**
 * GOOGLE OAUTH ACTIONS
 */

export async function getGoogleConnectionUrl(redirectUri: string) {
  const { getOAuth2Client } = await import("@/lib/google-calendar");
  const client = getOAuth2Client(redirectUri);

  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });

  return { url };
}

export async function linkGoogleAccount(code: string, redirectUri: string) {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const { getOAuth2Client } = await import("@/lib/google-calendar");
  const client = getOAuth2Client(redirectUri);
  const { tokens } = await client.getToken(code);
  
  const supabase = await createServiceClient();
  const { data: { user }, error: fetchError } = await supabase.auth.admin.getUserById(verifiedUser.id);
  if (fetchError || !user) return { success: false, error: "User not found" };

  const { error } = await supabase.auth.admin.updateUserById(verifiedUser.id, {
    user_metadata: {
      ...user.user_metadata,
      google_tokens: tokens
    }
  });

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/[locale]/admin/hiring', 'page');
  revalidatePath('/[locale]/internal/hiring', 'layout');
  return { success: true };
}

export async function disconnectGoogleAccount() {
  const verifiedUser = await getUser();
  if (!verifiedUser) return { success: false, error: "Unauthorized" };

  const supabase = await createServiceClient();
  const { data: { user }, error: fetchError } = await supabase.auth.admin.getUserById(verifiedUser.id);
  if (fetchError || !user) return { success: false, error: "User not found" };

  const { error } = await supabase.auth.admin.updateUserById(verifiedUser.id, {
    user_metadata: {
      ...user.user_metadata,
      google_tokens: null
    }
  });

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/[locale]/admin/hiring', 'page');
  revalidatePath('/[locale]/internal/hiring', 'layout');
  return { success: true };
}
