"use client";

import { useState } from "react";
import UploadCard from "./components/UploadCard";
import UploadStatus from "./components/UploadStatus";

export default function UploadPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [fileName, setFileName] = useState("")

  const handleUpload = (file: File) => {
    setFileName(file.name)
    setStatus("loading")
    // simulate upload for now
    setTimeout(() => setStatus("success"), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      {status === "idle" && (
        <UploadCard onUpload={handleUpload} />
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