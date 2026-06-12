-- Grant access to the realtime schema extensions to your client roles
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO anon;

-- Grant select privileges explicitly on the table to the replication roles
GRANT SELECT ON public.forecast_runs TO authenticated;
GRANT SELECT ON public.forecast_runs TO anon;