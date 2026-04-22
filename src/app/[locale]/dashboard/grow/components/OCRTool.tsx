"use client";

import { motion } from "framer-motion";
import { Zap, Activity, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OCRData } from "./MicroAITypes";
import { useTranslations } from "next-intl";

interface OCRToolProps {
  ocrState: "idle" | "scanning" | "completed";
  ocrData: OCRData | null;
  onStartScan: () => void;
  onReset: () => void;
}

export default function OCRTool({ ocrState, ocrData, onStartScan, onReset }: OCRToolProps) {
  const t = useTranslations("MicroAIHub");
  return (
    <motion.div
      key="ocr"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 group relative overflow-hidden min-h-[500px] flex flex-col"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Zap className="w-40 h-40" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("tools.ocr.title")}</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium italic">{t("tools.ocr.visionSub")}</p>
          </div>
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary border-primary/20">
            {t("tools.ocr.visionBadge")}
          </Badge>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-3xl bg-primary/5 p-12 transition-all hover:border-primary/40 hover:bg-primary/10 group/drop">
          {ocrState === "idle" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-[2.5rem] bg-background flex items-center justify-center mx-auto shadow-2xl border border-border group-hover/drop:scale-110 transition-transform">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight">{t("tools.ocr.dropzone")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("tools.ocr.dropzoneSub")}</p>
              </div>
              <Button
                onClick={onStartScan}
                className="rounded-full px-8 shadow-glow"
              >
                {t("tools.ocr.selectFile")}
              </Button>
            </div>
          )}

          {ocrState === "scanning" && (
            <div className="text-center space-y-8 w-full max-w-sm">
              <div className="relative">
                <div className="h-64 bg-secondary/30 rounded-2xl overflow-hidden relative">
                  <motion.div
                    initial={{ top: "-100%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] z-10"
                  />
                  <div className="absolute inset-0 opacity-20 flex flex-col gap-2 p-4">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-white/20 rounded-full" />)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold animate-pulse text-primary tracking-tight">{t("tools.ocr.scanning")}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{t("tools.ocr.scanningSub")}</p>
              </div>
            </div>
          )}

          {ocrState === "completed" && ocrData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-xl tracking-tight">{t("tools.ocr.intelligence")}</h3>
                <Button variant="ghost" className="text-xs" onClick={onReset}>{t("tools.ocr.scanAnother")}</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: t("tools.ocr.fields.vendor"), value: ocrData.vendor, icon: <Activity className="w-3 h-3" /> },
                  { label: t("tools.ocr.fields.date"), value: ocrData.date, icon: <Activity className="w-3 h-3" /> },
                  { label: t("tools.ocr.fields.amount"), value: ocrData.amount, icon: <Activity className="w-3 h-3" />, primary: true },
                  { label: t("tools.ocr.fields.gstin"), value: ocrData.gstin, icon: <Activity className="w-3 h-3" /> }
                ].map((field) => (
                  <div key={field.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold opacity-60 uppercase mb-1 tracking-widest">{field.label}</p>
                    <p className={`text-lg font-bold tracking-tight ${field.primary ? 'text-primary' : ''}`}>{field.value}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full rounded-xl bg-primary shadow-glow gap-2 font-bold py-6">
                {t("tools.ocr.cta")} <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
