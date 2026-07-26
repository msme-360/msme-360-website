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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const datasetId = searchParams.get("datasetId") || ""
  const filePath = searchParams.get("filePath") || ""
  const fileName = searchParams.get("fileName") || ""
  const isSample = searchParams.get("isSample") === "true"

  useEffect(() => {
    // Reset state when search params change
    setIsLoading(false)
    setErrorMessage(null)
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
      setErrorMessage(null)

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
        decodeURIComponent(fileName),
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
      setErrorMessage(error.message || "Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-4">
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <div className="text-2xl">⚠️</div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-red-400 mb-1">
              Error Occurred
            </h3>
            <p className="text-xs font-bold text-red-300/80">
              {errorMessage}
            </p>
          </div>
        </div>
      )}
      <ColumnMapper
        csvColumns={columnInfos.map(col => col.name)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
        isSample={isSample}
      />
    </div>
  )
}