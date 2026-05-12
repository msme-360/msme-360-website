import { Suspense } from "react";
import { getUser } from "@/services/supabase/supabase-server";
import { getNotifications } from "@/app/[locale]/internal/actions";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { NotificationsClient } from "@/app/[locale]/internal/notifications/NotificationsClient";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { redirect } from "next/navigation";

export default function AdminNotificationsPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<NotificationsSkeleton />}>
      <AdminNotificationsContent params={params} />
    </Suspense>
  );
}

async function AdminNotificationsContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const [profile, initialNotifications] = await Promise.all([
    getProfile(user.id, user.email),
    getNotifications(user.id)
  ]);

  if (!profile) {
    redirect(`/${locale}/dashboard`);
  }

  const userRole = profile.role || "user";

  // --- Silo Guard ---
  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // If hitting root /notifications, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/admin/notifications/${userRole}`);
  }

  // If attempting to access another role's notifications view, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/admin/notifications/${userRole}`);
  }

  return (
    <AdminViewWrapper
      title="Relay Center"
      subtitle="Administrative communications, system alerts, and operational comms feed."
      badgeLabel="SECURE COMMS"
      authorityLevel="System Admin"
    >
      <div className="max-w-4xl mx-auto">
        <NotificationsClient
          initialNotifications={initialNotifications}
          subView={subView}
        />
      </div>
    </AdminViewWrapper>
  );
}

function NotificationsSkeleton() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto p-8">
      <Skeleton className="h-12 w-1/4 mb-8" />
      {[1, 2, 3, 4, 5].map(i => (
        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  );
}

