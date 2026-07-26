"""Extraction engine — extracts structured invoice data from raw OCR text
using regex-based field matching."""

from __future__ import annotations

import logging
import re
from typing import Any, Optional

from app.schemas.ocr import (
    ConfidenceScores,
    ExtractionResult,
    LineItem,
)

logger = logging.getLogger(__name__)

# Currency symbols for amount parsing
_CURRENCY_SYMBOLS = "\u20b9$\u20ac\u00a3\u00a5"  # ₹, $, €, £, ¥

# Pattern to detect a subsequent label on the same line so we can truncate
# (e.g. "INV-001 Invoice Date: 05/07/2026" → "INV-001")
# Matches any label-like token: capitalized word(s) followed by optional
# parenthesised content and a colon (e.g. "Invoice Date:", "PO Number:",
# "Grand Total (INR):", "GSTIN:").
_NEXT_LABEL_PATTERN = re.compile(
    r"\b[A-Z][A-Za-z]*(?:\s+[A-Z][A-Za-z]*)*\s*(?:\([^)]*\))?\s*:"
)


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
        # Try same line — extract the text after the matched label
        # (Use m.end() so we only get text AFTER the label, avoiding
        # bleed from previous labels on the same line, e.g.
        # "Invoice No: INV-001 Invoice Date: 05/07/2026")
        # Note: do NOT strip leading '-' or the minus sign on negative
        # values (e.g. Discount: -5000) would be corrupted to "5000".
        same_line = line[m.end() :].strip(": \t.")
        if same_line:
            # Truncate at the next known label on the same line
            # (handles cases like "Invoice No: INV-001 Invoice Date: 05/07/2026"
            # where the matched label is the FIRST one and the NEXT label
            # follows the value)
            m_next = _NEXT_LABEL_PATTERN.search(same_line)
            if m_next and m_next.start() > 0:
                same_line = same_line[: m_next.start()].strip(": \t. ")
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
    # Remove Indian currency text prefixes BEFORE whitespace removal
    # e.g. "Rs. 20,695.00", "Rs 1,250", "Rupees 500.00"
    s = re.sub(r"(?i)^\s*(?:rs\.?\s*|rupees\s+)\s*", "", s)
    # Remove currency symbols & thousand separators
    s = re.sub(r"[₹$€£¥,\s]", "", s)
    # Remove parenthesised currency codes FIRST (e.g. (INR), (USD))
    # This must happen before bare ISO code stripping so "(INR)" is
    # removed as a unit rather than leaving empty "()".
    s = re.sub(r"(?i)\s*\([a-z]{3}\)\s*", "", s)
    # Remove ISO currency codes (case-insensitive)
    s = re.sub(r"(?i)\s*(inr|usd|eur|gbp|jpy)\s*", "", s)
    # Strip any remaining non-numeric chars (e.g. stray colon from label residue)
    s = re.sub(r"[^0-9.\-]", "", s)
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

    Strategy:
      1. Detect tax percent values ("12%", "18%") and record them.
      2. Keep numbers inside parentheses (e.g. "(500 sheets)") as part of
         the item description — they are rarely the actual quantity.
      3. Map remaining numeric values to qty / unit_price / line_total.
      4. Post-process: if we have unit_price + tax_percent + line_total,
         derive quantity mathematically and override an incorrect guess.
      5. Clean up table-border artifacts ("|") from the item name.

    Returns ``None`` if the row doesn't contain enough data.
    """
    row = row.strip()
    if not row:
        return None

    tokens = row.split()
    if len(tokens) < 2:
        return None

    tax_percent: float | None = None
    values: list[float] = []
    text_parts: list[str] = []

    for tok in tokens:
        # Detect explicit percent value (e.g. "12%", "18%")
        pct_match = re.match(r"^(\d+(?:\.\d+)?)%$", tok)
        if pct_match:
            tax_percent = float(pct_match.group(1))
            text_parts.append(tok)
            continue

        # Detect whether this token came from inside parentheses
        # e.g. "(500" or "sheets)" — these are description, not data columns
        was_in_parens = tok.startswith("(") or tok.endswith(")")

        cleaned = re.sub(r"[\u20b9$\u20ac\u00a3\u00a5,%()\s]", "", tok)
        try:
            val = float(cleaned)
            if was_in_parens:
                text_parts.append(tok)
            else:
                values.append(val)
        except ValueError:
            text_parts.append(tok)

    # Need item text and at least one number
    if not text_parts or len(values) < 1:
        return None

    # Build item name, removing table artifacts and normalising whitespace
    item_name = " ".join(text_parts)
    item_name = re.sub(r"[|]", " ", item_name)  # table borders → space
    item_name = re.sub(r"\s+", " ", item_name).strip(":;-.,\t ")

    # Skip rows that are clearly labels, not data
    if len(item_name) < 2 and len(values) < 2:
        return None

    # Skip rows whose item name matches an end-of-table keyword (e.g.
    # "Discount  -10.00" should not be treated as a line item)
    if any(item_name.lower() == kw for kw in _TABLE_END_KEYWORDS):
        return None

    result: dict = {"item_name": item_name}

    # Map numeric values based on count
    if len(values) == 1:
        result["line_total"] = values[0]
    elif len(values) == 2:
        # qty + amount  OR  rate + amount
        # Heuristic: small integer (< 100) → qty, otherwise rate
        if values[0] == int(values[0]) and values[0] < 100:
            result["quantity"] = int(values[0])
            result["line_total"] = values[1]
        else:
            result["unit_price"] = values[0]
            result["line_total"] = values[1]
    elif len(values) == 3:
        # qty / rate / amount  (most common)
        result["quantity"] = int(values[0]) if values[0] == int(values[0]) else values[0]
        result["unit_price"] = values[1]
        result["line_total"] = values[2]
    elif len(values) >= 4:
        # qty / rate / tax% / amount
        result["quantity"] = int(values[0]) if values[0] == int(values[0]) else values[0]
        result["unit_price"] = values[1]
        result["line_total"] = values[3]

    if tax_percent is not None:
        result["tax_percent"] = tax_percent

    # -------------------------------------------------------------------
    # Post-processing: derive quantity from unit_price, tax_percent, and
    # line_total when available. The OCR often misses the qty column or
    # confuses it with description numbers (e.g. capturing "500" from
    # "(500 sheets)" as the quantity).
    #
    # We intentionally do NOT modify line_total here — the raw OCR value
    # (which may or may not include tax) is preserved for downstream use.
    # -------------------------------------------------------------------
    if ("unit_price" in result and "line_total" in result
            and tax_percent is not None):
        pre_tax = result["line_total"] / (1 + tax_percent / 100.0)
        derived = pre_tax / result["unit_price"]
        rounded = round(derived)
        if abs(derived - rounded) < 0.05 and rounded > 0:
            result["quantity"] = rounded

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

    # Use \b word boundaries and negative lookbehinds to avoid substring collisions
    # (e.g. "total" matching inside "Subtotal")
    subtotal = _find_value_after_label(lines, r"\bsubtotal\b\s*:?")
    discount = _find_value_after_label(lines, r"\bdiscount\b\s*:?")
    # Require `:` after tax label so "Tax %" in table headers doesn't match
    tax_amount = _find_value_after_label(lines, r"\btax\b\s*(?:\(gst\))?\s*:")
    grand_total = _find_value_after_label(lines, r"\bgrand\s*total\b\s*(?:\([a-z]+\))?\s*:?")
    if not grand_total:
        grand_total = _find_value_after_label(lines, r"(?<!sub)(?<!sub )\btotal\b\s*(?:\([a-z]+\))?\s*(?:due|amount)?\s*:?")

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


def _is_valid_gstin(value: str) -> bool:
    """Validate a GSTIN (Goods and Services Tax Identification Number) format.

    GSTIN is 15 characters:
      - First 2 digits: State code
      - Next 5 chars: PAN (letters)
      - Next 4 digits: Entity number
      - Next 1 char: Check digit (letter)
      - Next 1 char: 'Z'
      - Last 1 char: Either letter or digit (checksum)
    """
    if not value or not isinstance(value, str):
        return False
    pattern = r"^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$"
    return bool(re.match(pattern, value.strip(), re.IGNORECASE))


def _confidence_for_field(field_name: str, value: Any, flags: list[str]) -> float:
    """Compute a heuristic confidence score (0.0 – 1.0) for an extracted field.

    Rules:
      - 0.0 if field is absent/None
      - 0.9 if field is present (basic extraction)
      - Penalties applied for known quality signals
    """
    if value is None:
        return 0.0

    base = 0.9

    if field_name == "grand_total" and "totals_mismatch" in flags:
        base = 0.6

    if field_name == "gst_or_tax_number":
        if isinstance(value, str) and not _is_valid_gstin(value):
            # Present but invalid format → lower confidence
            base = 0.5

    return base


def _build_result(data: dict, raw_text: str) -> ExtractionResult:
    """Wrap extracted data into an ExtractionResult with confidence & flags."""
    flags: list[str] = []

    # Run post-processing rules
    flags.extend(_check_totals_match(data))
    flags.extend(_check_required_fields(data))

    # Validate GSTIN format
    gst_value = data.get("gst_or_tax_number")
    if gst_value and isinstance(gst_value, str):
        if not _is_valid_gstin(gst_value):
            flags.append("invalid_gstin_format")

    # Heuristic confidence scoring per field
    parsed_values = {
        "vendor_name": data.get("vendor_name"),
        "invoice_number": data.get("invoice_number"),
        "invoice_date": data.get("invoice_date"),
        "grand_total": _parse_amount(data.get("grand_total")),
        "gst_or_tax_number": data.get("gst_or_tax_number"),
    }

    scores = {
        name: _confidence_for_field(name, val, flags)
        for name, val in parsed_values.items()
    }

    # overall is the average of all per-field scores (not a hardcoded constant)
    overall = sum(scores.values()) / len(scores) if scores else 0.0

    confidence = ConfidenceScores(
        vendor_name=scores["vendor_name"],
        invoice_number=scores["invoice_number"],
        invoice_date=scores["invoice_date"],
        grand_total=scores["grand_total"],
        overall=round(overall, 4),
    )

    grand_total_parsed = _parse_amount(data.get("grand_total"))

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
        grand_total=grand_total_parsed,
        total_amount=grand_total_parsed,
        line_items=[LineItem(**li) for li in data.get("line_items", [])],
        confidence=confidence,
        flags=flags,
    )
