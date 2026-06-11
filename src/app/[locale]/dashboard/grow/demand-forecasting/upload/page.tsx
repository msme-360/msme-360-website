"use client";

import { useState } from "react";
import UploadCard from "./components/UploadCard";
import UploadStatus from "./components/UploadStatus";

type UploadStatus = "idle" | "loading" | "success" | "error"

export default function UploadPage() {
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [fileName, setFileName] = useState("")

  const handleUpload = (file: File) => {
    setFileName(file.name)
    setStatus("loading")
    setTimeout(() => setStatus("success"), 2000)
  }

  const handleUseSample = () => {
    setFileName("sample-forecast-data.csv")
    setStatus("success")
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
          onContinue={() => alert("Go to map columns!")}
          onRetry={() => setStatus("idle")}
        />
      )}
    </div>
  )
}