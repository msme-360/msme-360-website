import React, { Suspense } from "react";
import { getUser } from "@/services/supabase/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { hasPermission, getRoleById } from "@/lib/constants/roles";
import DashboardLoading from "@/app/[locale]/dashboard/loading";
import { getUnreadNotificationCount } from "@/app/[locale]/internal/actions";
import { getHomePath } from "@/lib/constants/navigation/roleNav";
import { AdminHeader } from "@/components/layout/AdminHeader";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AdminLayoutInner params={params}>
        {children}
      </AdminLayoutInner>
    </Suspense>
  );
}

async function AdminLayoutInner({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // PARALLEL DATA FETCHING (Industry Grade Performance)
  const [user, profileResult, unreadCount] = await Promise.all([
    getUser(),
    getUser().then(u => u ? getProfile(u.id) : null),
    getUser().then(u => u ? getUnreadNotificationCount(u.id) : 0)
  ]);

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const userRole = profileResult?.role || 'user';
  const roleData = getRoleById(userRole);
  const level = roleData.level;

  // ROLE-BASED PORTAL PROTECTION
  // Level 3-5: Internal Hubs (Redirect out of Admin)
  if (level >= 3 && level <= 5) {
    const internalPaths: Record<number | string, string> = {
      3: 'manager',
      3.5: 'manager',
      4: 'staff',
      5: 'associate'
    };
    redirect(`/${locale}/internal/${internalPaths[level]}`);
  }

  // Level 6: External Dashboard
  if (level === 6) {
    redirect(`/${locale}/dashboard`);
  }

  // Base permission check for Admin shell
  if (!hasPermission(userRole, 2)) {
    return <RestrictedAccess requiredLevel="Director" />;
  }

  // Use central role navigation registry for home path
  const homePath = getHomePath(userRole, locale);

  return (
    <SidebarProvider>
      <AdminSidebar userId={user.id} serverRole={userRole} />
      <SidebarInset className="bg-background relative min-w-0">
        <AdminHeader
          profile={profileResult}
          roleData={roleData}
          unreadCount={unreadCount}
          homePath={homePath}
          locale={locale}
          portalContext="admin"
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto py-10 px-4 md:px-6 lg:px-8 w-full">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

