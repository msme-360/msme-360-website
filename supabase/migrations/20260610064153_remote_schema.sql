
  create table "public"."dataset_columns" (
    "id" uuid not null default gen_random_uuid(),
    "dataset_id" uuid,
    "original_name" text,
    "mapped_name" text,
    "data_type" text
      );


alter table "public"."dataset_columns" enable row level security;


  create table "public"."datasets" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "file_name" text not null,
    "file_path" text not null,
    "upload_status" text default 'uploaded'::text,
    "row_count" integer,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."datasets" enable row level security;


  create table "public"."forecast_metrics" (
    "id" uuid not null default gen_random_uuid(),
    "run_id" uuid,
    "mae" numeric,
    "rmse" numeric,
    "mape" numeric
      );


alter table "public"."forecast_metrics" enable row level security;


  create table "public"."forecast_outputs" (
    "id" uuid not null default gen_random_uuid(),
    "run_id" uuid,
    "forecast_date" date,
    "entity_name" text,
    "actual_value" numeric,
    "predicted_value" numeric,
    "lower_bound" numeric,
    "upper_bound" numeric
      );


alter table "public"."forecast_outputs" enable row level security;


  create table "public"."forecast_runs" (
    "id" uuid not null default gen_random_uuid(),
    "dataset_id" uuid,
    "forecast_level" text,
    "horizon" integer default 7,
    "status" text default 'pending'::text,
    "model_name" text,
    "started_at" timestamp with time zone default now(),
    "completed_at" timestamp with time zone
      );


alter table "public"."forecast_runs" enable row level security;

CREATE UNIQUE INDEX dataset_columns_pkey ON public.dataset_columns USING btree (id);

CREATE UNIQUE INDEX datasets_pkey ON public.datasets USING btree (id);

CREATE UNIQUE INDEX forecast_metrics_pkey ON public.forecast_metrics USING btree (id);

CREATE UNIQUE INDEX forecast_outputs_pkey ON public.forecast_outputs USING btree (id);

CREATE UNIQUE INDEX forecast_runs_pkey ON public.forecast_runs USING btree (id);

alter table "public"."dataset_columns" add constraint "dataset_columns_pkey" PRIMARY KEY using index "dataset_columns_pkey";

alter table "public"."datasets" add constraint "datasets_pkey" PRIMARY KEY using index "datasets_pkey";

alter table "public"."forecast_metrics" add constraint "forecast_metrics_pkey" PRIMARY KEY using index "forecast_metrics_pkey";

alter table "public"."forecast_outputs" add constraint "forecast_outputs_pkey" PRIMARY KEY using index "forecast_outputs_pkey";

alter table "public"."forecast_runs" add constraint "forecast_runs_pkey" PRIMARY KEY using index "forecast_runs_pkey";

alter table "public"."dataset_columns" add constraint "dataset_columns_dataset_id_fkey" FOREIGN KEY (dataset_id) REFERENCES public.datasets(id) not valid;

alter table "public"."dataset_columns" validate constraint "dataset_columns_dataset_id_fkey";

alter table "public"."datasets" add constraint "datasets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."datasets" validate constraint "datasets_user_id_fkey";

alter table "public"."forecast_metrics" add constraint "forecast_metrics_run_id_fkey" FOREIGN KEY (run_id) REFERENCES public.forecast_runs(id) not valid;

alter table "public"."forecast_metrics" validate constraint "forecast_metrics_run_id_fkey";

alter table "public"."forecast_outputs" add constraint "forecast_outputs_run_id_fkey" FOREIGN KEY (run_id) REFERENCES public.forecast_runs(id) not valid;

alter table "public"."forecast_outputs" validate constraint "forecast_outputs_run_id_fkey";

alter table "public"."forecast_runs" add constraint "forecast_runs_dataset_id_fkey" FOREIGN KEY (dataset_id) REFERENCES public.datasets(id) not valid;

alter table "public"."forecast_runs" validate constraint "forecast_runs_dataset_id_fkey";

grant delete on table "public"."dataset_columns" to "anon";

grant insert on table "public"."dataset_columns" to "anon";

grant references on table "public"."dataset_columns" to "anon";

grant select on table "public"."dataset_columns" to "anon";

grant trigger on table "public"."dataset_columns" to "anon";

grant truncate on table "public"."dataset_columns" to "anon";

grant update on table "public"."dataset_columns" to "anon";

grant delete on table "public"."dataset_columns" to "authenticated";

grant insert on table "public"."dataset_columns" to "authenticated";

grant references on table "public"."dataset_columns" to "authenticated";

grant select on table "public"."dataset_columns" to "authenticated";

grant trigger on table "public"."dataset_columns" to "authenticated";

grant truncate on table "public"."dataset_columns" to "authenticated";

grant update on table "public"."dataset_columns" to "authenticated";

grant delete on table "public"."dataset_columns" to "service_role";

grant insert on table "public"."dataset_columns" to "service_role";

grant references on table "public"."dataset_columns" to "service_role";

grant select on table "public"."dataset_columns" to "service_role";

grant trigger on table "public"."dataset_columns" to "service_role";

