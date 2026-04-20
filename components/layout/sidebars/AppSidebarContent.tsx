"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { AppRole } from "@/lib/constants/roles";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

interface NavGroup {
  group: string;
  items: {
    title: string;
    icon: LucideIcon;
    url: string;
  }[];
}

interface AdminItem {
  title: string;
  icon: LucideIcon;
  url: string;
  color: string;
}

export function AppSidebarContent({ 
  navItems, 
  roleData, 
  adminItems 
}: { 
  navItems: NavGroup[]; 
  roleData: AppRole | null | undefined; 
  adminItems: AdminItem[];
}) {
  return (
    <SidebarContent>
      {navItems.map((group) => (
        <SidebarGroup key={group.group}>
          <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}

      {/* Conditional Governance Section - Hidden for External Users (L6) */}
      {roleData && roleData.level < 6 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold text-primary uppercase tracking-widest">Governance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => {
                const isVisible = item.title === "Admin Portal" 
                  ? roleData.level <= 1 
                  : roleData.level <= 5;

                if (!isVisible) return null;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link href={item.url} className={`flex items-center gap-3 ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                        <span className="font-bold">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </SidebarContent>
  );
}
