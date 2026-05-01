"use client";

import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { supabase } from "@/services/supabase/supabase";
import { logger } from "@/lib/logger";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Application } from "./components/HiringPortalTypes";
import { CandidateRow } from "./components/CandidateRow";
import { StatusFilterCard } from "./components/StatusFilterCard";

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

  const handleAction = async (id: string, email: string, action: 'shortlisted' | 'rejected' | 'hired' | 'onboarded', details: Application) => {
    try {
      const { error: updateError } = await supabase
        .from('intern_applications')
        .update({ status: action, reviewed_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      if (action === 'hired') {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            email: email,
            full_name: details.full_name,
            role: 'user',
            department: 'Unassigned',
            designation: details.role,
            phone: details.phone || '',
          }]);

        if (profileError && !profileError.message.includes("duplicate key")) {
          throw profileError;
        }

        toast.success(t("toasts.hiredSuccess", { name: details.full_name }));
      } else if (action === 'onboarded') {
        toast.success(t("toasts.onboardedSuccess", { name: details.full_name }));
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
    hired: applications.filter(a => a.status === 'hired').length,
    onboarded: applications.filter(a => a.status === 'onboarded').length
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusFilterCard count={counts.all} label={t("totalApplied")} active={filter === 'all'} onClick={() => setFilter('all')} color="primary" />
        <StatusFilterCard count={counts.pending} label={t("pendingReview")} active={filter === 'pending'} onClick={() => setFilter('pending')} color="amber" />
        <StatusFilterCard count={counts.hired} label={t("hired")} active={filter === 'hired'} onClick={() => setFilter('hired')} color="emerald" />
        <StatusFilterCard count={counts.onboarded} label={t("onboarded")} active={filter === 'onboarded'} onClick={() => setFilter('onboarded')} color="indigo" />
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
