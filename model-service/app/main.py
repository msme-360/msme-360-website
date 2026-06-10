from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api.api_router_v1 import api_v1_router
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

app = FastAPI(
    title="MSME 360 ML Microservice",
    description="High-performance Python ML Microservice for forecasting",
    version="1.0.0"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the grouped V1 router
app.include_router(api_v1_router)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "model-service"}