"use client";

import MetricCards from "../components/MetricCards";
import ExportButton from "../components/ExportButton";
import ForecastChart from "../components/ForecastChart";
import ForecastTable from "../components/ForecastTable";
import InsightSummary from "../components/InsightSummary";

// Sample data for testing UI
const SAMPLE_METRICS = {
  id: "test-123",
  run_id: "run-123",
  mae: 3.2,
  rmse: 4.1,
  mape: 8.5
}

const SAMPLE_PREDICTIONS = [
  {
    id: "1",
    run_id: "run-123",
    forecast_date: "2026-06-10",
    entity_name: "SKU-001",
    actual_value: 30,
    predicted_value: 34,
    lower_bound: 28,
    upper_bound: 40
  },
  {
    id: "2",
    run_id: "run-123",
    forecast_date: "2026-06-11",
    entity_name: "SKU-001",
    actual_value: 27,
    predicted_value: 29,
    lower_bound: 24,
    upper_bound: 35
  },
  {
    id: "3",
    run_id: "run-123",
    forecast_date: "2026-06-12",
    entity_name: "SKU-001",
    actual_value: null,
    predicted_value: 41,
    lower_bound: 35,
    upper_bound: 47
  },
  {
    id: "4",
    run_id: "run-123",
    forecast_date: "2026-06-13",
    entity_name: "SKU-001",
    actual_value: null,
    predicted_value: 38,
    lower_bound: 32,
    upper_bound: 44
  },
  {
    id: "5",
    run_id: "run-123",
    forecast_date: "2026-06-14",
    entity_name: "SKU-001",
    actual_value: null,
    predicted_value: 45,
    lower_bound: 38,
    upper_bound: 52
  }
]

export default function ResultsPage() {
  const handleExport = async (runId: string) => {
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

      {/* Forecast Chart */}
      <ForecastChart predictions={SAMPLE_PREDICTIONS} />

      {/* Insight Summary */}
      <InsightSummary
        modelName="Prophet"
        horizon={7}
      />

      {/* Forecast Table */}
      <ForecastTable predictions={SAMPLE_PREDICTIONS} />

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