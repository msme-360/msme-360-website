"use client";

import React from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";

export function AppSidebarHeader({ locale }: { locale: string }) {
  return (
    <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 transition-all border-b border-border/50 mb-2">
      <div className="flex items-center justify-between gap-1 overflow-hidden group-data-[collapsible=icon]:justify-center">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 px-2 group shrink-0 group-data-[collapsible=icon]:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform shrink-0">
            <Rocket className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-base tracking-tight transition-all duration-300 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 overflow-hidden whitespace-nowrap">
            MSME <span className="text-primary border-primary">360</span>
          </span>
        </Link>
        <div className="shrink-0 flex items-center justify-center">
          <SidebarTrigger className="h-8 w-8 hover:bg-secondary/80 rounded-lg transition-colors group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:bg-primary/5 group-data-[collapsible=icon]:text-primary" />
        </div>
      </div>
    </SidebarHeader>
  );
}
