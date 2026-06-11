"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MetricCards from "../components/MetricCards";
import ForecastChart from "../components/ForecastChart";
import ForecastTable from "../components/ForecastTable";
import InsightSummary from "../components/InsightSummary";
import ExportButton from "../components/ExportButton";
import { getRunStatus, getRunResults } from "@/services/api/forecasting";
import { Loader2 } from "lucide-react";

export default function ResultsPage() {
  const { runId } = useParams()
  const [status, setStatus] = useState("pending")
  const [metrics, setMetrics] = useState<any>(null)
  const [predictions, setPredictions] = useState<any[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!runId) return

    // Poll every 3 seconds
    const interval = setInterval(async () => {
      try {
        const currentStatus = await getRunStatus(runId as string)
        setStatus(currentStatus)

        if (currentStatus === "completed") {
          clearInterval(interval)
          // Fetch results
          const { metrics, predictions } = await getRunResults(runId as string)
          setMetrics(metrics)
          setPredictions(predictions ?? [])
        }

        if (currentStatus === "failed") {
          clearInterval(interval)
          setError(true)
        }

      } catch (err) {
        clearInterval(interval)
        setError(true)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [runId])

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
        {/* Processing Steps */}
        <div className="w-full space-y-2 mt-4">
          {[
            "Cleaning data",
            "Engineering features",
            "Training model",
            "Generating predictions"
          ].map((step, index) => (
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

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight">
          Forecast Results
        </h1>
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
          Your demand forecast is ready
        </p>
      </div>

      {/* Metric Cards */}
      {metrics && <MetricCards metrics={metrics} />}

      {/* Forecast Chart */}
      {predictions.length > 0 && (
        <ForecastChart predictions={predictions} />
      )}

      {/* Insight Summary */}
      <InsightSummary modelName="Prophet" horizon={7} />

      {/* Forecast Table */}
      {predictions.length > 0 && (
        <ForecastTable predictions={predictions} />
      )}

      {/* Export Button */}
      <div className="flex justify-end">
        <ExportButton
          runId={runId as string}
          onExport={async (id) => {
            await new Promise(r => setTimeout(r, 2000))
            console.log("Export:", id)
          }}
        />
      </div>

    </div>
  )
}