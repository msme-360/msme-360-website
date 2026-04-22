"use client";

import {
  Sidebar,
} from "@/components/ui/sidebar";
import {
  ShieldCheck,
  Briefcase,
  Cpu,
  Rocket,
  LayoutDashboard,
  Settings,
  UserCircle
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import {
  ShieldCheck as ShieldIcon,
  Building2
} from "lucide-react";
import { AppSidebarHeader } from "./sidebars/AppSidebarHeader";
import { AppSidebarContent } from "./sidebars/AppSidebarContent";
import { AppSidebarFooter } from "./sidebars/AppSidebarFooter";


export function AppSidebar({ userId }: { userId?: string }) {
  const t = useTranslations("Navigation");
  const params = useParams();
  const locale = params.locale as string;
  const { roleData } = useRole(userId || "");

  const navItems = [
    {
      group: t("groups.business"), items: [
        { title: t("dashboard"), icon: LayoutDashboard, url: `/${locale}/dashboard` },
        { title: t("formalize"), icon: ShieldCheck, url: `/${locale}/dashboard/formalize` },
        { title: t("operate"), icon: Briefcase, url: `/${locale}/dashboard/operate` },
      ]
    },
    {
      group: t("groups.innovation"), items: [
        { title: t("grow"), icon: Cpu, url: `/${locale}/dashboard/grow` },
        { title: t("gtm"), icon: Rocket, url: `/${locale}/dashboard/gtm` },
        { title: t("connect"), icon: Briefcase, url: `/${locale}/dashboard/connect` },
      ]
    },
    {
      group: t("groups.account"), items: [
        { title: t("profile"), icon: UserCircle, url: `/${locale}/dashboard/profile` },
        { title: t("settings"), icon: Settings, url: `/${locale}/dashboard/settings` },
      ]
    }
  ];

  const adminItems = [
    {
      title: "Admin Portal",
      icon: ShieldIcon,
      url: `/${locale}/admin/roles`,
      color: "text-primary"
    },
    {
      title: "Staff Hub",
      icon: Building2,
      url: `/${locale}/internal/staff`,
      color: "text-accent"
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-border/50">
      <AppSidebarHeader locale={locale} />
      <AppSidebarContent
        navItems={navItems}
        roleData={roleData}
        adminItems={adminItems}
      />
      <AppSidebarFooter
        logoutLabel={t("logout")}
        planLabel={t("footer.plan")}
        statusLabel={t("footer.status")}
      />
    </Sidebar>
  );
}
