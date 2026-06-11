import { supabase } from '@/services/supabase/supabase'

// Step 1 — Upload file to storage
export async function uploadFileToStorage(file: File) {
  const fileName = `${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from('forecast-uploads')
    .upload(fileName, file)

  if (error) throw error
  return data.path
}

// Step 2 — Save dataset record
export async function saveDataset(
  fileName: string,
  filePath: string,
  rowCount: number
) {
  // Get logged in user for RLS
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  const { data, error } = await supabase
    .from('datasets')
    .insert({
      user_id: user.id,
      file_name: fileName,
      file_path: filePath,
      upload_status: 'uploaded',
      row_count: rowCount
    })
    .select()
    .single()

  if (error) throw error
  return data
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