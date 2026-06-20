"use client";

import { motion } from "framer-motion";
import ForecastChart from "../components/ForecastChart";
import ForecastTable from "../components/ForecastTable";
import InsightSummary from "../components/InsightSummary";
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
    forecast_date: "2026-01-11",
    store_id: "S001",
    category: "GROCERIES",
    region: "NORTH",
    predicted_value: 118,
    lower_bound: 106,
    upper_bound: 130
  },
  {
    id: "2",
    run_id: "sample",
    forecast_date: "2026-01-11",
    store_id: "S001",
    category: "ELECTRONICS",
    region: "NORTH",
    predicted_value: 245,
    lower_bound: 220,
    upper_bound: 270
  },
  {
    id: "3",
    run_id: "sample",
    forecast_date: "2026-01-11",
    store_id: "S002",
    category: "GROCERIES",
    region: "CENTRAL",
    predicted_value: 92,
    lower_bound: 83,
    upper_bound: 101
  },
  {
    id: "4",
    run_id: "sample",
    forecast_date: "2026-01-11",
    store_id: "S002",
    category: "CLOTHING",
    region: "CENTRAL",
    predicted_value: 156,
    lower_bound: 140,
    upper_bound: 172
  },
  {
    id: "5",
    run_id: "sample",
    forecast_date: "2026-01-11",
    store_id: "S003",
    category: "ELECTRONICS",
    region: "SOUTH",
    predicted_value: 205,
    lower_bound: 184,
    upper_bound: 226
  },
  {
    id: "6",
    run_id: "sample",
    forecast_date: "2026-01-11",
    store_id: "S003",
    category: "CLOTHING",
    region: "SOUTH",
    predicted_value: 189,
    lower_bound: 170,
    upper_bound: 208
  },
  {
    id: "7",
    run_id: "sample",
    forecast_date: "2026-01-12",
    store_id: "S001",
    category: "GROCERIES",
    region: "NORTH",
    predicted_value: 125,
    lower_bound: 112,
    upper_bound: 138
  },
  {
    id: "8",
    run_id: "sample",
    forecast_date: "2026-01-12",
    store_id: "S001",
    category: "ELECTRONICS",
    region: "NORTH",
    predicted_value: 260,
    lower_bound: 234,
    upper_bound: 286
  }
]

export default function SampleResultsPage() {

  const handleExport = async () => {
    const headers = [
      "date",
      "store_id",
      "category",
      "region",
      "predicted",
      "lower_bound",
      "upper_bound"
    ].join(",")

    const rows = SAMPLE_PREDICTIONS.map(p =>
      [
        p.forecast_date,
        p.store_id,
        p.category,
        p.region,
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

      {/* EXPLICIT UX DISCLAIMER BANNER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20"
      >
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-sm font-black text-amber-500 mb-1">
            Viewing Sample Simulation Mode
          </h3>
          <p className="text-xs font-bold text-amber-400/80">
            The analytics displayed here are mock baseline results. Real chart rendering, dynamic
            filtering, and comprehensive data matrices will automatically update upon your true custom
            dataset file upload.
          </p>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
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

      {/* Forecast Chart */}
      <ForecastChart predictions={SAMPLE_PREDICTIONS} />

      {/* Action Items */}
      <InsightSummary />

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
