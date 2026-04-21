import React, { Suspense } from "react";
import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { getRoleById } from "@/lib/constants/roles";
import DashboardLoading from "@/app/[locale]/dashboard/loading";

import { getTranslations } from "next-intl/server";

export default async function InternalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <InternalLayoutInner params={params}>
        {children}
      </InternalLayoutInner>
    </Suspense>
  );
}

async function InternalLayoutInner({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Internal.hub");
  const user = await getUser();
  
  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const profile = await getProfile(user.id);
  const userRole = profile?.role || 'user';
  const level = getRoleById(userRole).level;

  // 1. Governance (Level 0) belongs in Governance Control Center
  if (level === 0) {
    redirect(`/${locale}/admin/governance`);
  }

  // 2. Executives (Level 1 & 1.5) belong in Admin Strategy Portal
  if (level === 1 || level === 1.5) {
    redirect(`/${locale}/admin/executive`);
  }

  // 3. Directors (Level 2) belong in Admin Strategic Operations
  if (level === 2) {
    redirect(`/${locale}/admin/operations`);
  }

  // 3. External Users (Level 6) belong in Dashboard
  if (level === 6) {
    redirect(`/${locale}/dashboard`);
  }

  // Base permission for internal hub is now Level 5 (Associate/Intern)
  if (level > 5) {
    return <RestrictedAccess requiredLevel="Staff" />;
  }

  return (
    <SidebarProvider>
      <AdminSidebar userId={user.id} serverRole={userRole} />
      <SidebarInset className="bg-background relative">
        <header className="flex h-16 shrink-0 items-center border-b border-border/50 backdrop-blur-md bg-background/60 sticky top-0 z-20 px-6">
           <div className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{t("header")}</div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-10 px-4 md:px-6 lg:px-8 w-full">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
