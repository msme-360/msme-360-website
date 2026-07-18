"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/services/supabase/supabase";
import InvoicePreview from "./components/InvoicePreview";
import ExtractedFields from "./components/ExtractedFields";
import LineItemsTable from "./components/LineItemsTable";
import { Loader2 } from "lucide-react";

export default function ReviewPage() {
  const { documentId } = useParams()
  const [status, setStatus] = useState("pending")
  const [document, setDocument] = useState<any>(null)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [lineItems, setLineItems] = useState<any[]>([])
  const [fileUrl, setFileUrl] = useState("")
  const [error, setError] = useState(false)
  const [timeoutError, setTimeoutError] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const statusRef = useRef(status)
  statusRef.current = status

  useEffect(() => {
    if (!documentId) return

    // Initial fetch
    const fetchInitialState = async () => {
      try {
        const { data: doc } = await supabase
          .from("ocr_documents")
          .select("*")
          .eq("id", documentId as string)
          .single()

        if (doc) {
          setDocument(doc)
          setStatus(doc.status)

          // Get file URL
          const { data: urlData } = supabase.storage
            .from("invoice-documents")
            .getPublicUrl(doc.file_path)
          setFileUrl(urlData.publicUrl)

          if (doc.status === "completed" ||
              doc.status === "review_needed") {
            await fetchResults()
          }

          if (doc.status === "failed") {
            setError(true)
          }
        }
      } catch (err) {
        console.error("Error:", err)
      }
    }

    fetchInitialState()

    // Polling
    const pollingIntervalMs = 5000
    const maxPollingDurationMs = 300000
    const pollStartTime = Date.now()

    const intervalId = setInterval(async () => {
      if (Date.now() - pollStartTime > maxPollingDurationMs) {
        clearInterval(intervalId)
        setTimeoutError(true)
        return
      }

      try {
        const { data: doc } = await supabase
          .from("ocr_documents")
          .select("*")
          .eq("id", documentId as string)
          .single()

        if (!doc) return

        const newStatus = doc.status
        if (newStatus !== statusRef.current) {
          setStatus(newStatus)

          if (newStatus === "completed" ||
              newStatus === "review_needed") {
            clearInterval(intervalId)
            await fetchResults()
          }

          if (newStatus === "failed") {
            clearInterval(intervalId)
            setError(true)
          }
        }
      } catch (err) {
        console.error("Polling error:", err)
      }
    }, pollingIntervalMs)

    return () => clearInterval(intervalId)
  }, [documentId])

  const fetchResults = async () => {
    const { data: extracted } = await supabase
      .from("extracted_documents")
      .select("*")
      .eq("document_id", documentId as string)
      .single()

    if (extracted) {
      setExtractedData(extracted)

      const { data: items } = await supabase
        .from("extracted_line_items")
        .select("*")
        .eq("extracted_document_id", extracted.id)

      setLineItems(items ?? [])
    }
  }

  const handleFieldSave = async (field: string, value: string) => {
    await supabase
      .from("extracted_documents")
      .update({ [field]: value })
      .eq("document_id", documentId as string)
  }

  const handleItemUpdate = async (
    id: string,
    field: string,
    value: string
  ) => {
    await supabase
      .from("extracted_line_items")
      .update({ [field]: value })
      .eq("id", id)
  }

  const handleItemDelete = async (id: string) => {
    await supabase
      .from("extracted_line_items")
      .delete()
      .eq("id", id)
    setLineItems(prev => prev.filter(item => item.id !== id))
  }

  const handleVerify = async () => {
    try {
      setIsVerifying(true)
      await supabase
        .from("ocr_documents")
        .update({ status: "completed" })
        .eq("id", documentId as string)

      await supabase
        .from("extracted_documents")
        .update({ review_status: "approved" })
        .eq("document_id", documentId as string)

    } catch (error: any) {
      console.error("Verify failed:", error.message)
    } finally {
      setIsVerifying(false)
    }
  }

  // Timeout State
  if (timeoutError) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-lg font-black uppercase tracking-widest text-orange-400">
          Processing Timed Out
        </p>
        <p className="text-xs text-muted-foreground font-bold">
          The OCR job took too long. Please try again.
        </p>
      </div>
    )
  }

  // Loading State
  if (status === "pending" || status === "processing") {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 flex flex-col items-center gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-center space-y-2">
          <p className="text-lg font-black uppercase tracking-widest">
            🤖 Extracting invoice data...
          </p>
          <p className="text-xs text-muted-foreground font-bold">
            This may take a few moments
          </p>
        </div>
        <div className="w-full space-y-2 mt-4">
          {[
            "Preprocessing image",
            "Running OCR engine",
            "Parsing invoice fields",
            "Validating extracted data"
          ].map((step) => (
            <div
              key={step}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <Loader2 className="w-3 h-3 text-primary animate-spin" />
              <p className="text-xs font-black uppercase tracking-widest opacity-60">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error State
  if (error || status === "failed") {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-lg font-black uppercase tracking-widest text-red-400">
          OCR Processing Failed
        </p>
        <p className="text-xs text-muted-foreground font-bold">
          Something went wrong. Please try again.
        </p>
      </div>
    )
  }

  // Review State — Split Screen
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight">
          Review Invoice
        </h1>
        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
          Verify extracted data and correct if needed
        </p>
      </div>

      {/* Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — Invoice Preview */}
        {fileUrl && document && (
          <InvoicePreview
            fileUrl={fileUrl}
            fileName={document.file_name}
            mimeType={document.mime_type}
          />
        )}

        {/* Right — Extracted Fields */}
        {extractedData && (
          <ExtractedFields
            data={extractedData}
            onFieldSave={handleFieldSave}
            onVerify={handleVerify}
            isVerifying={isVerifying}
          />
        )}

      </div>

      {/* Line Items Table */}
      <LineItemsTable
        items={lineItems}
        onItemUpdate={handleItemUpdate}
        onItemDelete={handleItemDelete}
      />

    </div>
  )
}