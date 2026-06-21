"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ForecastChart from "../components/ForecastChart";
import ForecastTable from "../components/ForecastTable";
import InsightSummary from "../components/InsightSummary";
import ExportButton from "../components/ExportButton";
import { getRunResults } from "@/services/api/forecasting";
import { supabase } from "@/services/supabase/supabase";
import { Loader2 } from "lucide-react";

export default function ResultsPage() {
  const { runId } = useParams();
  const [status, setStatus] = useState("pending");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [horizon, setHorizon] = useState<number>(7);

  // Ref to track current status without resetting interval
  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    if (!runId) return;

    // Initial fetch to get current state
    const fetchInitialState = async () => {
      try {
        const { data: runData } = await supabase
          .from("forecast_runs")
          .select("*, datasets!forecast_runs_dataset_id_fkey(file_name)")
          .eq("id", runId as string)
          .single();

        if (runData) {
          setStatus(runData.status);
          if (runData.horizon) {
            setHorizon(runData.horizon);
          }
          if (runData.datasets && runData.datasets.file_name) {
            setFileName(runData.datasets.file_name);
          }
          if (runData.status === "completed") {
            const results = await getRunResults(runId as string);
            setPredictions(results.predictions ?? []);
          }
          if (runData.status === "failed") {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Error fetching initial state:", err);
      }
    };

    fetchInitialState();

    // Short polling engine setup
    const pollingIntervalMs = 5000; // 5 seconds
    const maxPollingDurationMs = 300000; // 5 minutes
    const pollStartTime = Date.now();

    const intervalId = setInterval(async () => {
      // Check circuit breaker first
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
          if (runData.horizon) {
            setHorizon(runData.horizon);
          }
          if (runData.datasets && runData.datasets.file_name) {
            setFileName(runData.datasets.file_name);
          }

          if (newStatus === "completed") {
            clearInterval(intervalId);
            const results = await getRunResults(runId as string);
            setPredictions(results.predictions ?? []);
          }

          if (newStatus === "failed") {
            clearInterval(intervalId);
            setError(true);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, pollingIntervalMs);

    // Cleanup hook to prevent memory leaks
    return () => {
      clearInterval(intervalId);
    };
  }, [runId]);

  // Export handler — real CSV download
  const handleExport = async (runId: string) => {
    try {
      const { predictions } = await getRunResults(runId);

      if (!predictions || predictions.length === 0) return;

      const headers = [
        "date",
        "store_id",
        "category",
        "region",
        "predicted",
        "lower_bound",
        "upper_bound"
      ].join(",");

      const rows = predictions.map(p =>
        [
          p.forecast_date,
          p.store_id,
          p.category,
          p.region,
          p.predicted_value,
          p.lower_bound ?? "",
          p.upper_bound ?? ""
        ].join(",")
      );

      const csv = [headers, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `forecast-${runId}.csv`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error("Export failed:", error.message);
    }
  };

  // Timeout error state
  if (timeoutError) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-lg font-black uppercase tracking-widest text-orange-400">
          Forecast Timed Out
        </p>
        <p className="text-xs text-muted-foreground font-bold">
          The forecast job took too long to complete. Please try again later.
        </p>
      </div>
    );
  }

  // Loading State
  if (status === "pending" || status === "processing") {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 flex flex-col items-center gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-center space-y-2">
          <p className="text-lg font-black uppercase tracking-widest">
            🤖 Crunching your sales data...
          </p>
          <p className="text-sm text-muted-foreground font-bold">
            Hang tight, we'll have your forecast ready in a sec!
          </p>
        </div>
        <div className="w-full space-y-2 mt-4">
          {[
            "Checking your uploaded file",
            "Building sales patterns",
            "Generating future predictions",
            "Putting your report together"
          ].map((step) => (
            <div
              key={step}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <Loader2 className="w-3 h-3 text-primary animate-spin" />
              <p className="text-sm font-bold uppercase tracking-widest opacity-60">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error || status === "failed") {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-lg font-black uppercase tracking-widest text-red-400">
          Forecast Failed
        </p>
        <p className="text-xs text-muted-foreground font-bold">
          Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  // Results State
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight">
          Your Demand Forecast is Ready! 🎉
        </h1>
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
          Simple insights to help you stock better
        </p>
      </div>

      {predictions.length > 0 && (
        <ForecastChart predictions={predictions} />
      )}

      <InsightSummary
        predictions={predictions}
        fileName={fileName}
        horizon={horizon}
      />

      {predictions.length > 0 && (
        <ForecastTable predictions={predictions} />
      )}

      <div className="flex justify-end">
        <ExportButton
          runId={runId as string}
          onExport={handleExport}
        />
      </div>
    </div>
  );
}
