import React, { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { ProgressProvider } from "@/components/dashboard/ProgressProvider";
import { DashboardClientLayer } from "./DashboardClientLayer";
import DashboardLoading from "./loading";
import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { redirect } from "next/navigation";
import { hasPermission, getRoleById } from "@/lib/constants/roles";
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
  if (hasPermission(userRole, 5)) {
    const level = getRoleById(userRole).level;
    if (level === 0) {
      redirect(`/${locale}/admin/governance`);
    } else if (level <= 1.5) {
      redirect(`/${locale}/admin/executive`);
    } else if (level === 2) {
      redirect(`/${locale}/admin/operations`);
    } else if (level <= 3.5) {
      redirect(`/${locale}/internal/manager`);
    } else if (level === 4) {
      redirect(`/${locale}/internal/staff`);
    } else {
      redirect(`/${locale}/internal/associate`);
    }
  }
  return (
    <DashboardClientLayer userId={user?.id} userRole={userRole}>
      {children}
    </DashboardClientLayer>
  );
}
