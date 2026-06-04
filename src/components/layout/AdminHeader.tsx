"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { CommandCenter } from "@/components/governance/CommandCenter";
import { SidebarTrigger } from "@/components/ui/sidebar";
import LocaleSwitcher from "./LocaleSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardProfile } from "@/types/dashboard";
import { AppRole } from "@/lib/constants/roles";

interface AdminHeaderProps {
  profile: DashboardProfile | null;
  roleData: AppRole;
  unreadCount: number;
  homePath: string;
  locale: string;
  portalContext: "admin" | "internal";
}

export function AdminHeader({
  profile,
  roleData,
  unreadCount,
  homePath,
  locale,
  portalContext
}: AdminHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border/50 backdrop-blur-xl bg-background/40 sticky top-0 z-20 px-6 justify-between gap-4">
      <div className="flex items-center gap-6 min-w-0">
        <div className="lg:hidden">
          <SidebarTrigger className="-ml-2 h-8 w-8 text-foreground/70 hover:text-foreground" />
        </div>
        <div className="hidden lg:flex items-center gap-2 border-r border-border/50 pr-6 shrink-0">
          <div className="w-2 h-6 bg-primary rounded-full shadow-glow-sm" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/80">MSME 360</span>
        </div>
        <AdminBreadcrumbs locale={locale} homePath={homePath} userRole={profile?.role} />
      </div>

      <div className="flex-1 flex justify-center max-w-md">
        <CommandCenter roleLevel={roleData.level} roleId={roleData.id} />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <LocaleSwitcher />

        <div className="h-4 w-px bg-border/50 mx-1 hidden sm:block" />

        <Link
          href={`/${locale}/${portalContext}/notifications`}
          className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full border border-background shadow-glow-sm" />
          )}
        </Link>

        <div className="flex items-center gap-3 pl-2">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] font-bold leading-none">{profile?.full_name || 'Administrator'}</span>
            <span className="text-[9px] font-black text-primary uppercase mt-1 tracking-wider bg-primary/10 px-1.5 rounded-sm line-clamp-1 max-w-[100px]">
              {roleData.label}
            </span>
          </div>
          <Avatar className="h-8 w-8 border border-white/10 ring-2 ring-primary/20">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-primary/20 text-[10px] font-bold text-primary">
              {profile?.full_name?.charAt(0) || roleData.label.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
