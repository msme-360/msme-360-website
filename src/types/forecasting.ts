export type UploadStatus = 'uploaded' | 'processing' | 'clean' | 'failed'
export type RunStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Dataset {
  id: string
  user_id: string
  file_name: string
  file_path: string
  upload_status: UploadStatus
  row_count: number | null
  created_at: string
}

export interface DatasetColumn {
  id: string
  dataset_id: string
  original_name: string
  mapped_name: string
  data_type: string
}

export interface ForecastRun {
  id: string
  dataset_id: string
  forecast_level: string
  horizon: number
  status: RunStatus
  model_name: string | null
  started_at: string
  completed_at: string | null
}

export interface ForecastMetrics {
  id: string
  run_id: string
  mae: number
  rmse: number
  mape: number
}

export interface ForecastOutput {
  id: string
  run_id: string
  forecast_date: string
  entity_name: string
  actual_value: number | null
  predicted_value: number
  lower_bound: number | null
  upper_bound: number | null
}