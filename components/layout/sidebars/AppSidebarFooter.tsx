"use client";

import React from "react";
import { SidebarFooter } from "@/components/ui/sidebar";
import { LogoutButton } from "../LogoutButton";

export function AppSidebarFooter({ 
  logoutLabel, 
  planLabel, 
  statusLabel 
}: { 
  logoutLabel: string; 
  planLabel: string; 
  statusLabel: string;
}) {
  return (
    <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 border-t border-border/50">
      <div className="mb-4">
        <LogoutButton label={logoutLabel} />
      </div>
      <div className="glass-card p-4 border-primary/10 group-data-[collapsible=icon]:hidden">
        <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">{planLabel}</p>
        <p className="text-sm font-bold font-display">{statusLabel}</p>
      </div>
      <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-2 h-10">
        <div className="w-6 h-1 bg-primary/20 rounded-full" />
      </div>
    </SidebarFooter>
  );
}
