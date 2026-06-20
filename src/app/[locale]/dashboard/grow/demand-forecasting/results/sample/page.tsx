"use client";

import { motion } from "framer-motion";
import ForecastChart from "../components/ForecastChart";
import ForecastTable from "../components/ForecastTable";
import MetricCards from "../components/MetricCards";
import ExportButton from "../components/ExportButton";
import { ForecastOutput, ForecastMetrics } from "@/types/forecasting";

const SAMPLE_METRICS: ForecastMetrics = {
  id: "sample",
  run_id: "sample",
  mae: 8.5,
  rmse: 10.2,
  mape: 7.8
}

const SAMPLE_PREDICTIONS: ForecastOutput[] = [
  {
    id: "1",
    run_id: "sample",
    forecast_date: "2026-01-06",
    store_id: "S001",
    category: "Product A",
    region: "south",
    predicted_value: 118,
    lower_bound: 105,
    upper_bound: 131
  },
  {
    id: "2",
    run_id: "sample",
    forecast_date: "2026-01-07",
    store_id: "S001",
    category: "Product A",
    region: "south",
    predicted_value: 125,
    lower_bound: 112,
    upper_bound: 138
  },
  {
    id: "3",
    run_id: "sample",
    forecast_date: "2026-01-08",
    store_id: "S001",
    category: "Product A",
    region: "south",
    predicted_value: 108,
    lower_bound: 95,
    upper_bound: 121
  },
  {
    id: "4",
    run_id: "sample",
    forecast_date: "2026-01-06",
    store_id: "S002",
    category: "Product B",
    region: "north",
    predicted_value: 88,
    lower_bound: 78,
    upper_bound: 98
  },
  {
    id: "5",
    run_id: "sample",
    forecast_date: "2026-01-07",
    store_id: "S002",
    category: "Product B",
    region: "north",
    predicted_value: 95,
    lower_bound: 85,
    upper_bound: 105
  },
  {
    id: "6",
    run_id: "sample",
    forecast_date: "2026-01-08",
    store_id: "S002",
    category: "Product B",
    region: "north",
    predicted_value: 82,
    lower_bound: 72,
    upper_bound: 92
  }
]

export default function SampleResultsPage() {

  const handleExport = async () => {
    const headers = [
      "date",
      "product",
      "predicted",
      "lower_bound",
      "upper_bound"
    ].join(",")

    const rows = SAMPLE_PREDICTIONS.map(p =>
      [
        p.forecast_date,
        p.category,        // ← fixed from entity_name
        p.predicted_value,
        p.lower_bound,
        p.upper_bound
      ].join(",")
    )

    const csv = [headers, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample-forecast-results.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black tracking-tight">
            Sample Forecast Results
          </h1>
          <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-black uppercase tracking-widest">
            Sample Data
          </span>
        </div>
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
          This is a preview using sample data — upload your own CSV for real forecasts
        </p>
      </motion.div>

      {/* Metric Cards */}
      <MetricCards metrics={SAMPLE_METRICS} />

      {/* Forecast Chart */}
      <ForecastChart predictions={SAMPLE_PREDICTIONS} />

      {/* Forecast Table */}
      <ForecastTable predictions={SAMPLE_PREDICTIONS} />

      {/* Export Button */}
      <div className="flex justify-end">
        <ExportButton
          runId="sample"
          onExport={handleExport}
        />
      </div>

    </div>
  )
}