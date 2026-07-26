BEGIN;

-- 1. Drop the old generic, structured columns safely
ALTER TABLE "public"."forecast_outputs" DROP COLUMN IF EXISTS "entity_name";
ALTER TABLE "public"."forecast_outputs" DROP COLUMN IF EXISTS "actual_value";

-- 2. Add the specific multi-dimensional columns required by the model output spec
ALTER TABLE "public"."forecast_outputs" ADD COLUMN "store_id" TEXT NOT NULL;
ALTER TABLE "public"."forecast_outputs" ADD COLUMN "category" TEXT NOT NULL;
ALTER TABLE "public"."forecast_outputs" ADD COLUMN "region" TEXT NOT NULL;

-- 3. Ensure naming metrics match precisely with our bounds definitions
-- predicted_value remains, matching predicted_units cast as a numeric/float type
COMMENT ON COLUMN "public"."forecast_outputs"."predicted_value" IS 'Maps to predicted_units from the ML model output matrix';

-- 4. Re-create high-performance performance compound indexes for fast charts loading
DROP INDEX IF EXISTS idx_forecast_outputs_entity_name;
CREATE INDEX IF NOT EXISTS idx_forecast_outputs_lookup 
ON "public"."forecast_outputs" USING btree ("run_id", "region", "category", "store_id");

COMMIT;