import { supabase } from '@/services/supabase/supabase'

// Step 1 — Upload file to Supabase Storage
export async function uploadInvoiceToStorage(
  file: File,
  userId: string,
  documentId: string
) {
  const storagePath = `user_${userId}/document_${documentId}`

  const { error } = await supabase.storage
    .from("invoice-documents")
    .upload(storagePath, file, { upsert: true })

  if (error) throw error
  return storagePath
}

// Step 2 — Call Python OCR service
export async function initializeOCR(
  userId: string,
  documentId: string,
  filePath: string,
  fileName: string,
  mimeType: string
) {
  const res = await fetch(
    "http://localhost:8000/api/v1/ocr/initialize",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        document_id: documentId,
        file_path: filePath,
        file_name: fileName,
        mime_type: mimeType
      })
    }
  )

  if (!res.ok) throw new Error("OCR service failed")
  return res.json()
}

// Step 3 — Poll document status
export async function getDocumentStatus(documentId: string) {
  const { data, error } = await supabase
    .from("ocr_documents")
    .select("status")
    .eq("id", documentId)
    .single()

  if (error) throw error
  return data.status
}

// Step 4 — Get extracted results
export async function getExtractedResults(documentId: string) {
  const { data: extracted } = await supabase
    .from("extracted_documents")
    .select("*")
    .eq("document_id", documentId)
    .single()

  const { data: lineItems } = await supabase
    .from("extracted_line_items")
    .select("*")
    .eq("extracted_document_id", extracted?.id)

  return { extracted, lineItems }
}

// Step 5 — Update single field
export async function updateExtractedField(
  documentId: string,
  field: string,
  value: string
) {
  const { error } = await supabase
    .from("extracted_documents")
    .update({ [field]: value })
    .eq("document_id", documentId)

  if (error) throw error
}

// Step 6 — Update line item
export async function updateLineItem(
  itemId: string,
  field: string,
  value: string
) {
  const { error } = await supabase
    .from("extracted_line_items")
    .update({ [field]: value })
    .eq("id", itemId)

  if (error) throw error
}

// Step 7 — Delete line item
export async function deleteLineItem(itemId: string) {
  const { error } = await supabase
    .from("extracted_line_items")
    .delete()
    .eq("id", itemId)

  if (error) throw error
}

// Step 8 — Verify and save
export async function verifyDocument(documentId: string) {
  await supabase
    .from("ocr_documents")
    .update({ status: "completed" })
    .eq("id", documentId)

  await supabase
    .from("extracted_documents")
    .update({ review_status: "approved" })
    .eq("document_id", documentId)
}

// Step 9 — Export document
export async function exportDocument(
  documentId: string,
  format: "csv" | "json"
) {
  const { extracted, lineItems } = await getExtractedResults(documentId)

  if (format === "json") {
    const data = { ...extracted, line_items: lineItems }
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${documentId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (format === "csv") {
    const headers = [
      "vendor_name",
      "invoice_number",
      "invoice_date",
      "subtotal",
      "tax_amount",
      "total_amount"
    ].join(",")

    const row = [
      extracted?.vendor_name,
      extracted?.invoice_number,
      extracted?.invoice_date,
      extracted?.subtotal,
      extracted?.tax_amount,
      extracted?.total_amount
    ].join(",")

    const csv = [headers, row].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${documentId}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
}

// Step 10 — Get history
export async function getDocumentHistory() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  const { data, error } = await supabase
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

  if (error) throw error
  return data
}