import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { getInternalMeetings } from "@/app/[locale]/admin/actions-modules/governance";
import { redirect } from "next/navigation";
import MeetingsClient from "./MeetingsClient";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MeetingsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  return (
    <Suspense fallback={<MeetingsSkeleton />}>
      <MeetingsContent params={params} />
    </Suspense>
  );
}

async function MeetingsContent({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/login`);

  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || "user";

  const meetings = await getInternalMeetings(user.id, userRole);

  return (
    <MeetingsClient 
      initialMeetings={meetings} 
      userRole={userRole} 
    />
  );
}

function MeetingsSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
