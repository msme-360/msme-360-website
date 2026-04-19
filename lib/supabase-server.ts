import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
 * Creates a Supabase client that does NOT read cookies.
 * This is safe to use inside "use cache" scopes in Next.js 16.
 * Note: Since it doesn't have a user session, it ignores RLS.
 * Use it ONLY for system tasks or when you pass a userId and trust the server-side logic to filter correctly.
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
