"""Extraction engine — extracts structured invoice data from raw OCR text
using regex-based field matching."""

from __future__ import annotations

import logging
import re
from typing import Optional

from app.schemas.ocr import (
    ConfidenceScores,
    ExtractionResult,
    LineItem,
)

logger = logging.getLogger(__name__)

# Currency symbols for amount parsing
_CURRENCY_SYMBOLS = "\u20b9$\u20ac\u00a3\u00a5"  # ₹, $, €, £, ¥


# ---------------------------------------------------------------------------
# Helpers to detect document locale
# ---------------------------------------------------------------------------


def _has_non_us_indicators(text: str) -> bool:
    """Check whether the document has non-US locale indicators."""
    return any(
        keyword in text.lower()
        for keyword in ("gst", "inr", "\u20b9", "india", "vat", "abn", "gstin")
    )


def _find_value_after_label(lines: list[str], label_pattern: str) -> str | None:
    """Find a value that follows a label in a list of lines.

    The value can be:
    - On the same line after the label (e.g. "Invoice No: INV-001")
    - On the next line (e.g. "Invoice No:\nINV-001")

    Returns the value string, or None if not found.
    """
    for i, line in enumerate(lines):
        m = re.search(label_pattern, line, re.IGNORECASE)
        if not m:
            continue
        # Try same line — strip the label and any leftover punctuation
        same_line = re.sub(label_pattern, "", line, flags=re.IGNORECASE).strip(": \t-.")
        if same_line:
            return same_line
        # Try next line
        if i + 1 < len(lines):
            candidate = lines[i + 1].strip(": \t")
            if candidate and not re.match(r"^[A-Z][a-z]+\s*(:|$)", candidate):
                return candidate
    return None


# ---------------------------------------------------------------------------
# Post-processing helpers
# ---------------------------------------------------------------------------


def _normalise_date(raw: str, prefer_dmy: bool = False) -> Optional[str]:
    """Try to parse a date string and return YYYY-MM-DD.

    Supports:
      - DD/MM/YYYY or DD-MM-YYYY
      - MM/DD/YYYY or MM-DD-YYYY
      - YYYY-MM-DD
      - MMM DD, YYYY / DD MMM YYYY  (e.g. Jan 15, 2024)

    Args:
        raw: The raw date string.
        prefer_dmy: If True, ambiguous two-digit-year dates (e.g. 03/04/25)
            are treated as DD/MM/YY. Otherwise MM/DD/YY is assumed.
    """
    if not raw or not raw.strip():
        return None

    raw = raw.strip()

    # Already YYYY-MM-DD
    if re.match(r"^\d{4}-\d{2}-\d{2}$", raw):
        return raw

    months_map = {
        "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
        "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
    }

    # DD MMM YYYY  (e.g. 15 Jan 2024)
    m = re.match(
        r"(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)"
        r"[a-z]*\s*(\d{4})",
        raw, re.IGNORECASE,
    )
    if m:
        return (
            f"{m.group(3)}-{months_map[m.group(2).lower()]:02d}"
            f"-{int(m.group(1)):02d}"
        )

    # MMM DD, YYYY  (e.g. Jan 15, 2024)
    m = re.match(
        r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)"
        r"[a-z]*\s+(\d{1,2}),?\s*(\d{4})",
        raw, re.IGNORECASE,
    )
    if m:
        return (
            f"{m.group(3)}-{months_map[m.group(1).lower()]:02d}"
            f"-{int(m.group(2)):02d}"
        )

    # DD/MM/YYYY or DD-MM-YYYY (4-digit year)
    m = re.match(r"(\d{1,2})[/-](\d{1,2})[/-](\d{4})", raw)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), m.group(3)
        return f"{y}-{mo:02d}-{d:02d}"

    # Ambiguous two-digit year — apply locale heuristic now
    m = re.match(r"(\d{1,2})[/-](\d{1,2})[/-](\d{2})$", raw)
    if m:
        p1, p2, y = int(m.group(1)), int(m.group(2)), m.group(3)
        yy = "20" + y if int(y) < 50 else "19" + y
        if prefer_dmy:
            # DD/MM/YY
            return f"{yy}-{p2:02d}-{p1:02d}"
        else:
            # MM/DD/YY
            return f"{yy}-{p1:02d}-{p2:02d}"

    return None


