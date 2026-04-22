import { Suspense } from "react";
import { getUser } from "@/services/supabase/supabase-server";
import { getPerformanceData, getPerformanceTrends } from "@/app/[locale]/internal/actions";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { PerformanceClient } from "../PerformanceClient";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";

export default function PerformancePage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<PerformanceSkeleton />}>
      <PerformanceContent params={params} />
    </Suspense>
  );
}

async function PerformanceContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const [profile, performanceData, trendData] = await Promise.all([
    getProfile(user.id, user.email || ""),
    getPerformanceData(user.id),
    getPerformanceTrends(user.id)
  ]);

  if (!profile) redirect(`/${locale}/dashboard`);
  const userRole = profile.role || "user";

  // --- Silo Guard ---
  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // If hitting root /performance, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/internal/performance/${userRole}`);
  }

  // If attempting to access another role's performance view, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/internal/performance/${userRole}`);
  }

  return (
    <div className="container mx-auto py-10">
      <PerformanceClient
        performanceData={performanceData}
        trendData={trendData}
        subView={subView}
      />
    </div>
  );
}

function PerformanceSkeleton() {
  return (
    <div className="p-8 space-y-8">
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
