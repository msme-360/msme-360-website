"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { Bell, type LucideIcon} from "lucide-react";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { getRoleById } from "@/lib/constants/roles";
import { AdminSidebarHeader } from "./sidebars/AdminSidebarHeader";
import { AdminSidebarGroups } from "./sidebars/AdminSidebarGroups";
import { AdminSidebarFooter } from "./sidebars/AdminSidebarFooter";
import { UserCircle } from "lucide-react";
import { getNavForRole } from "@/lib/constants/navigation/roleNav";

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

  const sharedGroups: NavGroup[] = [
    {
      label: "Profile & Identity",
      visible: true,
      items: [
        { title: "Business Identity", icon: UserCircle, url: `/${locale}/admin/identity/${activeRole}` },
        { title: "Notifications", icon: Bell, url: `/${locale}/admin/notifications/${activeRole}` },
      ]
    }
  ];

  const navGroups = [...roleNavGroups, ...sharedGroups];
  const isExternal = activeRoleData.level === 6;

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-border/50">
      <AdminSidebarHeader locale={locale} />
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
