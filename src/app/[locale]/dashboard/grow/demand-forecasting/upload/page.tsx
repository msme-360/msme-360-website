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
const SAMPLE_CSV_CONTENT = `store_id,category,region,unit_price,promo_flag
S001,GROCERIES,NORTH,25.99,1
S001,GROCERIES,NORTH,25.99,0
S001,ELECTRONICS,NORTH,129.99,1
S002,GROCERIES,CENTRAL,22.99,0
S002,CLOTHING,CENTRAL,49.99,1
S003,ELECTRONICS,SOUTH,99.99,0
S003,CLOTHING,SOUTH,59.99,1
S004,GROCERIES,WEST,27.99,0
S004,ELECTRONICS,WEST,119.99,1
S005,CLOTHING,WEST,44.99,0`;

type Status = "idle" | "loading" | "success" | "error"

export default function UploadPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("idle")
  const [fileName, setFileName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [datasetId, setDatasetId] = useState("")
  const [filePath, setFilePath] = useState("")
  const [columns, setColumns] = useState<ColumnInfo[]>([])

  const handleUpload = async (file: File, columnInfos: ColumnInfo[]) => {
    try {
      setFileName(file.name)
      setColumns(columnInfos)
      setStatus("loading")

      // Combined step: create dataset + upload file to storage
      const dataset = await uploadFileToStorageAndSaveDataset(file, columnInfos)

      setDatasetId(dataset.id)
      setFilePath(dataset.file_path)
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

    const res = await fetch("/sample-forecast-data.csv")
    const blob = await res.blob()
    const file = new File([blob], "sample-forecast-data.csv", {
      type: "text/csv"
    })

    // Parse columns
    const columnInfos = await parseFile(file)

    // Upload to storage
    const { id: datasetId, file_path: filePath } =
      await uploadFileToStorageAndSaveDataset(file, columnInfos)

    const columnsParam = encodeURIComponent(
      JSON.stringify(columnInfos)
    )

    setStatus("success")

    // Pass isSample=true in URL ← key change
    router.push(
      `/dashboard/grow/demand-forecasting/map-columns?datasetId=${datasetId}&filePath=${encodeURIComponent(filePath)}&columns=${columnsParam}&isSample=true`
    )

  } catch (error: any) {
    setErrorMessage(error.message || "Failed to load sample")
    setStatus("error")
  }
}

  const handleContinue = () => {
    // Pass columns as JSON string in search params
    const columnsJson = encodeURIComponent(JSON.stringify(columns))
    const filePathJson = encodeURIComponent(filePath)
    router.push(`/dashboard/grow/demand-forecasting/map-columns?datasetId=${datasetId}&filePath=${filePathJson}&columns=${columnsJson}`)
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