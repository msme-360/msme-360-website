"use client";

import { Clock, Filter, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface AttendanceHeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onExport: () => void;
}

export default function AttendanceHeader({
  searchTerm,
  onSearchChange,
  onExport,
}: AttendanceHeaderProps) {
  const t = useTranslations("Attendance");
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-white">{t("title") || "Participation Ledger"}</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />
              {t("description") || "Industrial oversight of organization-wide participation logs."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <Input
            placeholder={t("searchPlaceholder") || "Search personnel tier..."}
            className="pl-11 bg-white/5 border-white/5 rounded-2xl h-12 focus:ring-indigo-500 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button
          onClick={onExport}
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 gap-2 border-t border-white/20"
        >
          <FileText className="w-3.5 h-3.5" />
          {t("exportCta") || "Export Audit"}
        </Button>
      </div>
    </div>
  );
}
