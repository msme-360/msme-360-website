"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadCard from "./components/UploadCard";
import UploadStatus from "./components/UploadStatus";
import {
  uploadFileToStorageAndSaveDataset,
} from "@/services/api/forecasting";
import { parseFile, ColumnInfo } from "@/utils/fileParser";

// Hardcoded sample CSV — no fetch needed -due to proxy
const SAMPLE_CSV_CONTENT = `date,store_id,category,region,unit_price,promo_flag
2026-01-01,S001,GROCERIES,NORTH,25.99,1
2026-01-02,S001,GROCERIES,NORTH,25.99,0
2026-01-03,S001,ELECTRONICS,NORTH,129.99,1
2026-01-04,S002,GROCERIES,CENTRAL,22.99,0
2026-01-05,S002,CLOTHING,CENTRAL,49.99,1
2026-01-06,S003,ELECTRONICS,SOUTH,99.99,0
2026-01-07,S003,CLOTHING,SOUTH,59.99,1
2026-01-08,S004,GROCERIES,WEST,27.99,0
2026-01-09,S004,ELECTRONICS,WEST,119.99,1
2026-01-10,S005,CLOTHING,WEST,44.99,0`

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

      const dataset = await uploadFileToStorageAndSaveDataset(
        file,
        columnInfos
      )

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

      // Use hardcoded content — NO fetch! ✅
      const blob = new Blob([SAMPLE_CSV_CONTENT], {
        type: "text/csv"
      })
      const file = new File(
        [blob],
        "sample-forecast-data.csv",
        { type: "text/csv" }
      )

      // Parse columns from file
      const columnInfos = await parseFile(file)

      // Upload to Supabase storage
      const { id: datasetId, file_path: filePath } =
        await uploadFileToStorageAndSaveDataset(file, columnInfos)

      const columnsParam = encodeURIComponent(
        JSON.stringify(columnInfos)
      )

      setStatus("success")

      // Navigate to map-columns with isSample=true
      router.push(
        `/dashboard/grow/demand-forecasting/map-columns?datasetId=${datasetId}&filePath=${encodeURIComponent(filePath)}&columns=${columnsParam}&isSample=true`
      )

    } catch (error: any) {
      setErrorMessage(error.message || "Failed to load sample")
      setStatus("error")
    }
  }

  const handleContinue = () => {
    const columnsJson = encodeURIComponent(JSON.stringify(columns))
    const filePathJson = encodeURIComponent(filePath)
    router.push(
      `/dashboard/grow/demand-forecasting/map-columns?datasetId=${datasetId}&filePath=${filePathJson}&columns=${columnsJson}`
    )
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