def _parse_amount(val: object) -> Optional[float]:
    """Strip currency symbols / thousand-seps and return float."""
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip()
    if not s:
        return None
    # Remove currency symbols & common suffixes
    s = re.sub(r"[₹$€£¥,\s]", "", s)
    s = re.sub(r"(?i)\s*(inr|usd|eur|gbp|jpy)\s*", "", s)
    try:
        return float(s)
    except ValueError:
        return None


def _check_totals_match(data: dict) -> list[str]:
    """Rule 3: verify subtotal + tax - discount ≈ grand_total."""
    flags: list[str] = []
    subtotal = _parse_amount(data.get("subtotal"))
    tax = _parse_amount(data.get("tax_amount"))
    discount = _parse_amount(data.get("discount"))
    grand = _parse_amount(data.get("grand_total"))

    if subtotal is not None and grand is not None:
        expected = subtotal + (tax or 0) - (discount or 0)
        if abs(expected - grand) > 1.0:
            flags.append("totals_mismatch")
    return flags


def _check_required_fields(data: dict) -> list[str]:
    """Rule 4: if any critical field is missing, add missing_required_field."""
    if (
        not data.get("invoice_number")
        or not data.get("invoice_date")
        or data.get("grand_total") is None
    ):
        return ["missing_required_field"]
    return []


# ---------------------------------------------------------------------------
# Line-item / table parsing
# ---------------------------------------------------------------------------

# Row-level keywords — appear in actual table headers, not aggregate lines.
_TABLE_HEADER_KEYWORDS_ROW = [
    "item", "description", "product", "service", "particulars",
    "details", "name of product", "description of goods", "item name",
    "qty", "quantity", "rate", "unit price", "price", "hsn", "sac",
]

# Aggregate-level keywords — can appear in both table headers and total lines.
# These only count toward the 2-keyword threshold alongside a row keyword.
_TABLE_HEADER_KEYWORDS_AGGREGATE = [
    "amount", "sl no", "s.no", "s. no", "#",
]

_TABLE_END_KEYWORDS = [
    "subtotal", "sub total", "grand total", "total",
    "shipping", "handling", "charges", "discount",
    "tax", "gst", "cgst", "sgst", "igst",
]


def _find_table_region(lines: list[str]) -> tuple[int, int] | None:
    """Locate the table header row and the end of the data region.

    Scans for a line containing 2+ table-related keywords (e.g. "Qty", "Rate",
    "Amount"), then walks forward until a subtotal/total line or separator.

    Returns ``(header_index, end_index)`` or ``None`` when no table is found.
    """
    header_idx = None
    for i, line in enumerate(lines):
        lower = line.lower()
        row_matches = sum(1 for kw in _TABLE_HEADER_KEYWORDS_ROW if kw in lower)
        agg_matches = sum(1 for kw in _TABLE_HEADER_KEYWORDS_AGGREGATE if kw in lower)
        # Require at least one row-level keyword to avoid aggregate-only
        # false positives like "Total Amount:"
        if row_matches + agg_matches >= 2 and row_matches >= 1:
            header_idx = i
            break

    if header_idx is None:
        return None

    # Walk forward from the header to find the end of the data region
    end_idx = len(lines)
    for i in range(header_idx + 1, len(lines)):
        lower = lines[i].strip().lower()
        if not lower:
            continue
        # Separator line  (-----------------)
        if re.match(r"^[-=_]{3,}$", lower):
            end_idx = i
            break
        # Explicit end keyword (word-boundary match to avoid false positives
        # like catching "Total Quality Widget" for "total")
        if any(re.match(rf"^{kw}\b", lower) for kw in _TABLE_END_KEYWORDS):
            end_idx = i
            break

    return (header_idx, end_idx)


