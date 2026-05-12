import { getUser } from "@/services/supabase/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { getPolicies } from "@/app/[locale]/admin/actions";
import { getRoleById, hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PolicyClient } from "./PolicyClient";

export default function PolicyPortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<PolicySkeleton />}>
      <PolicyContent params={params} />
    </Suspense>
  );
}

async function PolicyContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getUser();
  if (!user) redirect(`/${locale}/login`);

  const profile = await getProfile(user.id);
  const userRole = profile?.role || "user";
  const roleData = getRoleById(userRole);

  // --- Silo Guard ---
  // Ensure only HR/People Dept or higher can manage policies
  const isAuthorized = (roleData.department === "People" || hasPermission(userRole, 2));

  if (!isAuthorized) {
    return <RestrictedAccess requiredLevel="Policy Administration" />;
  }

  const policies = await getPolicies();
  const subView = slug?.[0];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PolicyClient
        initialPolicies={policies}
        userRole={userRole}
        subView={subView}
      />
    </div>
  );
}

function PolicySkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

