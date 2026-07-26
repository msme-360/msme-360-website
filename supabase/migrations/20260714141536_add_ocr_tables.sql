BEGIN;

-- 1. Master OCR Document Pipeline State Logs
CREATE TABLE IF NOT EXISTS public.ocr_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    storage_file_path TEXT NOT NULL,
    upload_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    anomaly_detected BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 2. Structured Header Metadata Targets (The Master Entry)
CREATE TABLE IF NOT EXISTS public.extracted_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.ocr_documents(id) ON DELETE CASCADE,
    vendor_name TEXT,
    invoice_number TEXT,
    invoice_date DATE,
    due_date DATE,
    gst_or_tax_number TEXT,
    currency TEXT DEFAULT 'INR',
    subtotal NUMERIC(12, 2) DEFAULT 0.00,
    tax_amount NUMERIC(12, 2) DEFAULT 0.00,
    grand_total NUMERIC(12, 2) DEFAULT 0.00,
    raw_ocr_debug_text TEXT
);

-- 3. Document Tabular Line Items Grid Records (The Array Target)
CREATE TABLE IF NOT EXISTS public.extracted_invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    extracted_invoice_id UUID NOT NULL REFERENCES public.extracted_invoices(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    quantity NUMERIC(10, 2) DEFAULT 1.00,
    unit_price NUMERIC(12, 2) DEFAULT 0.00,
    line_total NUMERIC(12, 2) DEFAULT 0.00
);

-- 4. High-Performance Monitoring Indexes
CREATE INDEX IF NOT EXISTS idx_ocr_docs_status ON public.ocr_documents(user_id, upload_status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_join ON public.extracted_invoice_items(extracted_invoice_id);

COMMIT;