def _parse_line_item_row(row: str) -> dict | None:
    """Parse a single OCR text row into a ``LineItem``-compatible dict.

    Finds numeric values in the row (stripping currency symbols), treats the
    right-most ones as ``qty / unit_price / line_total``, and the remaining
    text as ``item_name``.

    Returns ``None`` if the row doesn't contain enough data.
    """
    row = row.strip()
    if not row:
        return None

    tokens = row.split()
    if len(tokens) < 2:
        return None

    # Collect number-like tokens and text tokens
    parsed: list[tuple[str, float]] = []
    text_parts: list[str] = []
    for tok in tokens:
        cleaned = re.sub(r"[\u20b9$\u20ac\u00a3\u00a5,()\s]", "", tok)
        try:
            val = float(cleaned)
            parsed.append((tok, val))
        except ValueError:
            text_parts.append(tok)

    # Need item text and at least one number
    if not text_parts or len(parsed) < 1:
        return None

    item_name = " ".join(text_parts).strip(":;-.,\t ")

    # Skip rows that are clearly labels, not data
    if len(item_name) < 2 and len(parsed) < 2:
        return None

    # Skip rows whose item name matches an end-of-table keyword (e.g.
    # "Discount  -10.00" should not be treated as a line item)
    if any(item_name.lower() == kw for kw in _TABLE_END_KEYWORDS):
        return None

    values = [v for _, v in parsed]
    result: dict = {"item_name": item_name}

    # Map numeric values based on count (right-to-left for financial columns)
    if len(values) == 1:
        # Single amount — simplified table
        result["line_total"] = values[0]
    elif len(values) == 2:
        # qty + amount  OR  rate + amount
        # Heuristic: small integer → qty, otherwise rate
        if values[0] == int(values[0]) and values[0] < 1000:
            result["quantity"] = values[0]
            result["line_total"] = values[1]
        else:
            result["unit_price"] = values[0]
            result["line_total"] = values[1]
    elif len(values) == 3:
        # qty / rate / amount  (most common)
        result["quantity"] = values[0]
        result["unit_price"] = values[1]
        result["line_total"] = values[2]
    elif len(values) >= 4:
        # qty / rate / tax% / amount
        result["quantity"] = values[0]
        result["unit_price"] = values[1]
        result["tax_percent"] = values[2]
        result["line_total"] = values[3]

    return result


def _extract_line_items(raw_text: str) -> list[dict]:
    """Extract line-item rows from invoice OCR text.

    1. Split text into non-empty lines.
    2. Find the table region (header -> subtotal/total).
    3. Parse each data row into a ``LineItem``_dict.

    Returns a (possibly empty) list of dicts compatible with ``LineItem``.
    """
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
    region = _find_table_region(lines)
    if region is None:
        return []

    header_idx, end_idx = region
    data_lines = lines[header_idx + 1 : end_idx]

    items: list[dict] = []
    for row in data_lines:
        parsed = _parse_line_item_row(row)
        if parsed is not None:
            items.append(parsed)

    return items


# ---------------------------------------------------------------------------
# Main extraction interface
# ---------------------------------------------------------------------------


def extract_from_ocr_text(raw_text: str) -> ExtractionResult:
    """Parse raw OCR text and return structured extraction data.

    Uses regex-based pattern matching to extract common invoice fields.
    """
    prefers_dmy = _has_non_us_indicators(raw_text)
    data = _rule_based_extract(raw_text, prefers_dmy)
    return _build_result(data, raw_text)


