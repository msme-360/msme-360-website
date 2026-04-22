import { Suspense } from "react";
import { getUser } from "@/lib/supabase-server";
import { getTasks } from "@/app/[locale]/internal/actions";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { AnalyticsClient } from "../AnalyticsClient";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AnalyticsPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getUser();
  if (!user) return <div>Unauthorized</div>;

  const [profile, tasks] = await Promise.all([
    getProfile(user.id, user.email),
    getTasks() 
  ]);

  if (!profile) return <div>Profile not found</div>;
  const userRole = profile.role || "user";
  const requestedRole = slug?.[0] || userRole;

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsClient 
          tasks={tasks}
          role={requestedRole}
        />
      </Suspense>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-12 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-80" />
    </div>
  );
}
