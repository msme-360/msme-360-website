import logging
import io
import pandas as pd
from uuid import UUID
from datetime import datetime, date
from app.utils.supabase_client import supabase
from app.ml.predict import predict_demand_batch
from app.schemas.forecast import ColumnMapping

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