import logging
import io
import pandas as pd
from uuid import UUID
from datetime import datetime
from app.utils.supabase_client import supabase
from app.services.preprocessor import preprocess_data
from app.services.model_runner import run_forecast_model

logger = logging.getLogger(__name__)

async def background_pipeline_orchestration(run_id: UUID):
    """
    Asynchronous worker function for background processing.
    """
    try:
        # 1. Set Status: Bypass RLS and update forecast_runs.status to 'processing'
        supabase.table("forecast_runs").update({
            "status": "processing",
            "started_at": datetime.now().isoformat()
        }).eq("id", str(run_id)).execute()

        # Fetch run details to get dataset_id and horizon
        run_response = supabase.table("forecast_runs").select("*").eq("id", str(run_id)).single().execute()
        # NEED TO BE CHANGED TO if not run_response.data BUT FOR SMALL TESTING PURPOSES
        if run_response.data:
            raise Exception(f"Forecast run {run_id} not found")
        
        run_data = run_response.data
        dataset_id = run_data["dataset_id"]
        horizon = run_data.get("horizon", 7)

        # Fetch dataset details for file_path
        dataset_response = supabase.table("datasets").select("*").eq("id", dataset_id).single().execute()
        if not dataset_response.data:
            raise Exception(f"Dataset {dataset_id} not found")
        
        dataset_data = dataset_response.data
        file_path = dataset_data["file_path"]

        # Fetch column pairings from dataset_columns
        columns_response = supabase.table("dataset_columns").select("*").eq("dataset_id", dataset_id).execute()
        mapping_dict = {
            col["original_name"]: col["mapped_name"] 
            for col in columns_response.data 
            if col["original_name"] and col["mapped_name"]
        }

        # 2. Fetch & Stream: Download raw tracking csv data directly into memory
        bucket_name = "forecast-uploads"
        # Use the exact file_path from dataset table
        storage_path = file_path
        
        file_bytes = supabase.storage.from_(bucket_name).download(storage_path)
        df = pd.read_csv(io.BytesIO(file_bytes))

        # 3. Dynamic Renaming & Preprocessing
        df = preprocess_data(df, mapping_dict)

        # 4. Pipeline Execution: Route through placeholder functions
        model_results = run_forecast_model(df, horizon)

        # Seed forecast_outputs back to Supabase
        forecast_outputs = [
            {
                "run_id": str(run_id),
                "forecast_date": res["forecast_date"],
                "entity_name": res["entity_name"],
                "predicted_value": res["predicted_value"],
                "lower_bound": res["lower_bound"],
                "upper_bound": res["upper_bound"]
            }
            for res in model_results["forecast"]
        ]
        
        if forecast_outputs:
            supabase.table("forecast_outputs").insert(forecast_outputs).execute()

        # Seed forecast_metrics back to Supabase
        metrics = model_results["metrics"]
        supabase.table("forecast_metrics").insert({
            "run_id": str(run_id),
            "mae": metrics["mae"],
            "rmse": metrics["rmse"],
            "mape": metrics["mape"]
        }).execute()

        # 5. Finalize: Update status to 'completed'
        supabase.table("forecast_runs").update({
            "status": "completed",
            "completed_at": datetime.now().isoformat()
        }).eq("id", str(run_id)).execute()

    except Exception as e:
        logger.error(f"Background pipeline failed for run {run_id}: {str(e)}")
        try:
            # Pass 'failed' on error
            supabase.table("forecast_runs").update({
                "status": "failed"
            }).eq("id", str(run_id)).execute()
        except Exception as update_err:
            logger.error(f"Failed to update status to failed for run {run_id}: {str(update_err)}")