import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase Standard Server Client
 * 
 * USE CASE: Server Components, Server Actions, and Route Handlers.
 * SECURITY: Uses the public anon key. Strictly bound by Row-Level Security (RLS).
 * SESSION: Reads and writes cookies to maintain the user session.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );
}

/**
 * Supabase Service Role Client (Administrative)
 * 
 * USE CASE: Background tasks, system migrations, or privileged operations.
 * SECURITY: BYPASSES ALL Row-Level Security (RLS). This is a "God Mode" client.
 * WARNING: NEVER use this client for requests that take untrusted user input without strict validation.
 * SESSION: Does NOT use cookies. Static administrative access only.
 */
export async function createServiceClient() {
  // CRITICAL SECURITY: Never use NEXT_PUBLIC_ for the service_role key.
  // This ensures the admin key never leaks to the browser.
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;
  
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SECRET_KEY is missing in environment variables.");
  }
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey!,
    {
      cookies: {
        getAll() { return []; },
        setAll() { },
      },
    }
  );
}

export async function getSession() {
  const supabase = await createClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch {
    return null;
  }
}

export async function getUser() {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
