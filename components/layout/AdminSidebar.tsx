"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { type LucideIcon} from "lucide-react";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { getRoleById } from "@/lib/constants/roles";
import { AdminSidebarHeader } from "./sidebars/AdminSidebarHeader";
import { AdminSidebarGroups } from "./sidebars/AdminSidebarGroups";
import { AdminSidebarFooter } from "./sidebars/AdminSidebarFooter";
import { Home } from "lucide-react";
import { getNavForRole, getSharedGroups, getHomePath } from "@/lib/constants/navigation/roleNav";

interface NavItem {
  title: string;
  icon: LucideIcon;
  url: string;
  visible?: boolean;
  subItems?: {
    title: string;
    url: string;
    icon: LucideIcon;
    id: string;
  }[];
}

interface NavGroup {
  label: string;
  visible: boolean;
  items: NavItem[];
}

export function AdminSidebar({ userId, serverRole }: { userId: string, serverRole?: string }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const currentTab = searchParams.get('tab') || 'strategy';
  
  const { role: clientRole, isLoading } = useRole(userId);

  const activeRole = serverRole || clientRole;
  const activeRoleData = getRoleById(activeRole);
  
  // ROLE-BASED NAVIGATION INJECTION (Unique for each entity)
  const roleNavGroups = getNavForRole(activeRole, locale);
  const sharedGroups = getSharedGroups(activeRole, locale);
  const homePath = getHomePath(activeRole, locale);

  const homeGroup: NavGroup[] = [
    {
      label: "Platform",
      visible: true,
      items: [
        { title: "Dashboard", icon: Home, url: homePath },
      ]
    }
  ];

  // Only show the top-level "Dashboard" link for external users (Level 6)
  // Administrative users (Level 0-5) have their own specific home links in their role nav
  const navGroups = activeRoleData.level === 6 
    ? [...homeGroup, ...roleNavGroups, ...sharedGroups]
    : [...roleNavGroups, ...sharedGroups];

  const isExternal = activeRoleData.level === 6;

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-border/50">
      <AdminSidebarHeader 
        locale={locale} 
        roleLabel={activeRoleData.label} 
        roleLevel={activeRoleData.level} 
      />
      <AdminSidebarGroups 
        navGroups={navGroups} 
        isExternal={isExternal} 
        locale={locale} 
        currentTab={currentTab}
        pathname={pathname}
      />
      <AdminSidebarFooter 
        isLoading={isLoading} 
        serverRole={serverRole} 
        activeRoleData={activeRoleData} 
      />
    </Sidebar>
  );
}
