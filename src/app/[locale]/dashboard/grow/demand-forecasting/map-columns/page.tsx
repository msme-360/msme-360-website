"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ColumnMapper from "./components/ColumnMapper";
import {
  saveColumnMapping,
  createForecastRun,
  triggerMLService
} from "@/services/api/forecasting";

// Sample columns for now
// Later → read from actual CSV headers
const SAMPLE_COLUMNS = [
  "Date",
  "Product Name",
  "Qty Sold",
  "Store",
  "Region",
  "Price"
]

export default function MapColumnsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [datasetId, setDatasetId] = useState("")

  useEffect(() => {
    // Get datasetId saved from upload page
    const id = localStorage.getItem("datasetId") || ""
    setDatasetId(id)
  }, [])

  const handleConfirm = async (
    mapping: Record<string, string>,
    model: string,
    horizon: number
  ) => {
    try {
      setIsLoading(true)

      // Step 1 — Save column mapping to Supabase
      await saveColumnMapping(datasetId, mapping)

      // Step 2 — Create forecast run in Supabase
      const run = await createForecastRun(datasetId, model, horizon)

      // Step 3 — Save runId for results page
      localStorage.setItem("runId", run.id)

      // Step 4 — Trigger Python ML service
      // Python reads everything from Supabase using run_id
      await triggerMLService(run.id)

      // Step 5 — Go to results page
      router.push(
        `/dashboard/grow/demand-forecasting/results/${run.id}`
      )

    } catch (error: any) {
      console.error("Error:", error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <ColumnMapper
        csvColumns={SAMPLE_COLUMNS}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}