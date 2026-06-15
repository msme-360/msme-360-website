"""
feature_pipeline.py
-------------------
Transforms raw user input into model-ready features.

User provides:    store_id, category, region, unit_price, promo_flag
App auto-fills:   month, is_weekend, festival_flag, price_tier,
                  promo_weekend, promo_festival, lag_7, lag_14, lag_28,
                  rolling_mean_7, rolling_mean_28
"""

from __future__ import annotations

import os
from datetime import date, timedelta

import pandas as pd

# ── Festival calendar (India) ───────────────────────────────────────────────
FESTIVAL_DATES: set[date] = {
    date(2026, 1, 14),   # Makar Sankranti
    date(2026, 3, 25),   # Holi
    date(2026, 4, 14),   # Baisakhi
    date(2026, 8, 15),   # Independence Day
    date(2026, 8, 19),   # Raksha Bandhan
    date(2026, 9, 2),    # Janmashtami
    date(2026, 10, 2),   # Gandhi Jayanti
    date(2026, 10, 20),  # Diwali
    date(2026, 10, 21),  # Diwali
    date(2026, 10, 22),  # Diwali
    date(2026, 11, 5),   # Chhath Puja
    date(2026, 12, 25),  # Christmas
}

FEATURES = [
    "category", "region", "store_id", "promo_flag",
    "month", "is_weekend", "festival_flag",
    "unit_price", "price_tier", "promo_weekend", "promo_festival",
    "lag_7", "lag_14", "lag_28",
    "rolling_mean_7", "rolling_mean_28",
]


def _price_tier(unit_price: float) -> str:
    if unit_price < 20:
        return "low"
    elif unit_price < 60:
        return "mid"
    return "high"


def load_lag_table(lag_csv_path: str) -> pd.DataFrame:
    """Load precomputed lag lookup table from CSV."""
    if not os.path.exists(lag_csv_path):
        raise FileNotFoundError(f"lag_lookup.csv not found at: {lag_csv_path}")
    df = pd.read_csv(lag_csv_path)
    df["store_id"] = df["store_id"].astype(str)
    df["category"] = df["category"].astype(str).str.upper()
    df["region"] = df["region"].astype(str).str.upper()
    return df.set_index(["store_id", "category", "region"])


def build_feature_rows(
    store_id: str,
    category: str,
    region: str,
    unit_price: float,
    promo_flag: int,
    days: int,
    lag_table: pd.DataFrame,
    start_date: date | None = None,
) -> tuple[pd.DataFrame, list[date]]:
    """
    Build a feature DataFrame for `days` future dates.

    Parameters
    ----------
    store_id    : e.g. 'S0045'
    category    : e.g. 'GROCERIES'
    region      : e.g. 'CENTRAL'
    unit_price  : product price
    promo_flag  : 1 if promotion active, else 0
    days        : forecast horizon (7, 14, or 21)
    lag_table   : loaded via load_lag_table()
    start_date  : first forecast date (defaults to tomorrow)

    Returns
    -------
    (feature_df, future_dates)
    """
    category = category.upper()
    region = region.upper()
    store_id = store_id.upper()

    if start_date is None:
        start_date = date.today() + timedelta(days=1)

    future_dates = [start_date + timedelta(days=i) for i in range(days)]

    # Lag lookup
    key = (store_id, category, region)
    if key in lag_table.index:
        row = lag_table.loc[key]
        lag_7          = float(row["lag_7"])
        lag_14         = float(row["lag_14"])
        lag_28         = float(row["lag_28"])
        rolling_mean_7 = float(row["rolling_mean_7"])
        rolling_mean_28 = float(row["rolling_mean_28"])
    else:
        # Unknown store+category+region — default to 0
        lag_7 = lag_14 = lag_28 = rolling_mean_7 = rolling_mean_28 = 0.0

    price_tier = _price_tier(unit_price)

    records = []
    for d in future_dates:
        is_weekend    = int(d.weekday() >= 5)
        festival_flag = int(d in FESTIVAL_DATES)
        records.append({
            "category"       : category,
            "region"         : region,
            "store_id"       : store_id,
            "promo_flag"     : int(promo_flag),
            "month"          : d.month,
            "is_weekend"     : is_weekend,
            "festival_flag"  : festival_flag,
            "unit_price"     : unit_price,
            "price_tier"     : price_tier,
            "promo_weekend"  : int(promo_flag and is_weekend),
            "promo_festival" : int(promo_flag and festival_flag),
            "lag_7"          : lag_7,
            "lag_14"         : lag_14,
            "lag_28"         : lag_28,
            "rolling_mean_7" : rolling_mean_7,
            "rolling_mean_28": rolling_mean_28,
        })

    return pd.DataFrame(records), future_dates


def build_batch_features(
    input_df: pd.DataFrame,
    days: int,
    lag_table: pd.DataFrame,
    start_date: date | None = None,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Build features for a batch of records from a CSV/DataFrame.

    input_df must have columns:
        store_id, category, region, unit_price, promo_flag

    Returns
    -------
    (feature_df, meta_df)
        feature_df : model-ready features (FEATURES columns)
        meta_df    : store_id, category, region, date, row_index
    """
    required = {"store_id", "category", "region", "unit_price", "promo_flag"}
    missing = required - set(input_df.columns)
    if missing:
        raise ValueError(f"Input CSV missing columns: {missing}")

    # Merge lag values in one vectorized join
    input_df = input_df.copy()
    input_df["store_id"] = input_df["store_id"].astype(str).str.upper()
    input_df["category"] = input_df["category"].astype(str).str.upper()
    input_df["region"]   = input_df["region"].astype(str).str.upper()

    lag_reset = lag_table.reset_index()
    merged = input_df.merge(
        lag_reset, on=["store_id", "category", "region"], how="left"
    ).fillna(0)

    all_features = []
    all_meta     = []

    if start_date is None:
        start_date = date.today() + timedelta(days=1)

    future_dates = [start_date + timedelta(days=i) for i in range(days)]

    for _, row in merged.iterrows():
        price_tier = _price_tier(row["unit_price"])
        for d in future_dates:
            is_weekend    = int(d.weekday() >= 5)
            festival_flag = int(d in FESTIVAL_DATES)
            pf = int(row["promo_flag"])
            all_features.append({
                "category"       : row["category"],
                "region"         : row["region"],
                "store_id"       : row["store_id"],
                "promo_flag"     : pf,
                "month"          : d.month,
                "is_weekend"     : is_weekend,
                "festival_flag"  : festival_flag,
                "unit_price"     : float(row["unit_price"]),
                "price_tier"     : price_tier,
                "promo_weekend"  : int(pf and is_weekend),
                "promo_festival" : int(pf and festival_flag),
                "lag_7"          : float(row["lag_7"]),
                "lag_14"         : float(row["lag_14"]),
                "lag_28"         : float(row["lag_28"]),
                "rolling_mean_7" : float(row["rolling_mean_7"]),
                "rolling_mean_28": float(row["rolling_mean_28"]),
            })
            all_meta.append({
                "store_id": row["store_id"],
                "category": row["category"],
                "region"  : row["region"],
                "date"    : d.isoformat(),
            })

    return pd.DataFrame(all_features), pd.DataFrame(all_meta)
