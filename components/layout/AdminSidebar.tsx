"use client";

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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { 
  ShieldCheck, 
  Briefcase, 
  Cpu, 
  BarChart3,
  Users,
  Building2,
  Lock,
  ArrowLeft,
  LifeBuoy,
  Target,
  LineChart,
  UserPlus,
  ChevronDown,
  LucideIcon
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { LogoutButton } from "./LogoutButton";
import { useRole } from "@/hooks/useRole";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getRoleById } from "@/lib/constants/roles";

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
  const locale = params.locale as string;
  const currentTab = searchParams.get('tab') || 'strategy';
  
  // Use client-side hook for real-time updates, but prioritize serverRole if provided
  const { role: clientRole, isLoading } = useRole(userId);

  const activeRole = serverRole || clientRole;
  const activeRoleData = getRoleById(activeRole);
  const level = activeRoleData.level;
  
  // Dynamic Level Flags
  const isGovernance = level <= 0; // Board
  const isExecutive = level <= 1;  // L6
  const isOperations = level <= 2; // L5 Director
  const isManagement = level <= 3; // L4 Manager
  const isStaff = level <= 4;      // L3/L2 Staff
  const isAssociate = level <= 5;  // L1 Associate
  const isExternal = level === 6; // User

  const navGroups: NavGroup[] = [
    {
      label: "Governance",
      visible: isGovernance || isExecutive,
      items: [
        { 
          title: "Executive Suite", 
          icon: BarChart3, 
          url: `/${locale}/admin/executive`,
          visible: isExecutive,
          subItems: [
            { title: "Strategy", url: `/${locale}/admin/executive?tab=strategy`, icon: Target, id: 'strategy' },
            { title: "Performance", url: `/${locale}/admin/executive?tab=performance`, icon: LineChart, id: 'performance' },
            { title: "Workforce", url: `/${locale}/admin/executive?tab=workforce`, icon: UserPlus, id: 'workforce' },
            { title: "Hiring", url: `/${locale}/admin/executive?tab=hiring`, icon: Briefcase, id: 'hiring' },
          ]
        },
        { title: "Control Center", icon: ShieldCheck, url: `/${locale}/admin/governance`, visible: isGovernance },
        { title: "Role Manager", icon: Lock, url: `/${locale}/admin/roles`, visible: isGovernance },
      ]
    },
    {
      label: "Strategic Operations",
      visible: isOperations && !isGovernance,
      items: [
        { title: "Operations Hub", icon: Target, url: `/${locale}/admin/operations` },
        { title: "Tech Infra", icon: Cpu, url: `/${locale}/admin/tech`, visible: isExecutive || activeRoleData.department === 'Technical' },
      ]
    },
    {
      label: "Management",
      visible: isManagement && !isExecutive,
      items: [
        { title: "Manager Lab", icon: Users, url: `/${locale}/internal/manager` },
        { title: "Department Hiring", icon: Briefcase, url: `/${locale}/admin/hiring` },
      ]
    },
    {
      label: "Work Hub",
      visible: isStaff || isAssociate,
      items: [
        { title: "My Workspace", icon: Building2, url: level === 5 ? `/${locale}/internal/associate` : `/${locale}/internal/staff` },
        { title: "Support Queue", icon: LifeBuoy, url: `/${locale}/admin/support`, visible: isManagement || isGovernance },
      ]
    }
  ];

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-border/50">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 border-b border-border/50 mb-2">
        <div className="flex items-center justify-between gap-1">
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 group group-data-[collapsible=icon]:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
              <ShieldCheck className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight overflow-hidden whitespace-nowrap">
              Admin <span className="text-primary">Portal</span>
            </span>
          </Link>
          <div className="shrink-0">
            <SidebarTrigger className="h-8 w-8" />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {navGroups.filter(g => g.visible).map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.filter(i => i.visible !== false).map((item) => (
                  <Collapsible key={item.title} defaultOpen={true} className="group/collapsible">
                    <SidebarMenuItem>
                      {item.subItems ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              <item.icon className="w-4 h-4" />
                              <span className="font-medium">{item.title}</span>
                              <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subItems.map((sub) => (
                                <SidebarMenuSubItem key={sub.title}>
                                  <SidebarMenuSubButton asChild isActive={currentTab === sub.id}>
                                    <Link href={sub.url} className="flex items-center gap-3">
                                      <sub.icon className="w-3.5 h-3.5 opacity-70" />
                                      <span>{sub.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : (
                        <SidebarMenuButton asChild tooltip={item.title}>
                          <Link href={item.url} className="flex items-center gap-3">
                            <item.icon className="w-4 h-4" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* System Group - Only visible to external users */}
        {isExternal && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50">System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Exit Portal">
                    <Link href={`/${locale}/dashboard`} className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                      <ArrowLeft className="w-4 h-4" />
                      <span>User View</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

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
    </Sidebar>
  );
}
