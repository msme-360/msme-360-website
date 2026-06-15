"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ColumnMapper from "./components/ColumnMapper";
import { initializeForecast } from "@/services/api/forecasting";
import { ColumnInfo } from "@/utils/fileParser";
import { supabase } from "@/services/supabase/supabase";

export default function MapColumnsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [columnInfos, setColumnInfos] = useState<ColumnInfo[]>([])
  const datasetId = searchParams.get("datasetId") || ""
  const filePath = searchParams.get("filePath") || ""

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

      // Get user ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not logged in")

      // Step 1 — Single call to FastAPI /initialize endpoint
      const initResponse = await initializeForecast(
        user.id,
        datasetId,
        decodeURIComponent(filePath),
        horizon,
        model,
        mapping,
        columnInfos
      )

      // Step 2 — Go directly to results page with new run_id
      router.push(
        `/dashboard/grow/demand-forecasting/results/${initResponse.run_id}`
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