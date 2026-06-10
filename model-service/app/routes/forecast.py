from fastapi import APIRouter, BackgroundTasks
from uuid import UUID
from app.schemas.forecast import ForecastRunResponse
from app.services.background import background_pipeline_orchestration

router = APIRouter(prefix="/forecast")

@router.post("/run/{run_id}", response_model=ForecastRunResponse, status_code=202)
async def run_forecast(run_id: UUID, background_tasks: BackgroundTasks):
    """
    Expose a single POST endpoint: /api/v1/forecast/run/{run_id}.
    Accepts a UUID, offloads to background worker, and returns 202 Accepted.
    """
    background_tasks.add_task(background_pipeline_orchestration, run_id)
    return {
        "status": "accepted",
        "message": "ML processing started in background"
    }