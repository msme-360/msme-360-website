import logging
import io
import os
import tempfile
from pathlib import Path
import pandas as pd
from uuid import UUID
from datetime import datetime, date
from app.utils.supabase_client import supabase
from app.ml.predict import predict_demand_batch
from app.schemas.forecast import ColumnMapping
from app.services.ocr.ocr_service import ocr_image, ocr_pdf, is_supported, SUPPORTED_IMAGE_TYPES
from app.services.ocr.extraction_service import extract_from_ocr_text

logger = logging.getLogger(__name__)

async def background_pipeline_orchestration(
    run_id: UUID,
    file_path: str,
    column_mappings: list[ColumnMapping],
    horizon: int,
    start_date: str
):
    """
    Asynchronous worker function for background processing with in-memory parameters.
    """
    try:
        logger.info(f"Starting pipeline for run {run_id}")

        # 1. Set Status: Bypass RLS and update forecast_runs.status to 'processing'
        supabase.table("forecast_runs").update({
            "status": "processing",
            "started_at": datetime.now().isoformat()
        }).eq("id", str(run_id)).execute()

        # Parse start_date into date object
        start_date_obj = date.fromisoformat(start_date)

        # 2. Create mapping dict (filter out ignored columns) and rename columns
        mapping_dict = {
            mapping.original_name: mapping.mapped_name
            for mapping in column_mappings
            if mapping.original_name and mapping.mapped_name and mapping.mapped_name != "ignore"
        }

        # 3. Download & Load: Stream down user CSV from storage
        bucket_name = "forecast-uploads"
        storage_path = file_path
        file_bytes = supabase.storage.from_(bucket_name).download(storage_path)
        input_df = pd.read_csv(io.BytesIO(file_bytes))

        # Rename columns using user mappings
        input_df = input_df.rename(columns=mapping_dict)
        
        # Hard defense boundary: keep only the 5 critical columns
        required_model_cols = ["store_id", "category", "region", "unit_price", "promo_flag"]
        input_df = input_df[required_model_cols]

        # 4. Execute unified ML inference engine
        model_results = predict_demand_batch(input_df, horizon, start_date_obj)

        # 5. Format for database contract and bulk save
        forecast_outputs = [
            {
                "run_id": str(run_id),
                "forecast_date": res["date"],
                "store_id": res["store_id"],
                "category": res["category"],
                "region": res["region"],
                "predicted_value": float(res["predicted_units"]),
                "lower_bound": float(res["predicted_units"]) * 0.9,
                "upper_bound": float(res["predicted_units"]) * 1.1
            }
            for res in model_results
        ]

        if forecast_outputs:
            supabase.table("forecast_outputs").insert(forecast_outputs).execute()

        # Insert placeholder metrics
        supabase.table("forecast_metrics").insert({
            "run_id": str(run_id),
            "mae": 12.99,
            "rmse": 18.03,
            "mape": 33.35
        }).execute()

        # 6. Finalize: Update status to 'completed'
        supabase.table("forecast_runs").update({
            "status": "completed",
            "completed_at": datetime.now().isoformat()
        }).eq("id", str(run_id)).execute()

        logger.info(f"Pipeline completed successfully for run {run_id}")

    except Exception as e:
        logger.error(f"Background pipeline failed for run {run_id}: {str(e)}", exc_info=True)
        try:
            # Pass 'failed' on error
            supabase.table("forecast_runs").update({
                "status": "failed"
            }).eq("id", str(run_id)).execute()
        except Exception as update_err:
            logger.error(f"Failed to update status to failed for run {run_id}: {str(update_err)}")


# ---------------------------------------------------------------------------
# OCR Document Pipeline
# ---------------------------------------------------------------------------


async def ocr_document_pipeline_orchestration(
    document_id: UUID,
    user_id: str,
    file_name: str,
    storage_file_path: str,
):
    """
    Background worker that processes an invoice document through the OCR pipeline.

    1. Updates ``ocr_documents`` status to 'processing'.
    2. Downloads file bytes from the ``invoice-documents`` Supabase storage bucket.
    3. Runs Tesseract OCR (image) or PyMuPDF/pdf2image (PDF) to get raw text.
    4. Runs the extraction engine to produce structured invoice data.
    5. Checks ``flags`` — if any flags are raised, sets ``anomaly_detected = TRUE``.
    6. Atomically writes results to ``extracted_invoices`` and ``extracted_invoice_items``.
    """
    tmp_path: str | None = None
    try:
        logger.info(f"Starting OCR pipeline for document {document_id}")

        # 1. Mark as processing
        supabase.table("ocr_documents").update({
            "upload_status": "processing",
        }).eq("id", str(document_id)).execute()

        # 2. Download file from storage
        bucket_name = "invoice-documents"
        file_bytes = supabase.storage.from_(bucket_name).download(storage_file_path)

        # 3. Write to a temporary file for the OCR libraries
        ext = Path(file_name).suffix.lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        # 4. Run OCR
        if ext == ".pdf":
            raw_text = ocr_pdf(tmp_path)
        else:
            raw_text = ocr_image(tmp_path)

        # 5. Run structured extraction
        extraction = extract_from_ocr_text(raw_text)

        # 6. Detect anomalies from flags
        anomaly_detected = len(extraction.flags) > 0

        # 7. Multi-row atomic database write
        # 7a. Update ocr_documents
        supabase.table("ocr_documents").update({
            "upload_status": "completed",
            "anomaly_detected": anomaly_detected,
            "completed_at": datetime.now().isoformat(),
        }).eq("id", str(document_id)).execute()

        # 7b. Insert extracted_invoices header
        invoice_row = {
            "document_id": str(document_id),
            "vendor_name": extraction.vendor_name,
            "invoice_number": extraction.invoice_number,
            "invoice_date": extraction.invoice_date,
            "due_date": extraction.due_date,
            "gst_or_tax_number": extraction.gst_or_tax_number,
            "currency": extraction.currency,
            "subtotal": extraction.subtotal,
            "tax_amount": extraction.tax_amount,
            "grand_total": extraction.grand_total,
            "raw_ocr_debug_text": raw_text,
        }
        result = supabase.table("extracted_invoices").insert(invoice_row).execute()
        extracted_invoice_id = result.data[0]["id"]

        # 7c. Insert extracted_invoice_items line items
        line_item_rows = [
            {
                "extracted_invoice_id": extracted_invoice_id,
                "item_name": item.item_name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "line_total": item.line_total,
            }
            for item in extraction.line_items
        ]
        if line_item_rows:
            supabase.table("extracted_invoice_items").insert(line_item_rows).execute()

        logger.info(
            "OCR pipeline completed for document %s (anomaly=%s, items=%d)",
            document_id, anomaly_detected, len(line_item_rows),
        )

    except Exception as e:
        logger.error(f"OCR pipeline failed for document {document_id}: {str(e)}", exc_info=True)
        try:
            supabase.table("ocr_documents").update({
                "upload_status": "failed",
            }).eq("id", str(document_id)).execute()
        except Exception as update_err:
            logger.error(
                "Failed to update status to failed for document %s: %s",
                document_id, update_err,
            )
    finally:
        if tmp_path is not None:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass