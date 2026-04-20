"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";

export function AdminSidebarHeader({ locale }: { locale: string }) {
  return (
    <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 border-b border-border/50 mb-2">
      <div className="flex items-center justify-between gap-1">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 group group-data-[collapsible=icon]:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
            <ShieldCheck className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-sm tracking-tight overflow-hidden whitespace-nowrap">
            Admin <span className="text-primary">Portal</span>
          </span>
        </Link>
        <div className="shrink-0">
          <SidebarTrigger className="h-8 w-8" />
        </div>
      </div>
    </SidebarHeader>
  );
}
