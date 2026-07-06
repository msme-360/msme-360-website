"use client";

import { motion } from "framer-motion";
import { BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface ForecastingToolProps {
  forecastVal: number;
  setForecastVal: (val: number) => void;
}

export default function ForecastingTool({}: ForecastingToolProps) {
  const t = useTranslations("MicroAIHub");
  const router = useRouter();
  return (
    <motion.div
      key="forecasting"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <BarChart3 className="w-40 h-40" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              Demand Forecasting{' '}
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium italic">
              Upload your sales data to generate accurate demand forecasts
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
            Latest Model
          </Badge>
        </div>

        <div className="bg-background/40 rounded-3xl p-8 border border-white/5">
          <p className="text-muted-foreground mb-6">
            Upload your sales CSV or Excel file, map your columns, and generate AI-powered demand forecasts.
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={() => router.push("/dashboard/grow/demand-forecasting/upload")}
            className="rounded-xl shadow-glow gap-2 bg-primary text-primary-foreground hover:scale-[1.02] transition-transform"
          >
            Start Forecasting <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
