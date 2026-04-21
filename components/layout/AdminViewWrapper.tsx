"use client";

import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface AdminViewWrapperProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  badgeLabel?: string;
  authorityLevel?: string;
  actions?: ReactNode;
  className?: string;
}

export function AdminViewWrapper({ 
  children, 
  title, 
  subtitle, 
  badgeLabel, 
  authorityLevel, 
  actions,
  className = "" 
}: AdminViewWrapperProps) {
  return (
    <div className={`space-y-8 pb-20 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm font-medium">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {badgeLabel && (
            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1 font-bold italic">
              {badgeLabel}
            </Badge>
          )}
          {authorityLevel && (
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/10">
              Authority: {authorityLevel}
            </div>
          )}
          {actions}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </div>
    </div>
  );
}
