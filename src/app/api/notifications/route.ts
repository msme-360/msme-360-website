import { createClient } from "@/services/supabase/supabase-server";
import { NextRequest } from "next/server";

/**
 * SSE Route for Real-time Notifications
 * Pushes new notifications to the client as they arrive.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const responseHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
  };

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data: { type: string; data?: Record<string, unknown>[] }) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Initial heart-beat
      sendEvent({ type: "connected" });

      // Poll as a concrete SSE implementation for this environment
      // In a production Supabase setup, you'd ideally use a Realtime listener here
      // but for standard SSE in Route Handlers, a controlled poll is robust.
      const interval = setInterval(async () => {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_read", false)
          .order("created_at", { ascending: false })
          .limit(10);

        if (!error && data && data.length > 0) {
          sendEvent({ type: "notifications", data });
        }
      }, 10000); // 10s intervals for real-time feel

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, { headers: responseHeaders });
}

