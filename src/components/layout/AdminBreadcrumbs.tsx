"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const pathMap: Record<string, string> = {
  admin: "Main Hub",
  internal: "Workspace Hub",
  governance: "Governance Control",
  executive: "Executive Strategy",
  operations: "Strategic Ops",
  manager: "Management Unit",
  staff: "Execution Desk",
  associate: "Talent Desk",
  roles: "Access Control",
  attendance: "Master Ledger",
  tech: "Infrastructure",
  identity: "Corporate Identity",
  notifications: "Broadcasts",
  audit: "Security Audit",
  hiring: "Talent Acquisition",
  workforce: "Personnel Dept",
  performance: "Growth Metrics",
  finance: "Treasury"
};

export function AdminBreadcrumbs({
  homePath = "/admin",
  locale,
  userRole
}: {
  locale: string;
  homePath?: string;
  userRole?: string;
}) {
  const t = useTranslations("Navigation.breadcrumbs");

  const pathname = usePathname();

  // Industry Grade: Aggressive Filtering
  // We want to show the path starting from the specialized sub-page
  const segments = pathname.split("/").filter(Boolean);

  // Remove locale, top-level portal identifiers, and the redundant userRole segment
  const portalRoots = ['admin', 'governance', 'executive', 'operations', 'internal', 'dashboard'];
  const breadcrumbSegments = segments.filter(s =>
    s !== locale &&
    !portalRoots.includes(s) &&
    s !== userRole
  );

  const normalizedPath = pathname.replace(/\/$/, "");
  const normalizedHome = homePath.replace(/\/$/, "");

  return (
    <nav className="flex items-center gap-1.5 overflow-hidden">
      <Link
        href={homePath}
        className={cn(
          "text-muted-foreground hover:text-primary transition-colors flex items-center p-1 rounded-md hover:bg-white/5",
          normalizedPath === normalizedHome && "text-primary bg-white/5"
        )}
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
      </Link>

      {breadcrumbSegments.map((segment, index) => {
        const isLast = index === breadcrumbSegments.length - 1;

        // Try to translate segment, fallback to pathMap, then fallback to formatted segment
        const label = t.has(segment)
          ? t(segment)
          : pathMap[segment] || segment.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Build URL reliably by ensuring the locale prefix follows "as-needed" strategy
        const segmentIndex = segments.lastIndexOf(segment);
        const urlSegments = segments.slice(0, segmentIndex + 1);

        // If the first segment is the default locale (en), strip it to match homePath and "as-needed" logic
        if (urlSegments[0] === "en") {
          urlSegments.shift();
        }

        const url = "/" + urlSegments.join("/");

        // If we are left with an empty string, fallback to / (rare case but for safety)
        const finalUrl = url === "" ? "/" : url;

        return (
          <React.Fragment key={finalUrl}>
            <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            <Link
              href={finalUrl}
              className={cn(
                "text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors py-0.5 px-1 rounded-sm",
                isLast
                  ? "text-primary cursor-default pointer-events-none"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
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
