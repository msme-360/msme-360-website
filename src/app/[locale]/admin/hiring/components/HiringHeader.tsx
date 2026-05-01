"use client";

import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface HiringHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function HiringHeader({ searchQuery, setSearchQuery }: HiringHeaderProps) {
  const t = useTranslations("Hiring");
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground text-sm font-medium">{t('subtitle')}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live DB Feed</span>
        </div>
        <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1 font-bold uppercase tracking-widest text-[10px]">{t('badge')}</Badge>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            className="pl-9 h-9 bg-white/5 border-white/10 rounded-lg text-sm w-48 lg:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
