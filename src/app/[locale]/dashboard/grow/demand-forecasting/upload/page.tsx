"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadCard from "./components/UploadCard";
import UploadStatus from "./components/UploadStatus";
import {
  uploadFileToStorage,
  saveDataset,
  saveColumnMapping,
  createForecastRun,
  triggerMLService
} from "@/services/api/forecasting";

type Status = "idle" | "loading" | "success" | "error"

export default function UploadPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("idle")
  const [fileName, setFileName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleUpload = async (file: File) => {
    try {
      setFileName(file.name)
      setStatus("loading")

      // Step 1 — Upload file to Supabase Storage
      const filePath = await uploadFileToStorage(file)

      // Step 2 — Save dataset record
      const dataset = await saveDataset(
        file.name,
        filePath,
        0 // row count — ML will update this
      )

      // Step 3 — Save to localStorage for map-columns page
      localStorage.setItem("datasetId", dataset.id)
      localStorage.setItem("filePath", filePath)
      localStorage.setItem("fileName", file.name)

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

      await handleUpload(file)

    } catch (error: any) {
      setErrorMessage(error.message || "Failed to load sample data")
      setStatus("error")
    }
  }

  const handleContinue = () => {
    router.push("/dashboard/grow/demand-forecasting/map-columns")
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