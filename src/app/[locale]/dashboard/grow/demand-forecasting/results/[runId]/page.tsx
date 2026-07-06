"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Package, Flame, Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/services/supabase/supabase";
import { getRunResults } from "@/services/api/forecasting";
import InsightSummary from "../components/InsightSummary";
import ExportButton from "../components/ExportButton";
import ForecastChart from "../components/ForecastChart";

// Helper to format date nicely for display
const formatDateNice = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  return d.toLocaleDateString(undefined, options);
};

export default function ResultsPage() {
  const { runId } = useParams();
  const [status, setStatus] = useState("pending");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [horizon, setHorizon] = useState<number>(7);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Ref to track current status without resetting interval
  const statusRef = useRef(status);
  statusRef.current = status;

  // Compute all our metrics from predictions using useMemo!
  const { totalVolume, topCategory, topDate, uniqueRegions, uniqueCategories, filteredPredictions } = useMemo(() => {
    const regions = Array.from(new Set(predictions.map((p: any) => p.region)));
    const categories = Array.from(new Set(predictions.map((p: any) => p.category)));

    let total = 0;
    const categoryTotals: Record<string, number> = {};
    const dateTotals: Record<string, number> = {};

    predictions.forEach((p: any) => {
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

    let filtered = predictions;
    if (selectedRegion !== "all") filtered = filtered.filter((p: any) => p.region === selectedRegion);
    if (selectedCategory !== "all") filtered = filtered.filter((p: any) => p.category === selectedCategory);

    return { totalVolume: total, topCategory: tCategory, topDate: tDate, uniqueRegions: regions, uniqueCategories: categories, filteredPredictions: filtered };
  }, [predictions, selectedRegion, selectedCategory]);

  useEffect(() => {
    if (!runId) return;

    const fetchInitialState = async () => {
      try {
        const { data: runData } = await supabase
          .from("forecast_runs")
          .select("*, datasets!forecast_runs_dataset_id_fkey(file_name)")
          .eq("id", runId as string)
          .single();

        if (runData) {
          setStatus(runData.status);
          if (runData.horizon) { setHorizon(runData.horizon); }
          if (runData.datasets && runData.datasets.file_name) { setFileName(runData.datasets.file_name); }
          if (runData.status === "completed") {
            const results = await getRunResults(runId as string);
            setPredictions(results.predictions ?? []);
          }
          if (runData.status === "failed") { setError(true); }
        }
      } catch (err) { console.error("Error fetching initial state:", err); }
    };

    fetchInitialState();

    const pollingIntervalMs = 5000;
    const maxPollingDurationMs = 300000;
    const pollStartTime = Date.now();

    const intervalId = setInterval(async () => {
      if (Date.now() - pollStartTime > maxPollingDurationMs) {
        clearInterval(intervalId);
        setTimeoutError(true);
        return;
      }

      try {
        const { data: runData } = await supabase
          .from("forecast_runs")
          .select("*, datasets!forecast_runs_dataset_id_fkey(file_name)")
          .eq("id", runId as string)
          .single();

        if (!runData) return;
        const newStatus = runData.status;
        if (newStatus !== statusRef.current) {
          setStatus(newStatus);
          if (runData.horizon) { setHorizon(runData.horizon); }
          if (runData.datasets && runData.datasets.file_name) { setFileName(runData.datasets.file_name); }

          if (newStatus === "completed") {
            clearInterval(intervalId);
            const results = await getRunResults(runId as string);
            setPredictions(results.predictions ?? []);
          }
          if (newStatus === "failed") { clearInterval(intervalId); setError(true); }
        }
      } catch (err) { console.error("Polling error:", err); }
    }, pollingIntervalMs);

    return () => { clearInterval(intervalId); };
  }, [runId]);

  const handleExport = async (runId: string) => {
    try {
      const { predictions } = await getRunResults(runId);
      if (!predictions || predictions.length === 0) return;

      const headers = ["date", "store_id", "category", "region", "predicted", "lower_bound", "upper_bound"].join(",");
      const rows = predictions.map(p => [p.forecast_date, p.store_id, p.category, p.region, p.predicted_value, p.lower_bound ?? "", p.upper_bound ?? ""].join(","));
      const csv = [headers, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName ? `forecast-${fileName}` : `forecast-${runId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) { console.error("Export failed:", error.message); }
  };

  if (timeoutError) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-lg font-black uppercase tracking-widest text-orange-400">Forecast Timed Out</p>
        <p className="text-xs text-muted-foreground font-bold">The forecast job took too long to complete. Please try again later.</p>
      </div>
    );
  }

  if (status === "pending" || status === "processing") {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 flex flex-col items-center gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-center space-y-2">
          <p className="text-lg font-black uppercase tracking-widest">🤖 Crunching your sales data...</p>
          <p className="text-sm text-muted-foreground font-bold">Hang tight, we'll have your forecast ready in a sec!</p>
        </div>
        <div className="w-full space-y-2 mt-4">
          {["Checking your uploaded file", "Building sales patterns", "Generating future predictions", "Putting your report together"].map((step, index) => (
            <div key={step} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Loader2 className="w-3 h-3 text-primary animate-spin" />
              <p className="text-sm font-bold uppercase tracking-widest opacity-60">{step}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || status === "failed") {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-lg font-black uppercase tracking-widest text-red-400">Forecast Failed</p>
        <p className="text-xs text-muted-foreground font-bold">Something went wrong. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight">Your Demand Forecast is Ready! 🎉</h1>
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
          Simple insights to help you stock better
        </p>
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

      <ForecastChart predictions={predictions} />

      <InsightSummary
        predictions={predictions}
        fileName={fileName}
        horizon={horizon}
        selectedRegion={selectedRegion}
        selectedCategory={selectedCategory}
      />

      <div className="glass-card p-8 flex flex-col items-center gap-6">
        <h3 className="text-xl font-black">Download Your Full Forecast</h3>
        <p className="text-sm text-muted-foreground text-center">Since your forecast has {predictions.length} records, download the full CSV to view all details.</p>
        {fileName && <p className="font-bold text-primary">File: {fileName}</p>}
        <ExportButton
          runId={runId as string}
          onExport={handleExport}
        />
      </div>
    </div>
  );
}
