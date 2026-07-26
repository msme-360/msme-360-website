from fastapi import APIRouter
from app.routes import forecast
from app.routes import ocr

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(forecast.router)
api_v1_router.include_router(ocr.router)