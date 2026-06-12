import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase Browser Client
 * 
 * USE CASE: Client Components ("use client") only.
 * SECURITY: Uses the public anon key. Access is strictly controlled by Row-Level Security (RLS) policies.
 * SESSION: Automatically handles user session persistence via internal browser storage/cookies.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    realtime: {
      heartbeatIntervalMs: 15000, // Send heartbeat every 15 seconds
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
