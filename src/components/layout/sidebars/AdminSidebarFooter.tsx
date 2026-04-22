"use client";

import React from "react";
import { SidebarFooter } from "@/components/ui/sidebar";
import { LogoutButton } from "../LogoutButton";

interface RoleData {
  label: string;
}

export function AdminSidebarFooter({
  isLoading,
  serverRole,
  activeRoleData
}: {
  isLoading: boolean;
  serverRole?: string;
  activeRoleData: RoleData;
}) {
  return (
    <SidebarFooter className="p-4 border-t border-border/50">
      <div className="mb-4">
        <LogoutButton label="Sign Out" />
      </div>
      <div className="glass-card p-4 border-primary/10 group-data-[collapsible=icon]:hidden">
        <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">Active Tier</p>
        <p className="text-sm font-bold font-display truncate">
          {isLoading && !serverRole ? "Fetching..." : activeRoleData.label}
        </p>
      </div>
    </SidebarFooter>
  );
}
