import { AuditClient, type AuditLog } from "../AuditClient";
import { getAuditLogs } from "../../actions";
import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { getRoleById, hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuditLogsPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<AuditPortalSkeleton />}>
      <AuditPortalContent params={params} />
    </Suspense>
  );
}

async function AuditPortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/auth/login`);
  
  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || "user";
  const roleData = getRoleById(userRole);

  // --- Silo Guard ---
  // 1. Authorization Check (Governance L0, CFO L1, or Finance Dept VP/Director)
  const isAuthorized = hasPermission(userRole, 1) || (roleData.department === "Finance" && hasPermission(userRole, 3));

  if (!isAuthorized) {
    return <RestrictedAccess requiredLevel="Financial / System Audit" />;
  }

  // 2. Path-Based Entity Silo Guard
  const requestedRole = slug?.[0];

  // If hitting root /audit, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/admin/audit/${userRole}`);
  }

  // If attempting to access another role's audit view, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/admin/audit/${userRole}`);
  }

  const initialLogs: AuditLog[] = await getAuditLogs();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AuditClient initialLogs={initialLogs} />
    </div>
  );
}

function AuditPortalSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-10 w-1/4" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
    </div>
  );
}
