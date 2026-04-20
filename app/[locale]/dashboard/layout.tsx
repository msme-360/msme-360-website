import React, { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { ProgressProvider } from "@/components/dashboard/ProgressProvider";
import { DashboardClientLayer } from "./DashboardClientLayer";
import DashboardLoading from "./loading";
import { getUser as getAuthUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";
import { getProfile } from "./queries";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Important for static generation of dashboard routes
  setRequestLocale(locale);

  return (
    <ProgressProvider>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardLayoutInner locale={locale}>
          {children}
        </DashboardLayoutInner>
      </Suspense>
    </ProgressProvider>
  );
}

async function DashboardLayoutInner({ children, locale }: { children: React.ReactNode, locale: string }) {
  // Accessing dynamic data (auth) inside a Suspense boundary prevents "Blocking Route" errors
  const user = await getAuthUser();
  
  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const profile = await getProfile(user.id);
  const userRole = profile?.role || 'user';

  // REDIRECTION GUARD: Internal roles (Level 0-5) belong in Professional Portals
  // Level 0-1: Admin, Level 2-3: Ops/Management, Level 4-5: Staff
  if (hasPermission(userRole, 5)) {
    // If they are an internal tier, push them to the right work portal
    if (hasPermission(userRole, 1)) {
      redirect(`/${locale}/admin/executive`);
    } else if (hasPermission(userRole, 3)) {
      redirect(`/${locale}/internal/manager`);
    } else {
      redirect(`/${locale}/internal/staff`);
    }
  }
  return (
    <DashboardClientLayer userId={user?.id}>
      {children}
    </DashboardClientLayer>
  );
}
