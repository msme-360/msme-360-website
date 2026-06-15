from fastapi import APIRouter, BackgroundTasks
from uuid import UUID, uuid4
from app.schemas.forecast import (
    ForecastRunResponse,
    IngestionPayload,
    InitializeResponse,
    ColumnMapping
)
from app.services.background import background_pipeline_orchestration
from app.utils.supabase_client import supabase
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/forecast")

@router.post("/initialize", response_model=InitializeResponse, status_code=202)
async def initialize_forecast(payload: IngestionPayload, background_tasks: BackgroundTasks):
    """
    Unified ingestion endpoint that orchestrates all database writes and triggers background worker.
    """
    try:
        # Generate new run_id
        run_id = uuid4()

        # 1. Insert into datasets
        dataset_id = UUID(payload.dataset_id)
        supabase.table("datasets").insert({
            "id": str(dataset_id),
            "user_id": payload.user_id,
            "file_path": payload.file_path,
            "upload_status": "uploaded"
        }).execute()

        # 2. Batch insert into dataset_columns
        dataset_columns = [
            {
                "dataset_id": str(dataset_id),
                "original_name": mapping.original_name,
                "mapped_name": mapping.mapped_name,
                "data_type": mapping.data_type
            }
            for mapping in payload.column_mappings
        ]
        if dataset_columns:
            supabase.table("dataset_columns").insert(dataset_columns).execute()

        # 3. Insert into forecast_runs
        supabase.table("forecast_runs").insert({
            "id": str(run_id),
            "dataset_id": str(dataset_id),
            "horizon": payload.horizon,
            "model_name": payload.model_name,
            "status": "pending"
        }).execute()

        # 4. Trigger background worker with in-memory parameters
        background_tasks.add_task(
            background_pipeline_orchestration,
            run_id,
            payload.file_path,
            payload.column_mappings,
            payload.horizon
        )

        # 5. Return 202 with run_id
        return InitializeResponse(
            run_id=str(run_id),
            status="accepted",
            message="Forecast job initialized successfully"
        )

    except Exception as e:
        logger.error(f"Failed to initialize forecast: {str(e)}")
        raise

@router.post("/run/{run_id}", response_model=ForecastRunResponse, status_code=202)
async def run_forecast(run_id: UUID, background_tasks: BackgroundTasks):
    # Legacy Endpoint
    return {
        "status": "deprecated",
        "message": "Use POST /api/v1/forecast/initialize instead"
    }