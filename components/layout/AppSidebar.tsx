import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
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
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { LogoutButton } from "./LogoutButton";


export function AppSidebar() {
  const t = useTranslations("Navigation");
  const params = useParams();
  const locale = params.locale as string;

  const navItems = [
    { group: t("groups.business"), items: [
      { title: t("dashboard"), icon: LayoutDashboard, url: `/${locale}/dashboard` },
      { title: t("formalize"), icon: ShieldCheck, url: `/${locale}/dashboard/formalize` },
      { title: t("operate"), icon: Briefcase, url: `/${locale}/dashboard/operate` },
    ]},
    { group: t("groups.innovation"), items: [
      { title: t("grow"), icon: Cpu, url: `/${locale}/dashboard/grow` },
      { title: t("gtm"), icon: Rocket, url: `/${locale}/dashboard/gtm` },
      { title: t("connect"), icon: Briefcase, url: `/${locale}/dashboard/connect` },
    ]},
    { group: t("groups.account"), items: [
      { title: t("profile"), icon: UserCircle, url: `/${locale}/dashboard/profile` },
      { title: t("settings"), icon: Settings, url: `/${locale}/dashboard/settings` },
    ]}
  ];

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-border/50">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 transition-all border-b border-border/50 mb-2">
        <div className="flex items-center justify-between gap-1 overflow-hidden group-data-[collapsible=icon]:justify-center">
          <Link href={`/${locale}`} className="flex items-center gap-2 px-2 group shrink-0 group-data-[collapsible=icon]:hidden">
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
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 border-t border-border/50">
        <div className="mb-4">
          <LogoutButton label={t("logout")} />
        </div>
        <div className="glass-card p-4 border-primary/10 group-data-[collapsible=icon]:hidden">
          <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">{t("footer.plan")}</p>
          <p className="text-sm font-bold font-display">{t("footer.status")}</p>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-2 h-10">
          <div className="w-6 h-1 bg-primary/20 rounded-full" />
        </div>
      </SidebarFooter>

    </Sidebar>
  );
}
