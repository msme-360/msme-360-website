"use client";

import { 
  Search, 
  Filter, 
  MapPin, 
  GraduationCap, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Briefcase
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Application {
  id: string;
  full_name: string;
  email: string;
  role: string;
  university: string;
  experience_level: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'hired';
  applied_at: string;
  designation?: string;
  bio?: string;
  phone?: string;
}

export function HiringPortal() {
  const t = useTranslations("Admin.HiringPortal");
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: applications = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['intern_applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intern_applications')
        .select('*')
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data as Application[];
    }
  });

  const handleAction = async (id: string, email: string, action: 'shortlisted' | 'rejected' | 'hired', details: Application) => {
    try {
      // 1. Update Application Status
      const { error: updateError } = await supabase
        .from('intern_applications')
        .update({ status: action, reviewed_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      // 2. If 'hired', create the profile shell for activation
      if (action === 'hired') {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            email: email,
            full_name: details.full_name,
            role: 'user',
            department: 'Unassigned', // To be assigned by Admin later
            designation: details.role, // Use the role they applied for
            phone: details.phone || '',
          }]);

        if (profileError && !profileError.message.includes("duplicate key")) {
          throw profileError;
        }

        toast.success(t("toasts.hiredSuccess", { name: details.full_name }));
      } else {
        toast.success(t("toasts.actionSuccess", { action: t(`candidateRow.${action}`) }));
      }

      queryClient.invalidateQueries({ queryKey: ['intern_applications'] });
    } catch (error) {
      logger.error(`Failed to perform ${action}`, "HiringPortal", error);
      toast.error(t("toasts.actionFailed"));
    }
  };

  const filteredApps = useMemo(() => 
    applications.filter(app => filter === 'all' || app.status === filter),
    [applications, filter]
  );

  const counts = useMemo(() => ({
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    hired: applications.filter(a => a.status === 'hired').length
  }), [applications]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>{t("refresh")}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusFilterCard count={counts.all} label={t("totalApplied")} active={filter === 'all'} onClick={() => setFilter('all')} color="primary" />
        <StatusFilterCard count={counts.pending} label={t("pendingReview")} active={filter === 'pending'} onClick={() => setFilter('pending')} color="amber" />
        <StatusFilterCard count={counts.hired} label={t("hired")} active={filter === 'hired'} onClick={() => setFilter('hired')} color="green" />
      </div>

      <div className="bg-background border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/30 bg-secondary/5 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder={t("searchPlaceholder")} className="pl-10 h-10 rounded-xl" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl"><Filter className="w-4 h-4 mr-2" /> {t("filters")}</Button>
            </div>
        </div>

        <div className="divide-y divide-border/20">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">{t("loading")}</div>
          ) : filteredApps.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">{t("noCandidates")}</div>
          ) : filteredApps.map((app) => (
            <CandidateRow 
              key={app.id} 
              app={app} 
              onAction={(action) => handleAction(app.id, app.email, action, app)} 
              t={t}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CandidateRow({ app, onAction, t }: { app: Application; onAction: (a: 'shortlisted' | 'rejected' | 'hired') => void; t: ReturnType<typeof useTranslations> }) {
  const statusColors: Record<Application['status'], "secondary" | "outline" | "destructive" | "default"> = {
    pending: "secondary",
    shortlisted: "outline",
    rejected: "destructive",
    hired: "default"
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
            <Badge variant={statusColors[app.status]} className="capitalize text-[10px] h-5">
              {t(`candidateRow.${app.status}` as "candidateRow.pending" | "candidateRow.shortlisted" | "candidateRow.rejected" | "candidateRow.hired")}
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
      </div>
    </div>
  );
}

interface StatusFilterCardProps {
  count: number;
  label: string;
  active: boolean;
  onClick: () => void;
  color: 'primary' | 'amber' | 'green';
}

function StatusFilterCard({ count, label, active, onClick, color }: StatusFilterCardProps) {
  const colors: Record<StatusFilterCardProps['color'], string> = {
    primary: active ? "border-primary bg-primary/5" : "border-border/50",
    amber: active ? "border-amber-500 bg-amber-500/5" : "border-border/50",
    green: active ? "border-green-500 bg-green-500/5" : "border-border/50",
  };

  const textColors: Record<StatusFilterCardProps['color'], string> = {
    primary: active ? "text-primary" : "text-muted-foreground",
    amber: active ? "text-amber-500" : "text-muted-foreground",
    green: active ? "text-green-500" : "text-muted-foreground",
  };

  return (
    <Card className={`cursor-pointer transition-all hover:border-primary/30 ${colors[color]}`} onClick={onClick}>
      <CardContent className="p-4 py-3 flex items-center justify-between">
        <span className={`text-sm font-semibold ${textColors[color]}`}>{label}</span>
        <span className="text-xl font-bold">{count}</span>
      </CardContent>
    </Card>
  );
}
