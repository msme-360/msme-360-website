import { supabase } from '@/services/supabase/supabase'
import { ColumnInfo } from '@/utils/fileParser'
import { v4 as uuidv4 } from 'uuid'

// Step 1 — Generate client-side dataset ID and upload file ONLY to storage
export async function uploadFileToStorageAndSaveDataset(file: File, columnInfos: ColumnInfo[]) {
  // Get logged in user for RLS
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")
  
  console.log("Starting upload for user:", user.id)
  
  // Generate dataset ID on client side
  const datasetId = uuidv4()

  // Upload file directly to storage with correct path
  const storagePath = `user_${user.id}/dataset_${datasetId}.csv`
  console.log("Uploading to storage path:", storagePath)
  
  const { error: storageError } = await supabase.storage
    .from('forecast-uploads')
    .upload(storagePath, file, {
      upsert: true
    })

  if (storageError) {
    console.error("Error uploading file to storage:", storageError)
    throw storageError
  }
  
  console.log("File uploaded to storage at:", storagePath)

  // Return dataset ID and storage path for next step
  return {
    id: datasetId,
    file_path: storagePath
  }
}

// Step 2 — Unified initialization: call /initialize endpoint
export async function initializeForecast(
  userId: string,
  datasetId: string,
  filePath: string,
  horizon: number,
  modelName: string,
  mapping: Record<string, string>,
  columnInfos: ColumnInfo[]
) {
  // Create column mappings array (filter out ignored columns but keep track for clarity)
  const dataTypeMap = columnInfos.reduce((acc, col) => {
    acc[col.name] = col.dataType;
    return acc;
  }, {} as Record<string, string>);

  const columnMappings = Object.entries(mapping).map(([original, mapped]) => ({
    original_name: original,
    mapped_name: mapped,
    data_type: dataTypeMap[original] || "text"
  }));

  // Call new FastAPI initialize endpoint
  console.log("Calling initialize endpoint with:", {
    userId, datasetId, filePath, horizon, modelName, columnMappings
  })

  const res = await fetch('http://localhost:8000/api/v1/forecast/initialize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId,
      dataset_id: datasetId,
      file_path: filePath,
      horizon,
      model_name: modelName,
      column_mappings: columnMappings
    })
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error("Initialize failed:", errorText)
    throw new Error(`Failed to initialize forecast: ${errorText}`)
  }

  const data = await res.json()
  console.log("Initialize response:", data)
  return data
}

// Step 3 — Get run results (unchanged)
export async function getRunResults(runId: string) {
  const { data: metrics } = await supabase
    .from('forecast_metrics')
    .select('*')
    .eq('run_id', runId)
    .single()

  const { data: predictions } = await supabase
    .from('forecast_outputs')
    .select('*')
    .eq('run_id', runId)

  return { metrics, predictions }
}

// Step 4 — Get history (unchanged)
export async function getHistory() {
  const { data, error } = await supabase
    .from('forecast_runs')
    .select('*')
    .order('started_at', { ascending: false })

  if (error) throw error
  return data
}
