"use client";

import { motion } from "framer-motion";
import { Sparkles, Search, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NicCode } from "./MicroAITypes";
import { useTranslations } from "next-intl";

interface NICFinderProps {
  nicResults: NicCode[];
  setNicQuery: (q: string) => void;
}

export default function NICFinder({ nicResults, setNicQuery }: NICFinderProps) {
  const t = useTranslations("MicroAIHub");
  return (
    <motion.div
      key="nic"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 group relative overflow-hidden min-h-[500px] flex flex-col"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles className="w-40 h-40" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("tools.nic.title")}</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium italic">{t("tools.nic.finderSub")}</p>
          </div>
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
            {t("tools.nic.badge")}
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={t("tools.nic.placeholder")}
              className="w-full bg-secondary/20 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40 font-medium"
              onChange={(e) => setNicQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {nicResults.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-border/20 rounded-3xl flex flex-col items-center justify-center text-center opacity-40">
                <Bot className="w-10 h-10 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest leading-loose text-center">
                  {t("tools.nic.waiting")}
                </p>
              </div>
            ) : (
              nicResults.map((code) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={code.code}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all group/nic cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-primary font-black text-lg tracking-tight">{code.code}</span>
                    <Badge variant="outline" className="text-[9px] border-primary/20 text-primary uppercase">{code.category}</Badge>
                  </div>
                  <p className="text-sm font-bold tracking-tight mb-0.5">{code.description}</p>
                  <p className="text-[11px] text-muted-foreground/60 italic leading-snug">{code.subtext}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border/20">
          <Button variant="outline" className="rounded-xl px-6 text-xs font-bold border-primary/20 hover:bg-primary/10">
            {t("tools.nic.cta")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
