"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadCard from "./components/UploadCard";
import UploadStatus from "./components/UploadStatus";
import {
  uploadFileToStorageAndSaveDataset,
} from "@/services/api/forecasting";
import { parseFile, ColumnInfo } from "@/utils/fileParser";

// Hardcode sample CSV content to avoid fetch issues
const SAMPLE_CSV_CONTENT = `date,product,units_sold
2026-01-01,Product A,100
2026-01-02,Product A,120
2026-01-03,Product A,90
2026-01-04,Product A,150
2026-01-05,Product A,110
2026-01-01,Product B,80
2026-01-02,Product B,95
2026-01-03,Product B,70
2026-01-04,Product B,110
2026-01-05,Product B,85`;

type Status = "idle" | "loading" | "success" | "error"

export default function UploadPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("idle")
  const [fileName, setFileName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [datasetId, setDatasetId] = useState("")
  const [columns, setColumns] = useState<ColumnInfo[]>([])

  const handleUpload = async (file: File, columnInfos: ColumnInfo[]) => {
    try {
      setFileName(file.name)
      setColumns(columnInfos)
      setStatus("loading")

      // Combined step: create dataset + upload file to storage
      const dataset = await uploadFileToStorageAndSaveDataset(file, columnInfos)

      setDatasetId(dataset.id)
      setStatus("success")

    } catch (error: any) {
      setErrorMessage(error.message || "Upload failed")
      setStatus("error")
    }
  }

  const handleUseSample = async () => {
    try {
      setFileName("sample-forecast-data.csv")
      setStatus("loading")

      // Create Blob and File from hardcoded content
      const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv" })
      const file = new File([blob], "sample-forecast-data.csv", {
        type: "text/csv"
      })

      // Parse sample file
      const columnInfos = await parseFile(file)

      await handleUpload(file, columnInfos)

    } catch (error: any) {
      setErrorMessage(error.message || "Failed to load sample data")
      setStatus("error")
    }
  }

  const handleContinue = () => {
    // Pass columns as JSON string in search params
    const columnsJson = encodeURIComponent(JSON.stringify(columns))
    router.push(`/dashboard/grow/demand-forecasting/map-columns?datasetId=${datasetId}&columns=${columnsJson}`)
  }

  const handleRetry = () => {
    setStatus("idle")
    setErrorMessage("")
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      {status === "idle" && (
        <UploadCard
          onUpload={handleUpload}
          onUseSample={handleUseSample}
        />
      )}
      {status !== "idle" && (
        <UploadStatus
          status={status}
          fileName={fileName}
          errorMessage={errorMessage}
          onContinue={handleContinue}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}