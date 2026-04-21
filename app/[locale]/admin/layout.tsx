import React, { Suspense } from "react";
import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { hasPermission, getRoleById } from "@/lib/constants/roles";
import DashboardLoading from "@/app/[locale]/dashboard/loading";
import { AdminBreadcrumbs } from "@/components/layout/AdminBreadcrumbs";
import { OmniboxTrigger } from "@/components/layout/OmniboxTrigger";
import { SystemStatus } from "@/components/layout/SystemStatus";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import Link from "next/link";

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
  const [user, profileResult] = await Promise.all([
    getUser(),
    getUser().then(u => u ? getProfile(u.id) : null)
  ]);
  
  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const userRole = profileResult?.role || 'user';
  const roleData = getRoleById(userRole);
  const level = roleData.level;

  // ROLE-BASED PORTAL PROTECTION
  // Level 3-5: Internal Hubs (Redirect out of Admin)
  if (level >= 3 && level <= 5) {
    const internalPaths: Record<number | string, string> = {
      3: 'manager',
      3.5: 'manager', // NEW: Supervisory redirects to Manager Hub
      4: 'staff',
      5: 'associate'
    };
    redirect(`/${locale}/internal/${internalPaths[level]}`);
  }

  // Level 6: External Dashboard
  if (level === 6) {
    redirect(`/${locale}/dashboard`);
  }

  // Base permission check for Admin shell is Level 2 (Director) or Level 1.5 (VP) or Level 1 (Exec)
  if (!hasPermission(userRole, 2)) {
    return <RestrictedAccess requiredLevel="Director" />;
  }


  return (
    <SidebarProvider>
      <AdminSidebar userId={user.id} serverRole={userRole} />
      <SidebarInset className="bg-background relative">
        <header className="flex h-16 shrink-0 items-center border-b border-border/50 backdrop-blur-xl bg-background/40 sticky top-0 z-20 px-6 justify-between gap-4">
          <div className="flex items-center gap-6 min-w-0">
             <div className="hidden lg:flex items-center gap-2 border-r border-border/50 pr-6 shrink-0">
                <div className="w-2 h-6 bg-primary rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/80">MSME 360</span>
             </div>
             <AdminBreadcrumbs locale={locale} />
          </div>

          <div className="flex-1 flex justify-center max-w-md">
             <OmniboxTrigger />
          </div>

          <div className="flex items-center gap-4 shrink-0">
             <SystemStatus />
             
             <div className="h-4 w-px bg-border/50 mx-1 hidden sm:block" />
             
             <Link href={`/${locale}/admin/notifications`} className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full border border-background" />
             </Link>

             <div className="flex items-center gap-3 pl-2">
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-[11px] font-bold leading-none">{profileResult?.full_name || 'Administrator'}</span>
                   <span className="text-[9px] font-black text-primary uppercase mt-1 tracking-wider bg-primary/10 px-1.5 rounded-sm line-clamp-1 max-w-[80px]">
                      {roleData.label}
                   </span>
                </div>
                <Avatar className="h-8 w-8 border border-white/10 ring-2 ring-primary/20">
                   <AvatarImage src={profileResult?.avatar_url} />
                   <AvatarFallback className="bg-primary/20 text-[10px] font-bold text-primary">
                      {profileResult?.full_name?.charAt(0) || 'A'}
                   </AvatarFallback>
                </Avatar>
             </div>
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
