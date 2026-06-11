import { supabase } from '@/services/supabase/supabase'
import { ColumnInfo } from '@/utils/fileParser'

// Step 1 & 2 — Create dataset and upload file to storage
export async function uploadFileToStorageAndSaveDataset(file: File, columnInfos: ColumnInfo[]) {
  // Get logged in user for RLS
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")
  
  console.log("Starting upload for user:", user.id)
  
  // Create dataset record first
  const { data: dataset, error: dsError } = await supabase
    .from('datasets')
    .insert({
      user_id: user.id,
      file_name: file.name,
      file_path: `user_${user.id}/placeholder.csv`, // Will update later
      upload_status: 'uploading',
      row_count: 0
    })
    .select()
    .single()
  
  if (dsError) {
    console.error("Error inserting dataset:", dsError)
    throw dsError
  }
  
  console.log("Created dataset with ID:", dataset.id)

  // Upload file to storage
  const storagePath = `user_${user.id}/dataset_${dataset.id}.csv`
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

  // Update dataset with actual path
  const { data: updatedDataset, error: updateErr } = await supabase
    .from('datasets')
    .update({
      file_path: storagePath,
      upload_status: 'uploaded'
    })
    .eq('id', dataset.id)
    .select()
    .single()
  
  if (updateErr) {
    console.error("Error updating dataset:", updateErr)
    throw updateErr
  }

  console.log("Dataset updated successfully!")
  return updatedDataset
}

// Step 3 — Save column mapping
export async function saveColumnMapping(
  datasetId: string,
  mapping: Record<string, string>,
  columnInfos: ColumnInfo[]
) {
  // Create a map of original name to data type
  const dataTypeMap = columnInfos.reduce((acc, col) => {
    acc[col.name] = col.dataType
    return acc
  }, {} as Record<string, string>)

  const rows = Object.entries(mapping).map(([original, mapped]) => ({
    dataset_id: datasetId,
    original_name: original,
    mapped_name: mapped,
    data_type: dataTypeMap[original] || 'text'
  }))

  console.log("Inserting mapped columns:", rows)
  const { error } = await supabase
    .from('dataset_columns')
    .insert(rows)

  if (error) {
    console.error("Error inserting mapped columns:", error)
    throw error
  }
}

// Step 4 — Create forecast run
export async function createForecastRun(
  datasetId: string,
  model: string,
  horizon: number
) {
  const { data, error } = await supabase
    .from('forecast_runs')
    .insert({
      dataset_id: datasetId,
      model_name: model,
      horizon: horizon,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating forecast run:", error)
    throw error
  }
  return data
}

// Step 5 — Trigger Python ML service
export async function triggerMLService(runId: string) {
  console.log("Triggering ML service for run:", runId)
  try {
    const res = await fetch(
      `http://localhost:8000/api/v1/forecast/run/${runId}`,
      { method: 'POST' }
    )
    console.log("ML service response status:", res.status)
    return await res.json()
  } catch (error) {
    console.error("Error triggering ML service:", error)
    // Don't throw, just log—ML service might be offline for now
    return { success: false, error: "ML service unavailable" }
  }
}

// Step 6 — Get run results
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

// Step 7 — Get history
export async function getHistory() {
  const { data, error } = await supabase
    .from('forecast_runs')
    .select('*')
    .order('started_at', { ascending: false })

  if (error) throw error
  return data
}
