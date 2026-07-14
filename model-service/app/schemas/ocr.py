from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Optional


class LineItem(BaseModel):
    """A single line item from an invoice."""

    item_name: str = ""
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    tax_percent: Optional[float] = None
    line_total: Optional[float] = None


class ConfidenceScores(BaseModel):
    """Confidence scores for key extracted fields (0.0 – 1.0)."""

    vendor_name: float = 0.0
    invoice_number: float = 0.0
    invoice_date: float = 0.0
    grand_total: float = 0.0
    overall: float = 0.0


class ExtractionResult(BaseModel):
    """Structured data extracted from an invoice OCR text."""

    vendor_name: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = Field(
        None, description="Normalised as YYYY-MM-DD"
    )
    due_date: Optional[str] = Field(None, description="Normalised as YYYY-MM-DD")
    gst_or_tax_number: Optional[str] = None
    currency: Optional[str] = Field(None, description="ISO code e.g. INR, USD")
    subtotal: Optional[float] = None
    tax_amount: Optional[float] = None
    discount: Optional[float] = None
    grand_total: Optional[float] = None
    line_items: list[LineItem] = Field(default_factory=list)
    confidence: ConfidenceScores = Field(default_factory=ConfidenceScores)
    flags: list[str] = Field(default_factory=list)


class OCRRawResult(BaseModel):
    """Response returned after Tesseract has processed an image."""

    filename: str
    content_type: str
    raw_text: str
    page_count: int = 1


class OcrInitializePayload(BaseModel):
    """Payload for initializing an OCR document processing job."""

    user_id: str
    file_name: str
    storage_file_path: str


class OcrInitializeResponse(BaseModel):
    """Response returned immediately after OCR job is queued."""

    document_id: str
    status: str = "pending"
    message: str = "OCR job queued successfully"
