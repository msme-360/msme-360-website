import { Suspense } from "react";
import { getUser } from "@/services/supabase/supabase-server";
import { getNotifications } from "@/app/[locale]/internal/actions";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { NotificationsClient } from "./NotificationsClient";
import { Skeleton } from "@/components/ui/skeleton";

export default async function NotificationsPage() {
  const user = await getUser();
  if (!user) return <div>Unauthorized</div>;

  const [profile, initialNotifications] = await Promise.all([
    getProfile(user.id, user.email),
    getNotifications(user.id)
  ]);

  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<NotificationsSkeleton />}>
        <NotificationsClient
          initialNotifications={initialNotifications}
        />
      </Suspense>
    </div>
  );
}

function NotificationsSkeleton() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <Skeleton className="h-12 w-1/4 mb-8" />
      {[1, 2, 3, 4, 5].map(i => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}