def _rule_based_extract(raw_text: str, prefers_dmy: bool = False) -> dict:
    """Extract common invoice fields from raw OCR text using label-based matching.

    Uses ``find_value_after_label`` matching that handles both same-line and
    next-line value formats common in invoice layouts.
    """
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]

    if not lines:
        return {
            "vendor_name": None,
            "invoice_number": None,
            "invoice_date": None,
            "due_date": None,
            "gst_or_tax_number": None,
            "currency": None,
            "subtotal": None,
            "tax_amount": None,
            "discount": None,
            "grand_total": None,
            "line_items": [],
        }

    line_items = _extract_line_items(raw_text)

    # Extract fields using the label-finder
    invoice_number = _find_value_after_label(lines, r"invoice\s*(?:number|no|#)\s*:?")
    invoice_date = _normalise_date(
        _find_value_after_label(lines, r"invoice\s*date\s*:?") or "", prefers_dmy
    )
    due_date = _normalise_date(
        _find_value_after_label(lines, r"due\s*date\s*:?") or "", prefers_dmy
    )
    gst_or_tax_number = _find_value_after_label(lines, r"gstin\s*:?") or \
        _find_value_after_label(lines, r"gst\s*(?:no|number|#)?\s*:?")

    # Vendor name = first non-empty line (before "Bill To" section),
    # skipping common header labels
    vendor_name = None
    for candidate in lines:
        skip_patterns = [
            r"^invoice$", r"^tax\s*invoice$", r"^proforma\s*invoice$",
            r"^receipt$", r"^bill$", r"^purchase\s*order$",
        ]
        if not any(re.match(p, candidate, re.IGNORECASE) for p in skip_patterns):
            vendor_name = candidate
            break

    subtotal = _find_value_after_label(lines, r"subtotal\s*:?")
    discount = _find_value_after_label(lines, r"discount\s*:?")
    tax_amount = _find_value_after_label(lines, r"tax\s*(?:\(gst\))?\s*:?")
    # Use \\b (word boundary) to avoid matching 'subtotal' — match 'grand total' or standalone 'total'
    grand_total = _find_value_after_label(lines, r"grand\s*total\s*:?")
    if not grand_total:
        grand_total = _find_value_after_label(lines, r"total\s*(?:due|amount)?\s*:?")

    # Currency detection
    currency = None
    if "\u20b9" in raw_text or "inr" in raw_text.lower():
        currency = "INR"
    elif "$" in raw_text:
        currency = "USD"
    elif "\u20ac" in raw_text:
        currency = "EUR"
    elif "\u00a3" in raw_text:
        currency = "GBP"

    return {
        "vendor_name": vendor_name,
        "invoice_number": invoice_number,
        "invoice_date": invoice_date,
        "due_date": due_date,
        "gst_or_tax_number": gst_or_tax_number,
        "currency": currency,
        "subtotal": subtotal,
        "tax_amount": tax_amount,
        "discount": discount,
        "grand_total": grand_total,
        "line_items": line_items,
    }


def _build_result(data: dict, raw_text: str) -> ExtractionResult:
    """Wrap extracted data into an ExtractionResult with confidence & flags."""
    flags: list[str] = []

    # Run post-processing rules
    flags.extend(_check_totals_match(data))
    flags.extend(_check_required_fields(data))

    # Confidence scoring — rule-based fallback gets low confidence
    def _confidence(field_name: str) -> float:
        return 0.9 if data.get(field_name) is not None else 0.0

    confidence = ConfidenceScores(
        vendor_name=_confidence("vendor_name"),
        invoice_number=_confidence("invoice_number"),
        invoice_date=_confidence("invoice_date"),
        grand_total=_confidence("grand_total"),
        overall=0.3,  # rule-based fallback is low-confidence overall
    )

    return ExtractionResult(
        vendor_name=data.get("vendor_name"),
        invoice_number=data.get("invoice_number"),
        invoice_date=data.get("invoice_date"),
        due_date=data.get("due_date"),
        gst_or_tax_number=data.get("gst_or_tax_number"),
        currency=data.get("currency"),
        subtotal=_parse_amount(data.get("subtotal")),
        tax_amount=_parse_amount(data.get("tax_amount")),
        discount=_parse_amount(data.get("discount")),
        grand_total=_parse_amount(data.get("grand_total")),
        line_items=[LineItem(**li) for li in data.get("line_items", [])],
        confidence=confidence,
        flags=flags,
    )