grant truncate on table "public"."dataset_columns" to "service_role";

grant update on table "public"."dataset_columns" to "service_role";

grant delete on table "public"."datasets" to "anon";

grant insert on table "public"."datasets" to "anon";

grant references on table "public"."datasets" to "anon";

grant select on table "public"."datasets" to "anon";

grant trigger on table "public"."datasets" to "anon";

grant truncate on table "public"."datasets" to "anon";

grant update on table "public"."datasets" to "anon";

grant delete on table "public"."datasets" to "authenticated";

grant insert on table "public"."datasets" to "authenticated";

grant references on table "public"."datasets" to "authenticated";

grant select on table "public"."datasets" to "authenticated";

grant trigger on table "public"."datasets" to "authenticated";

grant truncate on table "public"."datasets" to "authenticated";

grant update on table "public"."datasets" to "authenticated";

grant delete on table "public"."datasets" to "service_role";

grant insert on table "public"."datasets" to "service_role";

grant references on table "public"."datasets" to "service_role";

grant select on table "public"."datasets" to "service_role";

grant trigger on table "public"."datasets" to "service_role";

grant truncate on table "public"."datasets" to "service_role";

grant update on table "public"."datasets" to "service_role";

grant delete on table "public"."forecast_metrics" to "anon";

grant insert on table "public"."forecast_metrics" to "anon";

grant references on table "public"."forecast_metrics" to "anon";

grant select on table "public"."forecast_metrics" to "anon";

grant trigger on table "public"."forecast_metrics" to "anon";

grant truncate on table "public"."forecast_metrics" to "anon";

grant update on table "public"."forecast_metrics" to "anon";

grant delete on table "public"."forecast_metrics" to "authenticated";

grant insert on table "public"."forecast_metrics" to "authenticated";

grant references on table "public"."forecast_metrics" to "authenticated";

grant select on table "public"."forecast_metrics" to "authenticated";

grant trigger on table "public"."forecast_metrics" to "authenticated";

grant truncate on table "public"."forecast_metrics" to "authenticated";

grant update on table "public"."forecast_metrics" to "authenticated";

grant delete on table "public"."forecast_metrics" to "service_role";

grant insert on table "public"."forecast_metrics" to "service_role";

grant references on table "public"."forecast_metrics" to "service_role";

grant select on table "public"."forecast_metrics" to "service_role";

grant trigger on table "public"."forecast_metrics" to "service_role";

grant truncate on table "public"."forecast_metrics" to "service_role";

grant update on table "public"."forecast_metrics" to "service_role";

grant delete on table "public"."forecast_outputs" to "anon";

grant insert on table "public"."forecast_outputs" to "anon";

grant references on table "public"."forecast_outputs" to "anon";

grant select on table "public"."forecast_outputs" to "anon";

grant trigger on table "public"."forecast_outputs" to "anon";

grant truncate on table "public"."forecast_outputs" to "anon";

grant update on table "public"."forecast_outputs" to "anon";

grant delete on table "public"."forecast_outputs" to "authenticated";

grant insert on table "public"."forecast_outputs" to "authenticated";

grant references on table "public"."forecast_outputs" to "authenticated";

grant select on table "public"."forecast_outputs" to "authenticated";

grant trigger on table "public"."forecast_outputs" to "authenticated";

grant truncate on table "public"."forecast_outputs" to "authenticated";

grant update on table "public"."forecast_outputs" to "authenticated";

grant delete on table "public"."forecast_outputs" to "service_role";

grant insert on table "public"."forecast_outputs" to "service_role";

grant references on table "public"."forecast_outputs" to "service_role";

grant select on table "public"."forecast_outputs" to "service_role";

grant trigger on table "public"."forecast_outputs" to "service_role";

grant truncate on table "public"."forecast_outputs" to "service_role";

grant update on table "public"."forecast_outputs" to "service_role";

grant delete on table "public"."forecast_runs" to "anon";

grant insert on table "public"."forecast_runs" to "anon";

grant references on table "public"."forecast_runs" to "anon";

grant select on table "public"."forecast_runs" to "anon";

grant trigger on table "public"."forecast_runs" to "anon";

grant truncate on table "public"."forecast_runs" to "anon";

grant update on table "public"."forecast_runs" to "anon";

grant delete on table "public"."forecast_runs" to "authenticated";

grant insert on table "public"."forecast_runs" to "authenticated";

grant references on table "public"."forecast_runs" to "authenticated";

grant select on table "public"."forecast_runs" to "authenticated";

grant trigger on table "public"."forecast_runs" to "authenticated";

grant truncate on table "public"."forecast_runs" to "authenticated";

grant update on table "public"."forecast_runs" to "authenticated";

grant delete on table "public"."forecast_runs" to "service_role";

grant insert on table "public"."forecast_runs" to "service_role";

grant references on table "public"."forecast_runs" to "service_role";

grant select on table "public"."forecast_runs" to "service_role";

grant trigger on table "public"."forecast_runs" to "service_role";

grant truncate on table "public"."forecast_runs" to "service_role";

grant update on table "public"."forecast_runs" to "service_role";


