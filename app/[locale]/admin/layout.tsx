import React, { Suspense } from "react";
import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";
import DashboardLoading from "@/app/[locale]/dashboard/loading";

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
  const user = await getUser();
  
  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const profile = await getProfile(user.id);
  const userRole = profile?.role || 'user';

  // ROLE-BASED REDIRECTION SYSTEM
  // Level 0-1: Allowed to stay (Governance/Executive)
  // Level 2: Redirect to Operations Hub
  // Level 3-5: Redirect to their specific Internal Hubs
  // Level 6: Boot to User Dashboard

  if (hasPermission(userRole, 5) && !hasPermission(userRole, 1)) {
    // Role is internal staff (L2-L5) but not Executive (L0-L1)
    if (hasPermission(userRole, 2)) {
      redirect(`/${locale}/admin/operations`);
    } else if (hasPermission(userRole, 3)) {
      redirect(`/${locale}/internal/manager`);
    } else if (hasPermission(userRole, 4)) {
      redirect(`/${locale}/internal/staff`);
    } else {
      redirect(`/${locale}/internal/associate`);
    }
  }

  if (!hasPermission(userRole, 5)) {
    // Level 6 or unknown
    redirect(`/${locale}/dashboard`);
  }

  // Base permission check (redundant given the guard above, but kept for depth security)
  if (!hasPermission(userRole, 5)) {
    return <RestrictedAccess requiredLevel="Internal Staff" />;
  }

  return (
    <SidebarProvider>
      <AdminSidebar userId={user.id} serverRole={userRole} />
      <SidebarInset className="bg-background relative">
        <header className="flex h-16 shrink-0 items-center border-b border-border/50 backdrop-blur-md bg-background/60 sticky top-0 z-20 px-6 justify-between">
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">MSME 360 Governance</div>
          </div>
          <div className="flex items-center gap-4">
             {/* Dynamic Top Nav Elements could go here */}
          </div>
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
