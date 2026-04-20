"use client";

import {
  Sidebar,
} from "@/components/ui/sidebar";
import { 
  ShieldCheck, 
  Briefcase, 
  Cpu, 
  BarChart3,
  Users,
  Building2,
  Lock,
  Target,
  LineChart,
  UserPlus,
  History,
  LucideIcon,
  LifeBuoy
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRole } from "@/hooks/useRole";
import { getRoleById } from "@/lib/constants/roles";
import { AdminSidebarHeader } from "./sidebars/AdminSidebarHeader";
import { AdminSidebarGroups } from "./sidebars/AdminSidebarGroups";
import { AdminSidebarFooter } from "./sidebars/AdminSidebarFooter";

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
  const t = useTranslations("Navigation");
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const currentTab = searchParams.get('tab') || 'strategy';
  
  const { role: clientRole, isLoading } = useRole(userId);

  const activeRole = serverRole || clientRole;
  const activeRoleData = getRoleById(activeRole);
  const level = activeRoleData.level;
  
  const isGovernance = level <= 0;
  const isExecutive = level <= 1;
  const isOperations = level === 2;
  const isManagement = level === 3;
  const isStaff = level === 4;
  const isAssociate = level === 5;
  const isExternal = level === 6;

  const navGroups: NavGroup[] = [
    {
      label: t("groups.system"),
      visible: isGovernance,
      items: [
        { title: "Control Center", icon: ShieldCheck, url: `/${locale}/admin/governance` },
        { title: "Role Manager", icon: Lock, url: `/${locale}/admin/roles` },
        { title: "Audit Logs", icon: History, url: `/${locale}/admin/audit` },
      ]
    },
    {
      label: t("groups.strategy"),
      visible: isExecutive,
      items: [
        { 
          title: "Executive Suite", 
          icon: BarChart3, 
          url: `/${locale}/admin/executive`,
          subItems: [
            { title: "Strategy", url: `/${locale}/admin/executive?tab=strategy`, icon: Target, id: 'strategy' },
            { title: "Performance", url: `/${locale}/admin/executive?tab=performance`, icon: LineChart, id: 'performance' },
            { title: "Workforce", url: `/${locale}/admin/executive?tab=workforce`, icon: UserPlus, id: 'workforce' },
            { title: "Hiring", url: `/${locale}/admin/executive?tab=hiring`, icon: Briefcase, id: 'hiring' },
          ]
        },
      ]
    },
    {
      label: t("groups.operations"),
      visible: isOperations,
      items: [
        { title: "Operations Hub", icon: Target, url: `/${locale}/admin/operations` },
        { title: "Tech Infra", icon: Cpu, url: `/${locale}/admin/tech` },
      ]
    },
    {
      label: t("groups.management"),
      visible: isManagement,
      items: [
        { title: "Manager Lab", icon: Users, url: `/${locale}/internal/manager` },
      ]
    },
    {
      label: t("groups.workHub"),
      visible: isStaff,
      items: [
        { title: "My Workspace", icon: Building2, url: `/${locale}/internal/staff` },
        { title: "Support Queue", icon: LifeBuoy, url: `/${locale}/admin/support` },
      ]
    },
    {
      label: t("groups.onboarding"),
      visible: isAssociate,
      items: [
        { title: "Onboarding Roadmap", icon: Target, url: `/${locale}/internal/associate` },
        { title: "Team Intros", icon: Users, url: `/${locale}/internal/team` },
      ]
    }
  ];

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-border/50">
      <AdminSidebarHeader locale={locale} />
      <AdminSidebarGroups 
        navGroups={navGroups} 
        isExternal={isExternal} 
        locale={locale} 
        currentTab={currentTab} 
      />
      <AdminSidebarFooter 
        isLoading={isLoading} 
        serverRole={serverRole} 
        activeRoleData={activeRoleData} 
      />
    </Sidebar>
  );
}
