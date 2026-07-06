"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Flame, Calendar as CalendarIcon } from "lucide-react";
import InsightSummary from "../components/InsightSummary";
import ExportButton from "../components/ExportButton";
import ForecastChart from "../components/ForecastChart";
import { ForecastOutput } from "@/types/forecasting";

// Helper to format date nicely for display
const formatDateNice = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  return d.toLocaleDateString(undefined, options);
};

const SAMPLE_PREDICTIONS: ForecastOutput[] = [
  // Day 1: 2026-01-11
  { id: "1", run_id: "sample", forecast_date: "2026-01-11", store_id: "S001", category: "GROCERIES", region: "NORTH", predicted_value: 118, lower_bound: 106, upper_bound: 130 },
  { id: "2", run_id: "sample", forecast_date: "2026-01-11", store_id: "S001", category: "ELECTRONICS", region: "NORTH", predicted_value: 245, lower_bound: 220, upper_bound: 270 },
  { id: "3", run_id: "sample", forecast_date: "2026-01-11", store_id: "S002", category: "GROCERIES", region: "CENTRAL", predicted_value: 92, lower_bound: 83, upper_bound: 101 },
  { id: "4", run_id: "sample", forecast_date: "2026-01-11", store_id: "S002", category: "CLOTHING", region: "CENTRAL", predicted_value: 156, lower_bound: 140, upper_bound: 172 },
  { id: "5", run_id: "sample", forecast_date: "2026-01-11", store_id: "S003", category: "ELECTRONICS", region: "SOUTH", predicted_value: 205, lower_bound: 184, upper_bound: 226 },
  { id: "6", run_id: "sample", forecast_date: "2026-01-11", store_id: "S003", category: "CLOTHING", region: "SOUTH", predicted_value: 189, lower_bound: 170, upper_bound: 208 },
  
  // Day 2: 2026-01-12
  { id: "7", run_id: "sample", forecast_date: "2026-01-12", store_id: "S001", category: "GROCERIES", region: "NORTH", predicted_value: 125, lower_bound: 112, upper_bound: 138 },
  { id: "8", run_id: "sample", forecast_date: "2026-01-12", store_id: "S001", category: "ELECTRONICS", region: "NORTH", predicted_value: 260, lower_bound: 234, upper_bound: 286 },
  { id: "9", run_id: "sample", forecast_date: "2026-01-12", store_id: "S002", category: "GROCERIES", region: "CENTRAL", predicted_value: 98, lower_bound: 88, upper_bound: 108 },
  { id: "10", run_id: "sample", forecast_date: "2026-01-12", store_id: "S002", category: "CLOTHING", region: "CENTRAL", predicted_value: 165, lower_bound: 148, upper_bound: 182 },
  { id: "11", run_id: "sample", forecast_date: "2026-01-12", store_id: "S003", category: "ELECTRONICS", region: "SOUTH", predicted_value: 218, lower_bound: 196, upper_bound: 240 },
  { id: "12", run_id: "sample", forecast_date: "2026-01-12", store_id: "S003", category: "CLOTHING", region: "SOUTH", predicted_value: 198, lower_bound: 178, upper_bound: 218 },

  // Day 3: 2026-01-13
  { id: "13", run_id: "sample", forecast_date: "2026-01-13", store_id: "S001", category: "GROCERIES", region: "NORTH", predicted_value: 132, lower_bound: 118, upper_bound: 146 },
  { id: "14", run_id: "sample", forecast_date: "2026-01-13", store_id: "S001", category: "ELECTRONICS", region: "NORTH", predicted_value: 275, lower_bound: 248, upper_bound: 302 },
  { id: "15", run_id: "sample", forecast_date: "2026-01-13", store_id: "S002", category: "GROCERIES", region: "CENTRAL", predicted_value: 105, lower_bound: 94, upper_bound: 116 },
  { id: "16", run_id: "sample", forecast_date: "2026-01-13", store_id: "S002", category: "CLOTHING", region: "CENTRAL", predicted_value: 174, lower_bound: 156, upper_bound: 192 },
  { id: "17", run_id: "sample", forecast_date: "2026-01-13", store_id: "S003", category: "ELECTRONICS", region: "SOUTH", predicted_value: 231, lower_bound: 208, upper_bound: 254 },
  { id: "18", run_id: "sample", forecast_date: "2026-01-13", store_id: "S003", category: "CLOTHING", region: "SOUTH", predicted_value: 207, lower_bound: 186, upper_bound: 228 },

  // Day 4: 2026-01-14
  { id: "19", run_id: "sample", forecast_date: "2026-01-14", store_id: "S001", category: "GROCERIES", region: "NORTH", predicted_value: 138, lower_bound: 124, upper_bound: 152 },
  { id: "20", run_id: "sample", forecast_date: "2026-01-14", store_id: "S001", category: "ELECTRONICS", region: "NORTH", predicted_value: 290, lower_bound: 261, upper_bound: 319 },
  { id: "21", run_id: "sample", forecast_date: "2026-01-14", store_id: "S002", category: "GROCERIES", region: "CENTRAL", predicted_value: 110, lower_bound: 99, upper_bound: 121 },
  { id: "22", run_id: "sample", forecast_date: "2026-01-14", store_id: "S002", category: "CLOTHING", region: "CENTRAL", predicted_value: 182, lower_bound: 164, upper_bound: 200 },
  { id: "23", run_id: "sample", forecast_date: "2026-01-14", store_id: "S003", category: "ELECTRONICS", region: "SOUTH", predicted_value: 245, lower_bound: 220, upper_bound: 270 },
  { id: "24", run_id: "sample", forecast_date: "2026-01-14", store_id: "S003", category: "CLOTHING", region: "SOUTH", predicted_value: 216, lower_bound: 194, upper_bound: 238 },

  // Day 5: 2026-01-15
  { id: "25", run_id: "sample", forecast_date: "2026-01-15", store_id: "S001", category: "GROCERIES", region: "NORTH", predicted_value: 145, lower_bound: 130, upper_bound: 160 },
  { id: "26", run_id: "sample", forecast_date: "2026-01-15", store_id: "S001", category: "ELECTRONICS", region: "NORTH", predicted_value: 305, lower_bound: 274, upper_bound: 336 },
  { id: "27", run_id: "sample", forecast_date: "2026-01-15", store_id: "S002", category: "GROCERIES", region: "CENTRAL", predicted_value: 118, lower_bound: 106, upper_bound: 130 },
  { id: "28", run_id: "sample", forecast_date: "2026-01-15", store_id: "S002", category: "CLOTHING", region: "CENTRAL", predicted_value: 190, lower_bound: 171, upper_bound: 209 },
  { id: "29", run_id: "sample", forecast_date: "2026-01-15", store_id: "S003", category: "ELECTRONICS", region: "SOUTH", predicted_value: 258, lower_bound: 232, upper_bound: 284 },
  { id: "30", run_id: "sample", forecast_date: "2026-01-15", store_id: "S003", category: "CLOTHING", region: "SOUTH", predicted_value: 225, lower_bound: 202, upper_bound: 248 },

  // Day 6: 2026-01-16
  { id: "31", run_id: "sample", forecast_date: "2026-01-16", store_id: "S001", category: "GROCERIES", region: "NORTH", predicted_value: 152, lower_bound: 136, upper_bound: 168 },
  { id: "32", run_id: "sample", forecast_date: "2026-01-16", store_id: "S001", category: "ELECTRONICS", region: "NORTH", predicted_value: 320, lower_bound: 288, upper_bound: 352 },
  { id: "33", run_id: "sample", forecast_date: "2026-01-16", store_id: "S002", category: "GROCERIES", region: "CENTRAL", predicted_value: 125, lower_bound: 112, upper_bound: 138 },
  { id: "34", run_id: "sample", forecast_date: "2026-01-16", store_id: "S002", category: "CLOTHING", region: "CENTRAL", predicted_value: 198, lower_bound: 178, upper_bound: 218 },
  { id: "35", run_id: "sample", forecast_date: "2026-01-16", store_id: "S003", category: "ELECTRONICS", region: "SOUTH", predicted_value: 272, lower_bound: 245, upper_bound: 299 },
  { id: "36", run_id: "sample", forecast_date: "2026-01-16", store_id: "S003", category: "CLOTHING", region: "SOUTH", predicted_value: 234, lower_bound: 210, upper_bound: 258 },

  // Day 7: 2026-01-17
  { id: "37", run_id: "sample", forecast_date: "2026-01-17", store_id: "S001", category: "GROCERIES", region: "NORTH", predicted_value: 160, lower_bound: 144, upper_bound: 176 },
  { id: "38", run_id: "sample", forecast_date: "2026-01-17", store_id: "S001", category: "ELECTRONICS", region: "NORTH", predicted_value: 335, lower_bound: 301, upper_bound: 369 },
  { id: "39", run_id: "sample", forecast_date: "2026-01-17", store_id: "S002", category: "GROCERIES", region: "CENTRAL", predicted_value: 132, lower_bound: 118, upper_bound: 146 },
  { id: "40", run_id: "sample", forecast_date: "2026-01-17", store_id: "S002", category: "CLOTHING", region: "CENTRAL", predicted_value: 207, lower_bound: 186, upper_bound: 228 },
  { id: "41", run_id: "sample", forecast_date: "2026-01-17", store_id: "S003", category: "ELECTRONICS", region: "SOUTH", predicted_value: 285, lower_bound: 256, upper_bound: 314 },
  { id: "42", run_id: "sample", forecast_date: "2026-01-17", store_id: "S003", category: "CLOTHING", region: "SOUTH", predicted_value: 243, lower_bound: 218, upper_bound: 268 },
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

      <ForecastChart predictions={SAMPLE_PREDICTIONS} />

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
