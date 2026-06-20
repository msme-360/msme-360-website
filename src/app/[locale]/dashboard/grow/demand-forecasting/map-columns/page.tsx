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
  const isSample = searchParams.get("isSample") === "true"

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
    horizon: number,
    startDate: string
  ) => {
    try {
      setIsLoading(true)

      // Sample data → skip ML → show sample results
      if (isSample) {
        router.push(
          `/dashboard/grow/demand-forecasting/results/sample`
        )
        return
      }

      // Real data → call ML service
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not logged in")

      const initResponse = await initializeForecast(
        user.id,
        datasetId,
        decodeURIComponent(filePath),
        horizon,
        "prophet",
        mapping,
        columnInfos,
        startDate
      )

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
        isSample={isSample}
      />
    </div>
  )
}