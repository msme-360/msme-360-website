"use client";

import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProgressProvider, useProgress } from "@/components/dashboard/ProgressProvider";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Search, 
  Command as CommandIcon, 
  LayoutDashboard, 
  ShieldCheck, 
  Briefcase, 
  Cpu, 
  Rocket, 
  UserCircle, 
  Settings as SettingsIcon 
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider>
      <SidebarProvider>
        <AppSidebar />
        <DashboardInner>{children}</DashboardInner>
      </SidebarProvider>
    </ProgressProvider>
  );
}

function DashboardInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { completionPercentage } = useProgress();
  const [open, setOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchItems = [
    { title: "Business Hub", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { title: "Formalization Wizard", href: "/dashboard/formalize", icon: <ShieldCheck className="h-4 w-4" /> },
    { title: "Operations Toolkit", href: "/dashboard/operate", icon: <Briefcase className="h-4 w-4" /> },
    { title: "MicroAI Hub", href: "/dashboard/grow", icon: <Cpu className="h-4 w-4" /> },
    { title: "Go-to-Market", href: "/dashboard/gtm", icon: <Rocket className="h-4 w-4" /> },
    { title: "Business Profile", href: "/dashboard/profile", icon: <UserCircle className="h-4 w-4" /> },
    { title: "Account Settings", href: "/dashboard/settings", icon: <SettingsIcon className="h-4 w-4" /> },
  ];
  
  // Dynamic breadcrumbs based on pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSegments.length - 1;
    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { title, href, isLast };
  });

  return (
    <SidebarInset className="bg-background relative">
      {/* Global Progress Strip */}
      <div className="absolute top-16 left-0 right-0 h-[2px] bg-secondary/20 z-10 overflow-hidden">
        <div 
          className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] transition-all duration-1000 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <header className="flex h-16 shrink-0 items-center justify-between gap-4 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/50 backdrop-blur-md bg-background/60 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 md:hidden text-muted-foreground hover:text-primary transition-colors" />
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage className="font-bold text-primary">{crumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href} className="text-muted-foreground/60 hover:text-primary transition-colors text-xs">
                        {crumb.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!crumb.isLast && <BreadcrumbSeparator className="opacity-20" />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex-1 flex justify-end md:justify-center max-w-2xl relative">
          <Command className="bg-transparent overflow-visible">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div 
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-text group w-full max-w-[400px] md:max-w-full shadow-sm bg-secondary/5",
                    open ? "border-primary/40 ring-2 ring-primary/10 bg-secondary/10" : "border-border/50 hover:border-primary/40"
                  )}
                >
                  <CommandInput 
                    ref={searchInputRef}
                    placeholder="Search tools..." 
                    className="h-7 p-0 border-0 bg-transparent focus:ring-0 w-full text-sm placeholder:text-muted-foreground/40"
                    onFocus={() => setOpen(true)}
                  />
                  <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-background/80 border border-border/50 shadow-sm shrink-0 scale-90">
                    <CommandIcon className="w-3 h-3 opacity-40" />
                    <span className="text-[10px] font-black opacity-40">K</span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent 
                className="p-0 w-(--radix-popover-trigger-width) overflow-hidden rounded-xl border-border/50 shadow-2xl" 
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <CommandList className="max-h-[350px]">
                  <CommandEmpty className="py-6 text-sm text-center text-muted-foreground">No results found.</CommandEmpty>
                  <CommandGroup heading="Navigation" className="p-2">
                    {searchItems.map((item) => (
                      <CommandItem 
                        key={item.href}
                        onSelect={() => {
                          router.push(item.href);
                          setOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-secondary/20 transition-colors"
                      >
                        <div className="p-1.5 rounded-md bg-secondary/30 text-primary">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </PopoverContent>
            </Popover>
          </Command>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-10 px-4 md:px-6 lg:px-8 w-full">
          {children}
        </div>
      </div>
    </SidebarInset>
  );
}

/* SEO Hints: <title>Dashboard</title> <meta name="description" content="Dashboard" /> <meta property="og:title" content="Dashboard" /> */
