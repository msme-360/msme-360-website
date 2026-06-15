import logging
import io
import os
import pandas as pd
from uuid import UUID
from datetime import datetime
from app.utils.supabase_client import supabase
from app.ml.feature_pipeline import load_lag_table, build_batch_features
from app.ml.predict import get_artifacts, FEATURES
from app.schemas.forecast import ColumnMapping

logger = logging.getLogger(__name__)

# Preload static ML artifacts on module import
BASE_ML_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml")
LAG_TABLE = load_lag_table(os.path.join(BASE_ML_DIR, "lag_lookup.csv"))

async def background_pipeline_orchestration(
    run_id: UUID,
    file_path: str,
    column_mappings: list[ColumnMapping],
    horizon: int
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

        # 2. Create mapping dict and rename columns
        mapping_dict = {
            mapping.original_name: mapping.mapped_name
            for mapping in column_mappings
            if mapping.original_name and mapping.mapped_name
        }

        # 3. Download & Load: Stream down user CSV from storage
        bucket_name = "forecast-uploads"
        storage_path = file_path
        file_bytes = supabase.storage.from_(bucket_name).download(storage_path)
        input_df = pd.read_csv(io.BytesIO(file_bytes))

        # Rename columns using user mappings
        input_df = input_df.rename(columns=mapping_dict)

        # 4. Load ML artifacts and run inference
        model, encoders, _ = get_artifacts()

        # Generate features
        feature_df, meta_df = build_batch_features(
            input_df=input_df,
            days=horizon,
            lag_table=LAG_TABLE
        )

        # Encode categorical features
        df_encoded = feature_df.copy()
        for col in ["category", "region", "store_id", "price_tier"]:
            le = encoders[col]
            df_encoded[col] = df_encoded[col].astype(str)
            df_encoded[col] = df_encoded[col].where(
                df_encoded[col].isin(le.classes_), le.classes_[0]
            )
            df_encoded[col] = le.transform(df_encoded[col])

        # Run prediction
        predictions = model.predict(df_encoded[FEATURES])
        # Clip to non-negative and cast to integers
        predictions = predictions.clip(min=0).round().astype(int)

        # 5. Compile and bulk insert
        result_df = meta_df.copy()
        result_df["predicted_units"] = predictions
        result_df["run_id"] = str(run_id)

        # Prepare forecast_outputs payload
        forecast_outputs = [
            {
                "run_id": row["run_id"],
                "forecast_date": row["date"],
                "entity_name": f"{row['store_id']}-{row['category']}-{row['region']}",
                "predicted_value": float(row["predicted_units"]),
                "lower_bound": float(row["predicted_units"]) * 0.9,
                "upper_bound": float(row["predicted_units"]) * 1.1
            }
            for _, row in result_df.iterrows()
        ]

        if forecast_outputs:
            supabase.table("forecast_outputs").insert(forecast_outputs).execute()

        # Insert placeholder metrics
        supabase.table("forecast_metrics").insert({
            "run_id": str(run_id),
            "mae": 0.0,
            "rmse": 0.0,
            "mape": 0.0
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