"use client";

import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useProgress } from "@/components/dashboard/ProgressProvider";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Omnibox } from "@/components/dashboard/Omnibox";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface BreadcrumbCrumb {
  title: string;
  href: string;
  isLast: boolean;
}

export function DashboardClientLayer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { completionPercentage } = useProgress();
  const t = useTranslations("Common");
  
  const nt = useTranslations("Navigation");
  
  // Dynamic breadcrumbs based on pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment: string, index: number) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSegments.length - 1;
    // Map URL segment to translation key, fallback to capitalized segment
    const title = nt.has(segment) ? nt(segment) : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { title, href, isLast };
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background relative">
        {/* Global Progress Strip */}
        <div className="absolute top-16 left-0 right-0 h-[2px] bg-secondary/20 z-10 overflow-hidden">
          <div 
            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] transition-all duration-1000 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <header className="flex h-16 shrink-0 items-center border-b border-border/50 backdrop-blur-md bg-background/60 sticky top-0 z-20 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-6 gap-6">
          <div className="flex-1 flex items-center gap-4">
            <SidebarTrigger className="-ml-1 md:hidden text-muted-foreground hover:text-primary transition-colors h-8 w-8" />
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList>
                {breadcrumbs.map((crumb: BreadcrumbCrumb) => (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/30">{t("dashboard")}</span>
                          <BreadcrumbPage className="font-black text-primary text-sm tracking-tight">{crumb.title}</BreadcrumbPage>
                        </div>
                      ) : (
                        <BreadcrumbLink href={crumb.href} className="text-muted-foreground/60 hover:text-primary transition-colors text-xs font-medium">
                          {crumb.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!crumb.isLast && <BreadcrumbSeparator className="opacity-10" />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex-1 flex justify-center max-w-xl">
            <Omnibox />
          </div>

          <div className="flex-1 flex justify-end items-center gap-4">
             <LocaleSwitcher />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-10 px-4 md:px-6 lg:px-8 w-full">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
