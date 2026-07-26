from fastapi import APIRouter, BackgroundTasks
from uuid import uuid4
from app.schemas.ocr import OcrInitializePayload, OcrInitializeResponse
from app.services.background import ocr_document_pipeline_orchestration
from app.utils.supabase_client import supabase
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ocr")


@router.post("/initialize", response_model=OcrInitializeResponse, status_code=202)
async def initialize_ocr(
    payload: OcrInitializePayload,
    background_tasks: BackgroundTasks,
):
    """
    Queue an invoice document for OCR processing.

    Accepts a reference to a file in the `invoice-documents` storage bucket,
    inserts a pending record into `ocr_documents`, and spawns a background
    worker that downloads, OCRs, extracts, and persists the structured data.
    """
    try:
        document_id = uuid4()

        supabase.table("ocr_documents").insert({
            "id": str(document_id),
            "user_id": payload.user_id,
            "file_name": payload.file_name,
            "storage_file_path": payload.storage_file_path,
            "upload_status": "pending",
        }).execute()

        background_tasks.add_task(
            ocr_document_pipeline_orchestration,
            document_id,
            payload.user_id,
            payload.file_name,
            payload.storage_file_path,
        )

        return OcrInitializeResponse(
            document_id=str(document_id),
            status="pending",
            message="OCR job queued successfully",
        )

    except Exception as e:
        logger.error(f"Failed to initialize OCR job: {str(e)}")
        raise
