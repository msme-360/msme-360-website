"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RunHistory from "./components/RunHistory";
import { getHistory } from "@/services/api/forecasting";
import { ForecastRun } from "@/types/forecasting";

export default function HistoryPage() {
  const router = useRouter()
  const [runs, setRuns] = useState<ForecastRun[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      const data = await getHistory()
      setRuns(data ?? [])
    } catch (error: any) {
      console.error("Error fetching history:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleViewResults = (runId: string) => {
    router.push(
      `/dashboard/grow/demand-forecasting/results/${runId}`
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <RunHistory
        runs={runs}
        isLoading={isLoading}
        onRefresh={fetchHistory}
        onViewResults={handleViewResults}
      />
    </div>
  )
}