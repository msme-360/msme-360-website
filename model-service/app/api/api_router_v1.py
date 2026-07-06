from fastapi import APIRouter
from app.routes import forecast

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(forecast.router)