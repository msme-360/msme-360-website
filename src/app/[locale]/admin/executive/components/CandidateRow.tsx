"use client";

import {
  MapPin,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  Clock,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Application } from "./HiringPortalTypes";

interface CandidateRowProps {
  app: Application;
  onAction: (a: 'shortlisted' | 'rejected' | 'hired' | 'onboarded') => void;
}

export function CandidateRow({ app, onAction }: CandidateRowProps) {
  const t = useTranslations("Admin.HiringPortal");
  const statusColors: Record<Application['status'], "secondary" | "outline" | "destructive" | "default" | "success"> = {
    pending: "secondary",
    shortlisted: "outline",
    rejected: "destructive",
    hired: "default",
    onboarded: "success"
  };

  return (
    <div className="p-6 hover:bg-secondary/5 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
          {app.full_name.charAt(0)}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-lg">{app.full_name}</h4>
            <Badge variant={statusColors[app.status] as any} className="capitalize text-[10px] h-5">
              {t(`candidateRow.${app.status}` as any)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" /> {app.role}
            <span className="mx-1">•</span>
            <GraduationCap className="w-3.5 h-3.5" /> {app.university}
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" /> {new Date(app.applied_at).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5" /> {t("candidateRow.remote")}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <Button variant="ghost" size="sm" className="rounded-xl h-9" asChild>
          <a href={`mailto:${app.email}`}><ExternalLink className="w-4 h-4 mr-2" /> {t("candidateRow.resume")}</a>
        </Button>
        {app.status === 'pending' && (
          <>
            <Button variant="outline" size="sm" className="rounded-xl h-9 text-amber-600 border-amber-200 hover:bg-amber-50" onClick={() => onAction('shortlisted')}>
              {t("candidateRow.shortlist")}
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl h-9 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => onAction('rejected')}>
              {t("candidateRow.reject")}
            </Button>
            <Button size="sm" className="rounded-xl h-9 bg-primary" onClick={() => onAction('hired')}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> {t("candidateRow.hire")}
            </Button>
          </>
        )}
        {app.status === 'shortlisted' && (
          <Button size="sm" className="rounded-xl h-9 bg-primary" onClick={() => onAction('hired')}>
            <CheckCircle2 className="w-4 h-4 mr-2" /> {t("candidateRow.finalHire")}
          </Button>
        )}
        {app.status === 'hired' && (
          <Button size="sm" className="rounded-xl h-9 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => onAction('onboarded')}>
            <CheckCircle2 className="w-4 h-4 mr-2" /> {t("candidateRow.onboard")}
          </Button>
        )}
      </div>
    </div>
  );
}
