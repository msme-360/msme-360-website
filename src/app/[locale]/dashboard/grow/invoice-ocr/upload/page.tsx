"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadCard from "./components/UploadCard";
import UploadStatus from "./components/UploadStatus";
import { supabase } from "@/services/supabase/supabase";

type Status = "idle" | "loading" | "success" | "error"

export default function UploadPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("idle")
  const [fileName, setFileName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [documentId, setDocumentId] = useState("")

  const handleUpload = async (file: File) => {
    try {
      setFileName(file.name)
      setStatus("loading")

      // Get logged in user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not logged in")

      // Step 1 — Generate document ID
      const docId = crypto.randomUUID()

      // Step 2 — Upload to Supabase Storage
      const storagePath = `user_${user.id}/document_${docId}`
      const { error: storageError } = await supabase.storage
        .from("invoice-documents")
        .upload(storagePath, file, { upsert: true })

      if (storageError) throw storageError

      // Step 3 — Call Python OCR service
      const res = await fetch(
        `http://localhost:8000/api/v1/ocr/initialize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            document_id: docId,
            file_path: storagePath,
            file_name: file.name,
            mime_type: file.type
          })
        }
      )

      if (!res.ok) throw new Error("OCR service failed")

      setDocumentId(docId)
      setStatus("success")

    } catch (error: any) {
      setErrorMessage(error.message || "Upload failed")
      setStatus("error")
    }
  }

  const handleContinue = () => {
    router.push(
      `/dashboard/grow/invoice-ocr/review/${documentId}`
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
          isLoading={false}
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