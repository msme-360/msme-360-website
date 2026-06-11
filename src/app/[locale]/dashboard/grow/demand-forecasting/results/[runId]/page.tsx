"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MetricCards from "../components/MetricCards";
import ForecastChart from "../components/ForecastChart";
import ForecastTable from "../components/ForecastTable";
import InsightSummary from "../components/InsightSummary";
import ExportButton from "../components/ExportButton";
import { getRunResults } from "@/services/api/forecasting";
import { supabase } from "@/services/supabase/supabase";
import { Loader2 } from "lucide-react";

export default function ResultsPage() {
  const { runId } = useParams()
  const [status, setStatus] = useState("pending")
  const [metrics, setMetrics] = useState<any>(null)
  const [predictions, setPredictions] = useState<any[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!runId) return

    // Fetch initial status first
    const fetchInitialStatus = async () => {
      const { data } = await supabase
        .from('forecast_runs')
        .select('status')
        .eq('id', runId as string)
        .single()
      
      if (data) {
        setStatus(data.status)
        if (data.status === 'completed') {
          const { metrics, predictions } = await getRunResults(runId as string)
          setMetrics(metrics)
          setPredictions(predictions ?? [])
        }
        if (data.status === 'failed') {
          setError(true)
        }
      }
    }

    fetchInitialStatus()

    // Set up Realtime subscription
    const channel = supabase
      .channel(`forecast_run_${runId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'forecast_runs',
          filter: `id=eq.${runId}`
        },
        async (payload) => {
          const newStatus = payload.new.status
          setStatus(newStatus)
          
          if (newStatus === 'completed') {
            const { metrics, predictions } = await getRunResults(runId as string)
            setMetrics(metrics)
            setPredictions(predictions ?? [])
          }
          
          if (newStatus === 'failed') {
            setError(true)
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [runId])

  // Export handler — real CSV download
  const handleExport = async (runId: string) => {
    try {
      const { predictions } = await getRunResults(runId)

      if (!predictions || predictions.length === 0) return

      const headers = [
        "date",
        "product",
        "predicted",
        "actual",
        "lower_bound",
        "upper_bound"
      ].join(",")

      const rows = predictions.map(p =>
        [
          p.forecast_date,
          p.entity_name,
          p.predicted_value,
          p.actual_value ?? "",
          p.lower_bound ?? "",
          p.upper_bound ?? ""
        ].join(",")
      )

      const csv = [headers, ...rows].join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `forecast-${runId}.csv`
      a.click()
      URL.revokeObjectURL(url)

    } catch (error: any) {
      console.error("Export failed:", error.message)
    }
  }

  // Loading State
  if (status === "pending" || status === "processing") {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 flex flex-col items-center gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-center space-y-2">
          <p className="text-lg font-black uppercase tracking-widest">
            Running Forecast...
          </p>
          <p className="text-xs text-muted-foreground font-bold">
            This may take a few moments
          </p>
        </div>
        <div className="w-full space-y-2 mt-4">
          {[
            "Cleaning data",
            "Engineering features",
            "Training model",
            "Generating predictions"
          ].map((step) => (
            <div
              key={step}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <Loader2 className="w-3 h-3 text-primary animate-spin" />
              <p className="text-xs font-black uppercase tracking-widest opacity-60">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
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
    )
  }

  // Results State
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight">
          Forecast Results
        </h1>
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
          Your demand forecast is ready
        </p>
      </div>

      {metrics && <MetricCards metrics={metrics} />}

      {predictions.length > 0 && (
        <ForecastChart predictions={predictions} />
      )}

      <InsightSummary modelName="Prophet" horizon={7} />

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
  )
}