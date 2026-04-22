"use client";

import { motion, Variants } from "framer-motion";
import { Building2, IndianRupee, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tender } from "../hooks/useGTM";
import { useTranslations } from "next-intl";

interface TenderAlertsCardProps {
  isLoading: boolean;
  tenderSector: string;
  setTenderSector: (sector: string) => void;
  filteredTenders: Tender[];
  itemVariants: Variants;
}

export default function TenderAlertsCard({
  isLoading,
  tenderSector,
  setTenderSector,
  filteredTenders,
  itemVariants
}: TenderAlertsCardProps) {
  const t = useTranslations("GTM");
  return (
    <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-8 group relative overflow-hidden bg-primary/2 border-primary/10">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <IndianRupee className="w-40 h-40" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">{t("tenders.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("tenders.subtitle")}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={tenderSector} onValueChange={setTenderSector}>
              <SelectTrigger className="w-[140px] bg-background/50 rounded-xl border-border/50 data-[size=default]:h-9 text-xs" size="default">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="all">All Sectors</SelectItem>
                {t.raw("tenders.sectors").map((s: string) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/50 px-4 bg-background/50">
              <MapPin className="w-3 h-3 mr-2" /> Pan-India
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4 w-full">
                  <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-12 rounded-full" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
                <Skeleton className="mt-4 md:mt-0 h-8 w-24 rounded-xl shrink-0" />
              </div>
            ))
          ) : filteredTenders.length > 0 ? (
            filteredTenders.map(tender => (
              <div key={tender.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group/tender hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/5 rounded-xl text-primary font-black text-[10px] w-12 h-12 flex items-center justify-center text-center">
                    {tender.agency}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm tracking-tight">{tender.title}</h4>
                      <Badge variant="outline" className="text-[8px] bg-primary/10 text-primary border-none">{tender.sector}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {tender.location}</span>
                      <span className="flex items-center gap-1 font-black text-foreground">
                        <IndianRupee className="w-2.5 h-2.5" /> {tender.value_text || tender.value}
                      </span>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="mt-4 md:mt-0 rounded-xl bg-primary text-primary-foreground font-bold px-4 h-8 text-[10px]">
                  {t("tenders.bidCta")}
                </Button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center opacity-40 text-sm font-medium italic">
              {t("tenders.noResults")}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
