"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadCard from "./components/UploadCard";
import UploadStatus from "./components/UploadStatus";
import {
  uploadFileToStorageAndSaveDataset,
} from "@/services/api/forecasting";
import { ColumnInfo } from "@/utils/fileParser";

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

      // Fetch sample file from public folder
      const res = await fetch("/sample-forecast-data.csv")
      const blob = await res.blob()
      const file = new File([blob], "sample-forecast-data.csv", {
        type: "text/csv"
      })

      // Parse sample file
      const { parseFile } = await import("@/utils/fileParser")
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