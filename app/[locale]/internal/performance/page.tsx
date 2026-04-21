import { Suspense } from "react";
import { getUser } from "@/lib/supabase-server";
import { getPerformanceData, getPerformanceTrends } from "@/app/[locale]/internal/actions";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { PerformanceClient } from "./PerformanceClient";
import { Skeleton } from "@/components/ui/skeleton";

export default async function PerformancePage() {
  const user = await getUser();
  if (!user) return <div>Unauthorized</div>;

  const [profile, performanceData, trendData] = await Promise.all([
    getProfile(user.id, user.email),
    getPerformanceData(user.id),
    getPerformanceTrends(user.id)
  ]);

  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<PerformanceSkeleton />}>
        <PerformanceClient 
          performanceData={performanceData} 
          trendData={trendData}
        />
      </Suspense>
    </div>
  );
}

function PerformanceSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-12 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
