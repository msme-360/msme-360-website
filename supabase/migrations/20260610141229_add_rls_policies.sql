BEGIN;

-- --- 1. datasets RLS Policies ---
ALTER TABLE "public"."datasets" ENABLE ROW LEVEL SECURITY;

-- Create composite ALL policy since all operations use same auth.uid() check
CREATE POLICY "Authenticated users own their datasets"
ON "public"."datasets"
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- --- 2. dataset_columns RLS Policies ---
ALTER TABLE "public"."dataset_columns" ENABLE ROW LEVEL SECURITY;

-- SELECT, INSERT, DELETE for dataset_columns linked to user's datasets
CREATE POLICY "Authenticated users manage their dataset columns"
ON "public"."dataset_columns"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM datasets
    WHERE datasets.id = dataset_columns.dataset_id
    AND datasets.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM datasets
    WHERE datasets.id = dataset_columns.dataset_id
    AND datasets.user_id = auth.uid()
  )
);

-- --- 3. forecast_runs RLS Policies ---
ALTER TABLE "public"."forecast_runs" ENABLE ROW LEVEL SECURITY;

-- SELECT, INSERT, UPDATE for forecast runs linked to user's datasets
CREATE POLICY "Authenticated users manage their forecast runs"
ON "public"."forecast_runs"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM datasets
    WHERE datasets.id = forecast_runs.dataset_id
    AND datasets.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM datasets
    WHERE datasets.id = forecast_runs.dataset_id
    AND datasets.user_id = auth.uid()
  )
);

-- --- 4. forecast_metrics RLS Policies ---
ALTER TABLE "public"."forecast_metrics" ENABLE ROW LEVEL SECURITY;

-- Read-only access for forecast metrics linked to user's runs
CREATE POLICY "Authenticated users read their forecast metrics"
ON "public"."forecast_metrics"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM forecast_runs
    INNER JOIN datasets ON datasets.id = forecast_runs.dataset_id
    WHERE forecast_runs.id = forecast_metrics.run_id
    AND datasets.user_id = auth.uid()
  )
);

-- --- 5. forecast_outputs RLS Policies ---
ALTER TABLE "public"."forecast_outputs" ENABLE ROW LEVEL SECURITY;

-- Read-only access for forecast outputs linked to user's runs
CREATE POLICY "Authenticated users read their forecast outputs"
ON "public"."forecast_outputs"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM forecast_runs
    INNER JOIN datasets ON datasets.id = forecast_runs.dataset_id
    WHERE forecast_runs.id = forecast_outputs.run_id
    AND datasets.user_id = auth.uid()
  )
);

COMMIT;