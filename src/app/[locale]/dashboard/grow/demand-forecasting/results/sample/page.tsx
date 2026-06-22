"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Flame, Calendar as CalendarIcon } from "lucide-react";
import InsightSummary from "../components/InsightSummary";
import ExportButton from "../components/ExportButton";
import { ForecastOutput } from "@/types/forecasting";

// Helper to format date nicely for display
const formatDateNice = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  return d.toLocaleDateString(undefined, options);
};

const SAMPLE_PREDICTIONS: ForecastOutput[] = [
  { id: "1", run_id: "sample", forecast_date: "2026-01-11", store_id: "S001", category: "GROCERIES", region: "NORTH", predicted_value: 118, lower_bound: 106, upper_bound: 130 },
  { id: "2", run_id: "sample", forecast_date: "2026-01-11", store_id: "S001", category: "ELECTRONICS", region: "NORTH", predicted_value: 245, lower_bound: 220, upper_bound: 270 },
  { id: "3", run_id: "sample", forecast_date: "2026-01-11", store_id: "S002", category: "GROCERIES", region: "CENTRAL", predicted_value: 92, lower_bound: 83, upper_bound: 101 },
  { id: "4", run_id: "sample", forecast_date: "2026-01-11", store_id: "S002", category: "CLOTHING", region: "CENTRAL", predicted_value: 156, lower_bound: 140, upper_bound: 172 },
  { id: "5", run_id: "sample", forecast_date: "2026-01-11", store_id: "S003", category: "ELECTRONICS", region: "SOUTH", predicted_value: 205, lower_bound: 184, upper_bound: 226 },
  { id: "6", run_id: "sample", forecast_date: "2026-01-11", store_id: "S003", category: "CLOTHING", region: "SOUTH", predicted_value: 189, lower_bound: 170, upper_bound: 208 },
  { id: "7", run_id: "sample", forecast_date: "2026-01-12", store_id: "S001", category: "GROCERIES", region: "NORTH", predicted_value: 125, lower_bound: 112, upper_bound: 138 },
  { id: "8", run_id: "sample", forecast_date: "2026-01-12", store_id: "S001", category: "ELECTRONICS", region: "NORTH", predicted_value: 260, lower_bound: 234, upper_bound: 286 }
];

export default function SampleResultsPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { totalVolume, topCategory, topDate } = useMemo(() => {
    let total = 0;
    const categoryTotals: Record<string, number> = {};
    const dateTotals: Record<string, number> = {};

    SAMPLE_PREDICTIONS.forEach((p: any) => {
      total += p.predicted_value;
      categoryTotals[p.category] = (categoryTotals[p.category] || 0) + p.predicted_value;
      dateTotals[p.forecast_date] = (dateTotals[p.forecast_date] || 0) + p.predicted_value;
    });

    let tCategory = "";
    let tCategoryTotal = 0;
    Object.entries(categoryTotals).forEach(([cat, vol]) => { if (vol > tCategoryTotal) { tCategoryTotal = vol; tCategory = cat; } });

    let tDate = "";
    let tDateTotal = 0;
    Object.entries(dateTotals).forEach(([date, vol]) => { if (vol > tDateTotal) { tDateTotal = vol; tDate = date; } });

    return { totalVolume: total, topCategory: tCategory, topDate: tDate };
  }, []);

  const handleExport = async () => {
    const headers = ["date", "store_id", "category", "region", "predicted", "lower_bound", "upper_bound"].join(",");
    const rows = SAMPLE_PREDICTIONS.map(p => [p.forecast_date, p.store_id, p.category, p.region, p.predicted_value, p.lower_bound, p.upper_bound].join(","));
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-forecast-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-sm font-black text-amber-500 mb-1">Viewing Sample Simulation Mode</h3>
          <p className="text-xs font-bold text-amber-400/80">The analytics displayed here are mock baseline results. Upload your own CSV for real forecasts.</p>
        </div>
      </motion.div>

      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black tracking-tight">Sample Forecast Results</h1>
          <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-black uppercase tracking-widest">Sample Data</span>
        </div>
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">This is a preview using sample data — upload your own CSV for real forecasts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between"><Package className="w-6 h-6 text-emerald-400" /></div>
          <div>
            <p className="text-3xl font-black tracking-tight text-emerald-400">{Math.round(totalVolume).toLocaleString()}</p>
            <p className="text-xs font-black uppercase tracking-widest opacity-60 mt-1">Total Units to Sell</p>
            <p className="text-xs text-muted-foreground mt-2">📦 Total items your business will need over this period</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between"><Flame className="w-6 h-6 text-amber-400" /></div>
          <div>
            <p className="text-3xl font-black tracking-tight text-amber-400">{topCategory || "N/A"}</p>
            <p className="text-xs font-black uppercase tracking-widest opacity-60 mt-1">🔥 Top Moving Department</p>
            <p className="text-xs text-muted-foreground mt-2">This category will sell the most units overall</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between"><CalendarIcon className="w-6 h-6 text-blue-400" /></div>
          <div>
            <p className="text-lg font-black tracking-tight text-blue-400">{topDate ? formatDateNice(topDate) : "N/A"}</p>
            <p className="text-xs font-black uppercase tracking-widest opacity-60 mt-1">📅 Highest Demand Day</p>
            <p className="text-xs text-muted-foreground mt-2">Be extra prepared with extra stock on this day</p>
          </div>
        </motion.div>
      </div>

      <InsightSummary
        predictions={SAMPLE_PREDICTIONS}
        fileName="sample-data.csv"
        horizon={7}
        selectedRegion={selectedRegion}
        selectedCategory={selectedCategory}
      />

      <div className="glass-card p-8 flex flex-col items-center gap-6">
        <h3 className="text-xl font-black">Download Sample Forecast</h3>
        <p className="text-sm text-muted-foreground text-center">Download the sample forecast CSV to see what the real results will look like.</p>
        <ExportButton
          runId="sample"
          onExport={handleExport}
        />
      </div>
    </div>
  );
}
