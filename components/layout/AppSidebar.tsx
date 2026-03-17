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

const navItems = [
  { group: "Business", items: [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "Formalize", icon: ShieldCheck, url: "/dashboard/formalize" },
    { title: "Operate", icon: Briefcase, url: "/dashboard/operate" },
  ]},
  { group: "Innovation", items: [
    { title: "MicroAI Hub", icon: Cpu, url: "/dashboard/grow" },
    { title: "Go-to-Market", icon: Rocket, url: "/dashboard/gtm" },
  ]},
  { group: "Account", items: [
    { title: "Profile", icon: UserCircle, url: "/dashboard/profile" },
    { title: "Settings", icon: Settings, url: "/dashboard/settings" },
  ]}
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-border/50">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 transition-all border-b border-border/50 mb-2">
        <div className="flex items-center justify-between gap-1 overflow-hidden group-data-[collapsible=icon]:justify-center">
          <Link href="/" className="flex items-center gap-2 px-2 group shrink-0 group-data-[collapsible=icon]:hidden">
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

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
        <div className="glass-card p-4 border-primary/10 group-data-[collapsible=icon]:hidden">
          <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">Growth Plan</p>
          <p className="text-sm font-bold font-display">Free Forever</p>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-2 h-10">
          <div className="w-6 h-1 bg-primary/20 rounded-full" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
