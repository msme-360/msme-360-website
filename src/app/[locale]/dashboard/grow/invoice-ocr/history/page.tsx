"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DocumentHistory from "./components/DocumentHistory";
import { supabase } from "@/services/supabase/supabase";

export default function HistoryPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get documents with extracted data joined
      const { data: docs } = await supabase
        .from("ocr_documents")
        .select(`
          *,
          extracted_documents (
            vendor_name,
            total_amount
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      // Flatten extracted data
      const formatted = docs?.map(doc => ({
        ...doc,
        vendor_name: doc.extracted_documents?.[0]?.vendor_name,
        total_amount: doc.extracted_documents?.[0]?.total_amount
      })) ?? []

      setDocuments(formatted)

    } catch (error: any) {
      console.error("Error fetching documents:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleView = (documentId: string) => {
    router.push(
      `/dashboard/grow/invoice-ocr/review/${documentId}`
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <DocumentHistory
        documents={documents}
        isLoading={isLoading}
        onRefresh={fetchDocuments}
        onView={handleView}
      />
    </div>
  )
}