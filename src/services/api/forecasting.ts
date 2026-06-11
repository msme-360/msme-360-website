import { supabase } from '@/services/supabase/supabase'

// Step 1 & 2 — Create dataset and upload file to storage
export async function uploadFileToStorageAndSaveDataset(file: File) {
  // Get logged in user for RLS
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")
  
  // First create dataset record without file_path
  const { data: dataset, error: dsError } = await supabase
    .from('datasets')
    .insert({
      user_id: user.id,
      file_name: file.name,
      file_path: '', // temporary
      upload_status: 'uploading',
      row_count: 0
    })
    .select()
    .single()
  if (dsError) throw dsError
  
  // Now construct the storage path
  const storagePath = `user_${user.id}/dataset_${dataset.id}.csv`
  
  // Upload to datasets bucket
  const { error: storageError } = await supabase.storage
    .from('datasets')
    .upload(storagePath, file)

  if (storageError) throw storageError
  
  // Update dataset with actual file_path
  const { data: updatedDataset, error: updateErr } = await supabase
    .from('datasets')
    .update({
      file_path: storagePath,
      upload_status: 'uploaded'
    })
    .eq('id', dataset.id)
    .select()
    .single()
  
  if (updateErr) throw updateErr
  return updatedDataset
}

// Step 3 — Save column mapping
export async function saveColumnMapping(
  datasetId: string,
  mapping: Record<string, string>
) {
  const rows = Object.entries(mapping).map(([original, mapped]) => ({
    dataset_id: datasetId,
    original_name: original,
    mapped_name: mapped,
    data_type: 'text'
  }))

  const { error } = await supabase
    .from('dataset_columns')
    .insert(rows)

  if (error) throw error
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

  if (error) throw error
  return data
}

// Step 5 — Trigger Python ML service
// Python only needs run_id in URL
// It reads everything else from Supabase directly
export async function triggerMLService(runId: string) {
  const res = await fetch(
    `http://localhost:8000/api/v1/forecast/run/${runId}`,
    { method: 'POST' }
  )
  return res.json()
}

// Step 6 — Poll run status
export async function getRunStatus(runId: string) {
  const { data, error } = await supabase
    .from('forecast_runs')
    .select('status')
    .eq('id', runId)
    .single()

  if (error) throw error
  return data.status
}

// Step 7 — Get results
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

// Step 8 — Get history
export async function getHistory() {
  const { data, error } = await supabase
    .from('forecast_runs')
    .select('*')
    .order('started_at', { ascending: false })

  if (error) throw error
  return data
}