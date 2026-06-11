"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ColumnMapper from "./components/ColumnMapper";
import {
  saveColumnMapping,
  createForecastRun,
  triggerMLService
} from "@/services/api/forecasting";
import { ColumnInfo } from "@/utils/fileParser";

export default function MapColumnsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [columnInfos, setColumnInfos] = useState<ColumnInfo[]>([])
  const datasetId = searchParams.get("datasetId") || ""

  useEffect(() => {
    const columnsJson = searchParams.get("columns")
    if (columnsJson) {
      try {
        const parsed = JSON.parse(decodeURIComponent(columnsJson))
        setColumnInfos(parsed)
      } catch (e) {
        console.error("Failed to parse columns", e)
      }
    }
  }, [searchParams])

  const handleConfirm = async (
    mapping: Record<string, string>,
    model: string,
    horizon: number
  ) => {
    try {
      setIsLoading(true)

      // Step 1 — Save column mapping to Supabase
      await saveColumnMapping(datasetId, mapping, columnInfos)

      // Step 2 — Create forecast run in Supabase
      const run = await createForecastRun(datasetId, model, horizon)

      // Step 3 — Trigger Python ML service
      // Python reads everything from Supabase using run_id
      await triggerMLService(run.id)

      // Step 4 — Go to results page
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
        csvColumns={columnInfos.map(col => col.name)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}