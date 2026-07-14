"""OCR service — wraps pytesseract to extract raw text from images / PDFs."""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Optional

import pytesseract
from PIL import Image

from app.config import settings

logger = logging.getLogger(__name__)


def _configure_tesseract() -> None:
    """Point pytesseract at a custom binary path if provided in settings."""
    if settings.tesseract_cmd:
        pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd


_configure_tesseract()


SUPPORTED_IMAGE_TYPES = {".png", ".jpg", ".jpeg", ".tiff", ".tif", ".bmp", ".webp"}
SUPPORTED_DOC_TYPES = {".pdf"}


def is_supported(filename: str) -> bool:
    """Check whether the filename has a supported extension."""
    ext = Path(filename).suffix.lower()
    return ext in SUPPORTED_IMAGE_TYPES | SUPPORTED_DOC_TYPES


def ocr_image(image_path: str | Path, lang: Optional[str] = None) -> str:
    """Run Tesseract OCR on a single image and return the raw text.

    Args:
        image_path: Path to the image file.
        lang: Optional language string (e.g. 'eng', 'eng+hin'), defaults to
              ``settings.tesseract_lang``.

    Returns:
        Extracted raw text.
    """
    lang = lang or settings.tesseract_lang
    logger.info("OCR on %s (lang=%s)", image_path, lang)
    try:
        img = Image.open(image_path)
        text: str = pytesseract.image_to_string(img, lang=lang)
        return text.strip()
    except Exception:
        logger.exception("OCR failed for %s", image_path)
        raise


async def ocr_image_async(image_path: str | Path, lang: Optional[str] = None) -> str:
    """Async wrapper around :func:`ocr_image` (runs Tesseract in a thread pool)."""
    import asyncio
    return await asyncio.to_thread(ocr_image, image_path, lang)


def _extract_pdf_text_direct(pdf_path: str | Path) -> Optional[str]:
    """Extract text from a PDF directly using PyMuPDF (no Poppler needed).

    Works for text-based PDFs (most digital invoices). For scanned PDFs
    (image-only), returns None so the caller can fall back to OCR.

    Returns:
        Concatenated text from all pages, or None if extraction fails.
    """
    try:
        import fitz  # PyMuPDF
    except ImportError:
        logger.debug("PyMuPDF not available, skipping direct PDF text extraction")
        return None

    with fitz.open(str(pdf_path)) as doc:
        parts: list[str] = []
        for page_num in range(doc.page_count):
            page = doc[page_num]
            text = page.get_text().strip()
            if text:
                parts.append(text)

        if not parts:
            logger.info("PyMuPDF found no text in %s (likely a scanned PDF)", pdf_path)
            return None

        combined = "\n\n--- PAGE {} ---\n\n".format(len(parts)).join(parts).strip()
        logger.info(
            "Extracted %d chars from %d pages via PyMuPDF",
            len(combined), doc.page_count,
        )
        return combined


def ocr_pdf(pdf_path: str | Path, lang: Optional[str] = None, dpi: int = 200) -> str:
    """Extract text from a PDF.

    Strategy:
      1. Try PyMuPDF (direct text extraction — no Poppler needed, works
         for text-based PDFs).
      2. Fall back to pdf2image + Tesseract OCR if the PDF is scanned or
         PyMuPDF is unavailable.

    Args:
        pdf_path: Path to the PDF file.
        lang: Optional language string for Tesseract.
        dpi: DPI for rendering PDF pages (only used by pdf2image fallback).

    Returns:
        Concatenated raw text from all pages.
    """
    lang = lang or settings.tesseract_lang
    logger.info("OCR on PDF %s (lang=%s, dpi=%d)", pdf_path, lang, dpi)

    # Step 1: Try PyMuPDF for direct text extraction
    text = _extract_pdf_text_direct(pdf_path)
    if text:
        return text

    # Step 2: Fall back to pdf2image + Tesseract OCR for scanned PDFs
    try:
        from pdf2image import convert_from_path
    except ImportError:
        raise RuntimeError(
            "Cannot extract text from this PDF. Either:\n"
            "1. It's a text-based PDF — install PyMuPDF: pip install pymupdf\n"
            "2. It's a scanned PDF — install poppler + pdf2image:\n"
            "   - Download poppler from: https://github.com/oschwartz10612/poppler-windows/releases\n"
            "   - Add 'Library/bin' to your PATH\n"
            "   - Then: pip install pdf2image"
        )

    try:
        pages = convert_from_path(str(pdf_path), dpi=dpi)
    except Exception:
        logger.exception("Failed to convert PDF to images: %s", pdf_path)
        raise RuntimeError(
            "PDF conversion failed. For scanned PDFs, poppler must be installed.\n"
            "See: https://github.com/oschwartz10612/poppler-windows/releases"
        )

    all_text_parts: list[str] = []
    for i, page_img in enumerate(pages, start=1):
        logger.debug("OCR PDF page %d/%d", i, len(pages))
        text = pytesseract.image_to_string(page_img, lang=lang)
        all_text_parts.append(text.strip())

    return "\n\n--- PAGE {} ---\n\n".format(len(pages)).join(all_text_parts).strip()
