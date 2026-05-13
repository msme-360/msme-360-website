import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createServiceClient } from "@/services/supabase/supabase-server";
import { CompanyRegistryClient } from "../CompanyRegistryClient";

export default function CompanyRegistryPage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  return (
    <Suspense fallback={<CompanyRegistrySkeleton />}>
      <CompanyRegistryContent params={params} />
    </Suspense>
  );
}

async function CompanyRegistryContent({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/login`);

  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || "user";

  // L2+ can access company registry
  if (!hasPermission(userRole, 2)) {
    return <RestrictedAccess requiredLevel="Director" />;
  }

  const requestedRole = slug?.[0];
  if (!requestedRole) redirect(`/${locale}/admin/company/${userRole}`);
  if (requestedRole !== userRole && !hasPermission(userRole, 0)) {
    redirect(`/${locale}/admin/company/${userRole}`);
  }

  const supabase = await createServiceClient();

  const [
    { data: companies },
    { data: nicCodes },
    { data: compliance },
    { data: teamMembers },
  ] = await Promise.all([
    // Registered businesses — profiles with company/business context
    supabase
      .from("profiles")
      .select("id, full_name, email, role, department, is_verified, created_at")
      .in("role", ["founder", "ceo", "managing_partner", "board_member"])
      .order("created_at", { ascending: false }),
    // Industry classification registry
    supabase
      .from("nic_codes")
      .select("*")
      .order("code", { ascending: true })
      .limit(100),
    // Compliance tasks (business compliance status)
    supabase
      .from("compliance_tasks")
      .select("id, title, status, due_date, user_id")
      .order("due_date", { ascending: true })
      .limit(50),
    // Team / workforce registry — unified from profiles with hierarchy data
    supabase
      .from("profiles")
      .select("id, full_name, role, department, designation, manager_id, avatar_url, is_verified")
      .not("role", "eq", "user") // Filter out external users
      .order("full_name", { ascending: true }),
  ]);

  return (
    <CompanyRegistryClient
      companies={companies || []}
      nicCodes={nicCodes || []}
      compliance={compliance || []}
      teamMembers={teamMembers || []}
      role={userRole}
    />
  );
}

function CompanyRegistrySkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-10 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}

