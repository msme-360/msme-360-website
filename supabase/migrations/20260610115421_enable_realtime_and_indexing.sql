BEGIN;

-- 1. Realtime Replication Infrastructure Configuration
-- Ensure the standard supabase_realtime publication exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

-- Set REPLICA IDENTITY FULL for forecast_runs to broadcast full row states to Next.js clients
ALTER TABLE "public"."forecast_runs" REPLICA IDENTITY FULL;

-- Add the table cleanly into the publication channel
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."forecast_runs";

-- 2. Query-Optimized Performance Indexing
-- indexing foreign keys and frequently filtered columns for high-performance joins and queries

-- Dataset Columns: Optimized for dataset relationship lookup
CREATE INDEX IF NOT EXISTS idx_dataset_columns_dataset_id ON "public"."dataset_columns" USING btree ("dataset_id");

-- Forecast Runs: Optimized for status monitoring and dataset retrieval
CREATE INDEX IF NOT EXISTS idx_forecast_runs_dataset_id ON "public"."forecast_runs" USING btree ("dataset_id");
CREATE INDEX IF NOT EXISTS idx_forecast_runs_status ON "public"."forecast_runs" USING btree ("status");

-- Forecast Metrics: Optimized for run results compilation
CREATE INDEX IF NOT EXISTS idx_forecast_metrics_run_id ON "public"."forecast_metrics" USING btree ("run_id");

-- Forecast Outputs: Optimized for entity-based visualization and bulk retrieval
CREATE INDEX IF NOT EXISTS idx_forecast_outputs_run_id ON "public"."forecast_outputs" USING btree ("run_id");
CREATE INDEX IF NOT EXISTS idx_forecast_outputs_entity_name ON "public"."forecast_outputs" USING btree ("entity_name");

COMMIT;