"""
predict.py
----------
Loads model artifacts and runs demand forecasting.
"""

from __future__ import annotations

import os
import warnings
from datetime import date
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

from .feature_pipeline import (
    FEATURES,
    build_batch_features,
    build_feature_rows,
    load_lag_table,
)

# ── Artifact paths (relative to this file) ────────────────────────────────────
BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "lgbm_model.pkl"
ENCODERS_PATH = BASE_DIR / "label_encoders.pkl"
LAG_CSV_PATH = BASE_DIR / "lag_lookup.csv"

CAT_COLS = ["category", "region", "store_id", "price_tier"]

# Singleton to load artifacts once
_artifacts = None


def get_artifacts():
    global _artifacts
    if _artifacts is None:
        model = joblib.load(MODEL_PATH)
        encoders = joblib.load(ENCODERS_PATH)
        lag_table = load_lag_table(str(LAG_CSV_PATH))
        _artifacts = (model, encoders, lag_table)
    return _artifacts


def encode(df: pd.DataFrame, encoders: dict) -> pd.DataFrame:
    df = df.copy()
    for col in CAT_COLS:
        le = encoders[col]
        df[col] = df[col].astype(str)
        df[col] = np.where(
            df[col].isin(le.classes_),
            le.transform(df[col].where(df[col].isin(le.classes_), le.classes_[0])),
            -1,
        )
    return df


def predict_demand_horizon(
    store_id: str,
    category: str,
    region: str,
    unit_price: float,
    promo_flag: int,
    horizon_days: int,
    start_date: date | None = None,
) -> list[dict]:
    """
    Forecast demand for a single store+category over horizon_days.

    Returns list of dicts with keys: date, store_id, category, region, predicted_units
    """
    model, encoders, lag_table = get_artifacts()

    feature_df, future_dates = build_feature_rows(
        store_id=store_id,
        category=category,
        region=region,
        unit_price=unit_price,
        promo_flag=promo_flag,
        days=horizon_days,
        lag_table=lag_table,
        start_date=start_date,
    )

    encoded = encode(feature_df, encoders)
    preds = np.clip(model.predict(encoded[FEATURES]), 0, None).round().astype(int)

    return [
        {
            "date": d.isoformat(),
            "store_id": store_id.upper(),
            "category": category.upper(),
            "region": region.upper(),
            "predicted_units": int(pred),
        }
        for d, pred in zip(future_dates, preds)
    ]


def predict_demand_batch(
    input_df: pd.DataFrame,
    horizon_days: int,
    start_date: date | None = None,
) -> list[dict]:
    """
    Batch forecast from DataFrame.

    Input DataFrame must have columns:
        store_id, category, region, unit_price, promo_flag

    Returns list of dicts with keys: date, store_id, category, region, predicted_units
    """
    model, encoders, lag_table = get_artifacts()

    feature_df, meta_df = build_batch_features(
        input_df=input_df,
        days=horizon_days,
        lag_table=lag_table,
        start_date=start_date,
    )

    encoded = encode(feature_df, encoders)
    preds = np.clip(model.predict(encoded[FEATURES]), 0, None).round().astype(int)

    result = meta_df.copy()
    result["predicted_units"] = preds

    return result.to_dict("records")
