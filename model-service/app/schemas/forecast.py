from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from decimal import Decimal

class ForecastRunResponse(BaseModel):
    status: str
    message: str
