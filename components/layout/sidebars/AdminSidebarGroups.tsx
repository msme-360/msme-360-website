"use client";

import Link from "next/link";
import { 
  ChevronDown, 
  LucideIcon,
  ArrowLeft
} from "lucide-react";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

export function AdminSidebarGroups({ 
  navGroups, 
  isExternal, 
  locale, 
  currentTab,
  pathname
}: { 
  navGroups: NavGroup[]; 
  isExternal: boolean; 
  locale: string; 
  currentTab: string;
  pathname: string;
}) {
  const normalizePath = (p: string) => {
    if (!p) return "/";
    // Strip /(en|hi) prefix and trailing slashes
    return p.replace(/^\/(en|hi)/, "").replace(/\/$/, "") || "/";
  };

  const normalizedPath = normalizePath(pathname);

  return (
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
                          <SidebarMenuButton 
                            tooltip={item.title}
                            isActive={normalizedPath === normalizePath(item.url) || item.subItems.some(sub => normalizedPath === normalizePath(sub.url) || currentTab === sub.id)}
                            className="data-[active=true]:border-l-[3px] data-[active=true]:border-primary data-[active=true]:rounded-l-none pl-3"
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="font-medium">{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((sub) => (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton 
                                  asChild 
                                  isActive={normalizedPath === normalizePath(sub.url) || currentTab === sub.id}
                                  className="data-[active=true]:text-primary data-[active=true]:font-semibold"
                                >
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
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title} 
                        isActive={normalizedPath === normalizePath(item.url) || (normalizePath(item.url) !== `/admin` && normalizedPath.startsWith(normalizePath(item.url) + '/'))}
                        className="data-[active=true]:border-l-[3px] data-[active=true]:border-primary data-[active=true]:rounded-l-none pl-3"
                      >
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

      {/* Portal Group - Only visible to external users accidentally hitting this layout */}
      {isExternal && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Exit Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to Dashboard">
                  <Link href={`/${locale}/dashboard`} className="flex items-center gap-3 text-muted-foreground hover:text-primary">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </SidebarContent>
  );
}
