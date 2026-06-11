"use client";

import MetricCards from "../components/MetricCards";
import ExportButton from "../components/ExportButton";

// Sample data for testing
const SAMPLE_METRICS = {
  id: "test-123",
  run_id: "run-123",
  mae: 3.2,
  rmse: 4.1,
  mape: 8.5
}

export default function ResultsPage() {
  const handleExport = async (runId: string) => {
    // simulate export for now
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log("Exporting run:", runId)
  }

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
      <MetricCards metrics={SAMPLE_METRICS} />

      {/* Chart placeholder */}
      <div className="glass-card p-8 space-y-4">
        <h2 className="text-xl font-black uppercase tracking-widest">
          Forecast Chart
        </h2>
        <div className="h-64 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
            Chart coming soon
          </p>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <ExportButton
          runId="test-123"
          onExport={handleExport}
        />
      </div>

    </div>
  )
}