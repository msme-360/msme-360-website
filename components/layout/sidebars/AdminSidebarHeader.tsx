"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";

export function AdminSidebarHeader({ 
  locale, 
  roleLevel 
}: { 
  locale: string;
  roleLabel: string;
  roleLevel: number;
}) {
  const getPortalTitle = () => {
    if (roleLevel === 0) return { prefix: "Governance", suffix: "Control" };
    if (roleLevel === 1 || roleLevel === 1.5) return { prefix: "Executive", suffix: "Suite" };
    if (roleLevel === 2) return { prefix: "Strategic", suffix: "Ops" };
    if (roleLevel === 3 || roleLevel === 3.5) return { prefix: "Management", suffix: "Hub" };
    if (roleLevel === 4) return { prefix: "Execution", suffix: "Desk" };
    if (roleLevel === 5) return { prefix: "Associate", suffix: "Lab" };
    return { prefix: "Internal", suffix: "Portal" };
  };

  const title = getPortalTitle();

  return (
    <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 border-b border-border/50 mb-2">
      <div className="flex items-center justify-between gap-1">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 group group-data-[collapsible=icon]:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
            <ShieldCheck className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-sm tracking-tight overflow-hidden whitespace-nowrap">
            {title.prefix} <span className="text-primary">{title.suffix}</span>
          </span>
        </Link>
        <div className="shrink-0">
          <SidebarTrigger className="h-8 w-8" />
        </div>
      </div>
    </SidebarHeader>
  );
}
