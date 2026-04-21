"use client";

import { Sidebar } from "@/components/ui/sidebar";
import {
  ShieldCheck, Briefcase, Cpu, BarChart3, Users, Building2,
  Lock, Target, Clock, Bell, PieChart, LineChart as TrendingUp, LineChart,
  UserPlus, LifeBuoy, type LucideIcon, History, User
} from "lucide-react";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRole } from "@/hooks/useRole";
import { getRoleById } from "@/lib/constants/roles";
import { AdminSidebarHeader } from "./sidebars/AdminSidebarHeader";
import { AdminSidebarGroups } from "./sidebars/AdminSidebarGroups";
import { AdminSidebarFooter } from "./sidebars/AdminSidebarFooter";
import { UserCircle } from "lucide-react";

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
  const pathname = usePathname();
  const locale = params.locale as string;
  const currentTab = searchParams.get('tab') || 'strategy';
  
  const { role: clientRole, isLoading } = useRole(userId);

  const activeRole = serverRole || clientRole;
  const activeRoleData = getRoleById(activeRole);
  const level = activeRoleData.level;
  
  // Portal Detection logic for strict siloing
  const isGovernancePortal = pathname.includes('/admin/governance') || pathname.includes('/admin/roles') || pathname.includes('/admin/attendance') || pathname.includes('/admin/audit') || pathname.includes('/admin/identity');
  const isExecutivePortal = pathname.includes('/admin/executive');
  const isOperationsPortal = pathname.includes('/admin/operations') || pathname.includes('/admin/tech');
  const isManagementPortal = pathname.includes('/internal/manager') || pathname.includes('/internal/analytics');
  const isStaffPortal = pathname.includes('/internal/staff');
  const isAssociatePortal = pathname.includes('/internal/associate') || pathname.includes('/internal/performance');
  const isNotificationsPortal = pathname.includes('/internal/notifications');

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
      visible: isGovernance && isGovernancePortal,
      items: [
        { title: "Control Center", icon: ShieldCheck, url: `/${locale}/admin/governance` },
        { 
          title: "Role Manager", 
          icon: Lock, 
          url: `/${locale}/admin/roles`,
          subItems: [
            { title: "Personnel Directory", url: `/${locale}/admin/roles`, icon: Users, id: 'directory' },
            { title: "Access Audit", url: `/${locale}/admin/roles/audit`, icon: Clock, id: 'audit' },
          ]
        },
        { title: "Master Ledger", icon: Clock, url: `/${locale}/admin/attendance` },
        { title: "System History", icon: History, url: `/${locale}/admin/audit` },
      ]
    },
    {
      label: t("groups.strategy"),
      visible: isExecutive && isExecutivePortal,
      items: [
        { 
          title: "Executive Suite", 
          icon: BarChart3, 
          url: `/${locale}/admin/executive`,
          subItems: [
            { title: "Strategy", url: `/${locale}/admin/executive`, icon: Target, id: 'strategy' },
            { title: "Performance", url: `/${locale}/admin/executive/performance`, icon: LineChart, id: 'performance' },
            { title: "Workforce", url: `/${locale}/admin/executive/workforce`, icon: UserPlus, id: 'workforce' },
            { title: "Hiring", url: `/${locale}/admin/executive/hiring`, icon: Briefcase, id: 'hiring' },
          ]
        },
      ]
    },
    {
      label: t("groups.operations"),
      visible: (isGovernance || isOperations) && isOperationsPortal,
      items: [
        { title: "Operations Hub", icon: Target, url: `/${locale}/admin/operations` },
        { title: "Tech Infra", icon: Cpu, url: `/${locale}/admin/tech` },
      ]
    },
    {
      label: t("groups.management"),
      visible: (isGovernance || isManagement) && (isManagementPortal || isNotificationsPortal),
      items: [
        { title: "Manager Lab", icon: Users, url: `/${locale}/internal/manager` },
        { title: "Task Analytics", icon: PieChart, url: `/${locale}/internal/analytics` },
        { title: "Attendance Logs", icon: Clock, url: `/${locale}/admin/attendance` },
      ]
    },
    {
      label: t("groups.workHub"),
      visible: (isGovernance || isStaff) && isStaffPortal,
      items: [
        { title: "My Workspace", icon: Building2, url: `/${locale}/internal/staff` },
        { title: "Support Queue", icon: LifeBuoy, url: `/${locale}/admin/support` },
      ]
    },
    {
      label: t("groups.onboarding"),
      visible: (isGovernance || isAssociate) && (isAssociatePortal || isNotificationsPortal),
      items: [
        { title: "Onboarding Roadmap", icon: Target, url: `/${locale}/internal/associate` },
        { title: "Performance Stats", icon: TrendingUp, url: `/${locale}/internal/performance` },
        { title: "Team Intros", icon: Users, url: `/${locale}/internal/team` },
      ]
    },
    {
      label: "Profile & Identity",
      visible: true,
      items: [
        { title: "Personnel Card", icon: User, url: `/${locale}/admin/identity` },
        { title: "Business Identity", icon: UserCircle, url: `/${locale}/dashboard/profile` },
        { title: "Notifications", icon: Bell, url: `/${locale}/internal/notifications` },
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
