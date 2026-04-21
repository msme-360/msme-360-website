"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const pathMap: Record<string, string> = {
  admin: "Root",
  governance: "Governance Control",
  executive: "Executive Strategy",
  operations: "Strategic Ops",
  roles: "Access Control",
  attendance: "Master Ledger",
  tech: "Infrastructure",
  identity: "Corporate Identity",
  notifications: "Broadcasts",
  audit: "Security Audit"
};

export function AdminBreadcrumbs({ locale }: { locale: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  
  // Remove locale segment
  const breadcrumbs = segments.slice(1);

  return (
    <nav className="flex items-center gap-1.5 overflow-hidden">
      <Link 
        href={`/${locale}/admin`}
        className="text-muted-foreground hover:text-primary transition-colors flex items-center"
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
      </Link>
      
      {breadcrumbs.map((segment, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const label = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        const url = "/" + segments.slice(0, index + 2).join("/");

        return (
          <React.Fragment key={url}>
            <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            <Link
              href={url}
              className={cn(
                "text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors",
                isLast 
                  ? "text-primary cursor-default pointer-events-none" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
