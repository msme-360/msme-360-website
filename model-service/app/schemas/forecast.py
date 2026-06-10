from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from decimal import Decimal

# --- Dataset Models ---

class DatasetBase(BaseModel):
    file_name: str
    file_path: str
    upload_status: Optional[str] = "uploaded"
    row_count: Optional[int] = None

class DatasetCreate(DatasetBase):
    user_id: Optional[UUID] = None

class Dataset(DatasetBase):
    id: UUID
    user_id: Optional[UUID]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- DatasetColumn Models ---

class DatasetColumnBase(BaseModel):
    dataset_id: Optional[UUID] = None
    original_name: Optional[str] = None
    mapped_name: Optional[str] = None
    data_type: Optional[str] = None

class DatasetColumnCreate(DatasetColumnBase):
    pass

class DatasetColumn(DatasetColumnBase):
    id: UUID
    
    model_config = ConfigDict(from_attributes=True)

# --- ForecastRun Models ---

class ForecastRunBase(BaseModel):
    dataset_id: Optional[UUID] = None
    forecast_level: Optional[str] = None
    horizon: Optional[int] = Field(default=7)
    status: Optional[str] = Field(default="pending")
    model_name: Optional[str] = None

class ForecastRunCreate(ForecastRunBase):
    pass

class ForecastRun(ForecastRunBase):
    id: UUID
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

# --- ForecastMetric Models ---

class ForecastMetricBase(BaseModel):
    run_id: Optional[UUID] = None
    mae: Optional[Decimal] = None
    rmse: Optional[Decimal] = None
    mape: Optional[Decimal] = None

class ForecastMetricCreate(ForecastMetricBase):
    pass

class ForecastMetric(ForecastMetricBase):
    id: UUID
    
    model_config = ConfigDict(from_attributes=True)

# --- ForecastOutput Models ---

class ForecastOutputBase(BaseModel):
    run_id: Optional[UUID] = None
    forecast_date: Optional[datetime] = None
    entity_name: Optional[str] = None
    actual_value: Optional[Decimal] = None
    predicted_value: Optional[Decimal] = None
    lower_bound: Optional[Decimal] = None
    upper_bound: Optional[Decimal] = None

class ForecastOutputCreate(ForecastOutputBase):
    pass

class ForecastOutput(ForecastOutputBase):
    id: UUID
    
    model_config = ConfigDict(from_attributes=True)

# --- API Response Models ---

class ForecastRunResponse(BaseModel):
    status: str
    message: str