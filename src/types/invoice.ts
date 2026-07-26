export type DocumentStatus =
  | "pending"
  | "processing"
  | "review_needed"
  | "completed"
  | "failed"

export type ReviewStatus =
  | "review_needed"
  | "approved"
  | "rejected"

export interface OcrDocument {
  id: string
  user_id: string
  file_name: string
  file_path: string
  mime_type: string
  status: DocumentStatus
  created_at: string
}

export interface DocumentOcrText {
  id: string
  document_id: string
  page_number: number
  raw_text: string
}

export interface ExtractedDocument {
  id: string
  document_id: string
  vendor_name: string
  invoice_number: string
  invoice_date: string
  due_date: string | null
  subtotal: number
  tax_amount: number
  total_amount: number
  currency: string
  confidence_score: number
  review_status: ReviewStatus
  validation_flag: string
  confidence: {
    vendor_name: number
    invoice_number: number
    invoice_date: number
    due_date: number
    subtotal: number
    tax_amount: number
    total_amount: number
  }
}

export interface ExtractedLineItem {
  id: string
  extracted_document_id: string
  item_name: string
  quantity: number
  unit_price: number
  tax_percent: number
  line_total: number
}

export interface DocumentAuditLog {
  id: string
  document_id: string
  event_type: string
  event_payload: Record<string, any>
  created_at: string
}