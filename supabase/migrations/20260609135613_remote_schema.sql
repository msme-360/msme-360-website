drop extension if exists "pg_net";

create schema if not exists "internal";

create sequence "public"."debug_logs_id_seq";


  create table "public"."ai_services" (
    "id" text not null,
    "title_key" text not null,
    "description_key" text not null,
    "type_key" text not null,
    "icon_name" text not null,
    "status" text default 'active'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."ai_services" enable row level security;


  create table "public"."announcements" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "content" text not null,
    "type" text default 'General'::text,
    "author_id" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."announcements" enable row level security;


  create table "public"."attendance_logs" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "check_in" timestamp with time zone not null default now(),
    "check_out" timestamp with time zone,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."attendance_logs" enable row level security;


  create table "public"."board_resolutions" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "author_id" uuid,
    "level" text default 'Normal'::text,
    "status" text default 'Active'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."board_resolutions" enable row level security;


  create table "public"."career_roles" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "title" text not null,
    "type" text not null,
    "posted_at" timestamp with time zone default now(),
    "total_openings" integer default 1,
    "deadline" timestamp with time zone,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."career_roles" enable row level security;


  create table "public"."career_testimonials" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "role" text not null,
    "image" text,
    "linkedin" text,
    "content" text not null,
    "size" text default 'medium'::text,
    "rating" numeric(2,1) default 5.0,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."career_testimonials" enable row level security;


  create table "public"."commendations" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "mentor_id" uuid,
    "category" text,
    "reason" text not null,
    "points" integer default 0,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."commendations" enable row level security;


  create table "public"."community_posts" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "founder_name" text not null,
    "company_name" text not null,
    "content" text not null,
    "category" text not null,
    "type" text default 'Sparkles'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."community_posts" enable row level security;


  create table "public"."compliance_tasks" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "task_name" text not null,
    "due_date" text not null,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."compliance_tasks" enable row level security;


  create table "public"."corporate_policies" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "category" text not null,
    "version" text default '1.0.0'::text,
    "status" text default 'draft'::text,
    "content" text not null,
    "effective_date" date default CURRENT_DATE,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."corporate_policies" enable row level security;


  create table "public"."debug_logs" (
    "id" integer not null default nextval('public.debug_logs_id_seq'::regclass),
    "msg" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."debug_logs" enable row level security;


  create table "public"."gtm_campaigns" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "title" text not null,
    "status" text default 'Draft'::text,
    "roadmap_data" jsonb default '[]'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."gtm_campaigns" enable row level security;


  create table "public"."gtm_templates" (
    "id" text not null,
    "type" text not null,
    "title_key" text not null,
    "content_template" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."gtm_templates" enable row level security;


  create table "public"."intern_application_metrics" (
    "id" uuid not null default gen_random_uuid(),
    "application_id" uuid,
    "evaluator_id" uuid,
    "evaluator_role" text not null,
    "metric_name" text not null,
    "score" integer,
    "comment" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."intern_application_metrics" enable row level security;


  create table "public"."intern_applications" (
    "id" uuid not null default gen_random_uuid(),
    "full_name" text not null,
    "email" text not null,
    "phone" text,
    "role" text not null,
    "experience_level" text,
    "university" text,
    "degree" text,
    "graduation_year" text,
    "availability_date" text,
    "links" jsonb default '[]'::jsonb,
    "commitment_confirmed" boolean default false,
    "expectations_confirmed" boolean default false,
    "attendance_confirmed" boolean default false,
    "status" text default 'pending'::text,
    "applied_at" timestamp with time zone default now(),
    "reviewed_at" timestamp with time zone,
    "reviewed_by" uuid,
    "desired_role" text,
    "metadata" jsonb default '{}'::jsonb,
    "is_archived" boolean default false
      );


alter table "public"."intern_applications" enable row level security;


  create table "public"."intern_onboarding_checklists" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "task_name" text not null,
    "category" text,
    "is_completed" boolean default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."intern_onboarding_checklists" enable row level security;


  create table "public"."leave_requests" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "type" text,
    "start_date" date,
    "end_date" date,
    "reason" text,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."leave_requests" enable row level security;


  create table "public"."mentorship_bookings" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "mentee_id" uuid,
    "mentor_name" text not null,
    "expertise" text not null,
    "scheduled_at" timestamp with time zone not null,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."mentorship_bookings" enable row level security;


  create table "public"."microai_interest" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "revenue_band" text not null,
    "data_readiness" text not null,
    "interested_capabilities" text[] not null,
    "comments" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."microai_interest" enable row level security;


  create table "public"."nic_codes" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "code" text not null,
    "category" text not null,
    "description" text not null,
    "subtext" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."nic_codes" enable row level security;


  create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "content" text not null,
    "type" text default 'info'::text,
    "is_read" boolean default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."notifications" enable row level security;


  create table "public"."performance_metrics" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "reviewer_id" uuid,
    "productivity_score" integer default 0,
    "quality_score" integer default 0,
    "leadership_score" integer default 0,
    "period_start" date not null,
    "period_end" date not null,
    "comments" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."performance_metrics" enable row level security;


  create table "public"."platform_metrics" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "category" text not null,
    "label" text not null,
    "value" text not null,
    "change" text,
    "status" text default 'Optimal'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."platform_metrics" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "full_name" text,
    "company_name" text,
    "email" text,
    "role" text not null default 'user'::text,
    "department" text default 'External'::text,
    "career_level" text default 'L1'::text,
    "designation" text default 'Associate'::text,
    "manager_id" uuid,
    "phone" text,
    "bio" text,
    "linkedin_url" text,
    "avatar_url" text,
    "is_verified" boolean default false,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."profiles" enable row level security;


  create table "public"."promotion_pipeline" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "current_level" text not null,
    "target_level" text not null,
    "status" text default 'Under Review'::text,
    "nominated_by" uuid,
    "justification" text,
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."promotion_pipeline" enable row level security;


  create table "public"."schemes" (
    "id" text not null,
    "title" text not null,
    "description" text not null,
    "subsidy" text,
    "category" text,
    "url" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."schemes" enable row level security;


  create table "public"."service_health" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" text not null,
    "status" text default 'Healthy'::text,
    "load_percentage" integer default 0,
    "uptime_percentage" numeric(5,2) default 100.00,
    "last_ping" timestamp with time zone default now()
      );


alter table "public"."service_health" enable row level security;


  create table "public"."support_tickets" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "subject" text not null,
    "message" text not null,
    "category" text not null,
    "status" text default 'open'::text,
    "resolved_by" uuid,
    "closed_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."support_tickets" enable row level security;


  create table "public"."system_logs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "action" text not null,
    "target" text,
    "status" text default 'success'::text,
    "user_id" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."system_logs" enable row level security;


  create table "public"."task_comments" (
    "id" uuid not null default gen_random_uuid(),
    "task_id" uuid not null,
    "user_id" uuid not null,
    "comment" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."task_comments" enable row level security;


  create table "public"."task_logs" (
    "id" uuid not null default gen_random_uuid(),
    "task_id" uuid not null,
    "actor_id" uuid not null,
    "action" text not null,
    "old_status" text,
    "new_status" text,
    "comment" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."task_logs" enable row level security;


  create table "public"."tasks" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "user_id" uuid,
    "assigned_to" uuid,
    "assigned_by" uuid,
    "status" text default 'pending'::text,
    "priority" text default 'Medium'::text,
    "due_date" timestamp with time zone,
    "proof_of_work" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."tasks" enable row level security;


  create table "public"."team_members" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "full_name" text not null,
    "role_key" text not null,
    "status" text default 'active'::text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."team_members" enable row level security;


  create table "public"."tenders" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "agency" text not null,
    "title" text not null,
    "sector" text not null,
    "location" text not null,
    "value" text,
    "value_text" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."tenders" enable row level security;


  create table "public"."user_progress" (
    "user_id" uuid not null,
    "module_name" text not null default 'formalization'::text,
    "step_index" integer not null,
    "is_completed" boolean default false,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."user_progress" enable row level security;


  create table "public"."user_settings" (
    "user_id" uuid not null,
    "theme" text default 'system'::text,
    "notification_prefs" jsonb default '{"growth": true, "security": true, "community": true, "compliance": true}'::jsonb,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."user_settings" enable row level security;


  create table "public"."weekly_reflections" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "wins" text,
    "challenges" text,
    "satisfaction" integer,
    "week_ending" timestamp with time zone,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."weekly_reflections" enable row level security;

alter sequence "public"."debug_logs_id_seq" owned by "public"."debug_logs"."id";

CREATE UNIQUE INDEX ai_services_pkey ON public.ai_services USING btree (id);

CREATE UNIQUE INDEX announcements_pkey ON public.announcements USING btree (id);

CREATE UNIQUE INDEX attendance_logs_pkey ON public.attendance_logs USING btree (id);

CREATE UNIQUE INDEX board_resolutions_pkey ON public.board_resolutions USING btree (id);

CREATE UNIQUE INDEX career_roles_pkey ON public.career_roles USING btree (id);

CREATE UNIQUE INDEX career_roles_slug_key ON public.career_roles USING btree (slug);

CREATE UNIQUE INDEX career_testimonials_pkey ON public.career_testimonials USING btree (id);

CREATE UNIQUE INDEX commendations_pkey ON public.commendations USING btree (id);

CREATE UNIQUE INDEX community_posts_pkey ON public.community_posts USING btree (id);

CREATE UNIQUE INDEX compliance_tasks_pkey ON public.compliance_tasks USING btree (id);

CREATE UNIQUE INDEX corporate_policies_pkey ON public.corporate_policies USING btree (id);

CREATE UNIQUE INDEX debug_logs_pkey ON public.debug_logs USING btree (id);

CREATE UNIQUE INDEX gtm_campaigns_pkey ON public.gtm_campaigns USING btree (id);

CREATE UNIQUE INDEX gtm_templates_pkey ON public.gtm_templates USING btree (id);

CREATE INDEX idx_announcements_author_id ON public.announcements USING btree (author_id);

CREATE UNIQUE INDEX idx_announcements_title ON public.announcements USING btree (title);

CREATE INDEX idx_attend_logs_user_id ON public.attendance_logs USING btree (user_id);

CREATE INDEX idx_career_roles_slug ON public.career_roles USING btree (slug);

CREATE INDEX idx_commendations_mentor_id ON public.commendations USING btree (mentor_id);

CREATE INDEX idx_commendations_user_id ON public.commendations USING btree (user_id);

CREATE INDEX idx_community_posts_user_id ON public.community_posts USING btree (user_id);

CREATE INDEX idx_comp_tasks_user_id ON public.compliance_tasks USING btree (user_id);

CREATE INDEX idx_gtm_campaigns_user_id ON public.gtm_campaigns USING btree (user_id);

CREATE INDEX idx_intern_apps_email ON public.intern_applications USING btree (email);

CREATE INDEX idx_intern_apps_reviewed_by ON public.intern_applications USING btree (reviewed_by);

CREATE INDEX idx_leave_requests_user_id ON public.leave_requests USING btree (user_id);

CREATE INDEX idx_mentorship_mentee_id ON public.mentorship_bookings USING btree (mentee_id);

CREATE INDEX idx_metrics_category ON public.platform_metrics USING btree (category);

CREATE INDEX idx_metrics_evaluator_id ON public.intern_application_metrics USING btree (evaluator_id);

CREATE INDEX idx_microai_interest_user_id ON public.microai_interest USING btree (user_id);

CREATE INDEX idx_notifs_user_id ON public.notifications USING btree (user_id);

CREATE INDEX idx_onboarding_user_id ON public.intern_onboarding_checklists USING btree (user_id);

CREATE INDEX idx_perf_metrics_reviewer_id ON public.performance_metrics USING btree (reviewer_id);

CREATE INDEX idx_perf_metrics_user_id ON public.performance_metrics USING btree (user_id);

CREATE UNIQUE INDEX idx_platform_metrics_unique ON public.platform_metrics USING btree (category, label);

CREATE INDEX idx_profiles_manager_id ON public.profiles USING btree (manager_id);

CREATE INDEX idx_profiles_role ON public.profiles USING btree (role);

CREATE INDEX idx_promo_pipeline_nominated_by ON public.promotion_pipeline USING btree (nominated_by);

CREATE INDEX idx_promo_pipeline_user_id ON public.promotion_pipeline USING btree (user_id);

CREATE INDEX idx_resolutions_author_id ON public.board_resolutions USING btree (author_id);

CREATE UNIQUE INDEX idx_service_health_name ON public.service_health USING btree (name);

CREATE INDEX idx_support_tickets_resolved_by ON public.support_tickets USING btree (resolved_by);

CREATE INDEX idx_support_tickets_user_id ON public.support_tickets USING btree (user_id);

CREATE INDEX idx_system_logs_user_id ON public.system_logs USING btree (user_id);

CREATE INDEX idx_task_comments_task_id ON public.task_comments USING btree (task_id);

CREATE INDEX idx_task_comments_user_id ON public.task_comments USING btree (user_id);

CREATE INDEX idx_task_logs_actor_id ON public.task_logs USING btree (actor_id);

CREATE INDEX idx_task_logs_task_id ON public.task_logs USING btree (task_id);

CREATE INDEX idx_tasks_assigned_by ON public.tasks USING btree (assigned_by);

CREATE INDEX idx_tasks_assigned_to ON public.tasks USING btree (assigned_to);

CREATE INDEX idx_tasks_user_id ON public.tasks USING btree (user_id);

CREATE INDEX idx_team_members_user_id ON public.team_members USING btree (user_id);

CREATE UNIQUE INDEX idx_tenders_agency_title ON public.tenders USING btree (agency, title);

CREATE UNIQUE INDEX idx_testimonials_name ON public.career_testimonials USING btree (name);

CREATE INDEX idx_user_progress_user_id ON public.user_progress USING btree (user_id);

CREATE INDEX idx_weekly_reflections_user_id ON public.weekly_reflections USING btree (user_id);

CREATE UNIQUE INDEX intern_application_metrics_application_id_evaluator_role_me_key ON public.intern_application_metrics USING btree (application_id, evaluator_role, metric_name);

CREATE UNIQUE INDEX intern_application_metrics_pkey ON public.intern_application_metrics USING btree (id);

CREATE UNIQUE INDEX intern_applications_pkey ON public.intern_applications USING btree (id);

CREATE UNIQUE INDEX intern_onboarding_checklists_pkey ON public.intern_onboarding_checklists USING btree (id);

CREATE UNIQUE INDEX leave_requests_pkey ON public.leave_requests USING btree (id);

CREATE UNIQUE INDEX mentorship_bookings_pkey ON public.mentorship_bookings USING btree (id);

CREATE UNIQUE INDEX microai_interest_pkey ON public.microai_interest USING btree (id);

CREATE UNIQUE INDEX nic_codes_code_key ON public.nic_codes USING btree (code);

CREATE UNIQUE INDEX nic_codes_pkey ON public.nic_codes USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX performance_metrics_pkey ON public.performance_metrics USING btree (id);

CREATE UNIQUE INDEX platform_metrics_pkey ON public.platform_metrics USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX promotion_pipeline_pkey ON public.promotion_pipeline USING btree (id);

CREATE UNIQUE INDEX schemes_pkey ON public.schemes USING btree (id);

CREATE UNIQUE INDEX service_health_pkey ON public.service_health USING btree (id);

CREATE UNIQUE INDEX support_tickets_pkey ON public.support_tickets USING btree (id);

CREATE UNIQUE INDEX system_logs_pkey ON public.system_logs USING btree (id);

CREATE UNIQUE INDEX task_comments_pkey ON public.task_comments USING btree (id);

CREATE UNIQUE INDEX task_logs_pkey ON public.task_logs USING btree (id);

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

CREATE UNIQUE INDEX team_members_pkey ON public.team_members USING btree (id);

CREATE UNIQUE INDEX tenders_pkey ON public.tenders USING btree (id);

CREATE UNIQUE INDEX user_progress_pkey ON public.user_progress USING btree (user_id, module_name, step_index);

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (user_id);

CREATE UNIQUE INDEX weekly_reflections_pkey ON public.weekly_reflections USING btree (id);

alter table "public"."ai_services" add constraint "ai_services_pkey" PRIMARY KEY using index "ai_services_pkey";

alter table "public"."announcements" add constraint "announcements_pkey" PRIMARY KEY using index "announcements_pkey";

alter table "public"."attendance_logs" add constraint "attendance_logs_pkey" PRIMARY KEY using index "attendance_logs_pkey";

alter table "public"."board_resolutions" add constraint "board_resolutions_pkey" PRIMARY KEY using index "board_resolutions_pkey";

alter table "public"."career_roles" add constraint "career_roles_pkey" PRIMARY KEY using index "career_roles_pkey";

alter table "public"."career_testimonials" add constraint "career_testimonials_pkey" PRIMARY KEY using index "career_testimonials_pkey";

alter table "public"."commendations" add constraint "commendations_pkey" PRIMARY KEY using index "commendations_pkey";

alter table "public"."community_posts" add constraint "community_posts_pkey" PRIMARY KEY using index "community_posts_pkey";

alter table "public"."compliance_tasks" add constraint "compliance_tasks_pkey" PRIMARY KEY using index "compliance_tasks_pkey";

alter table "public"."corporate_policies" add constraint "corporate_policies_pkey" PRIMARY KEY using index "corporate_policies_pkey";

alter table "public"."debug_logs" add constraint "debug_logs_pkey" PRIMARY KEY using index "debug_logs_pkey";

alter table "public"."gtm_campaigns" add constraint "gtm_campaigns_pkey" PRIMARY KEY using index "gtm_campaigns_pkey";

alter table "public"."gtm_templates" add constraint "gtm_templates_pkey" PRIMARY KEY using index "gtm_templates_pkey";

alter table "public"."intern_application_metrics" add constraint "intern_application_metrics_pkey" PRIMARY KEY using index "intern_application_metrics_pkey";

alter table "public"."intern_applications" add constraint "intern_applications_pkey" PRIMARY KEY using index "intern_applications_pkey";

alter table "public"."intern_onboarding_checklists" add constraint "intern_onboarding_checklists_pkey" PRIMARY KEY using index "intern_onboarding_checklists_pkey";

alter table "public"."leave_requests" add constraint "leave_requests_pkey" PRIMARY KEY using index "leave_requests_pkey";

alter table "public"."mentorship_bookings" add constraint "mentorship_bookings_pkey" PRIMARY KEY using index "mentorship_bookings_pkey";

alter table "public"."microai_interest" add constraint "microai_interest_pkey" PRIMARY KEY using index "microai_interest_pkey";

alter table "public"."nic_codes" add constraint "nic_codes_pkey" PRIMARY KEY using index "nic_codes_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."performance_metrics" add constraint "performance_metrics_pkey" PRIMARY KEY using index "performance_metrics_pkey";

alter table "public"."platform_metrics" add constraint "platform_metrics_pkey" PRIMARY KEY using index "platform_metrics_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."promotion_pipeline" add constraint "promotion_pipeline_pkey" PRIMARY KEY using index "promotion_pipeline_pkey";

alter table "public"."schemes" add constraint "schemes_pkey" PRIMARY KEY using index "schemes_pkey";

alter table "public"."service_health" add constraint "service_health_pkey" PRIMARY KEY using index "service_health_pkey";

alter table "public"."support_tickets" add constraint "support_tickets_pkey" PRIMARY KEY using index "support_tickets_pkey";

alter table "public"."system_logs" add constraint "system_logs_pkey" PRIMARY KEY using index "system_logs_pkey";

alter table "public"."task_comments" add constraint "task_comments_pkey" PRIMARY KEY using index "task_comments_pkey";

alter table "public"."task_logs" add constraint "task_logs_pkey" PRIMARY KEY using index "task_logs_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."team_members" add constraint "team_members_pkey" PRIMARY KEY using index "team_members_pkey";

alter table "public"."tenders" add constraint "tenders_pkey" PRIMARY KEY using index "tenders_pkey";

alter table "public"."user_progress" add constraint "user_progress_pkey" PRIMARY KEY using index "user_progress_pkey";

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."weekly_reflections" add constraint "weekly_reflections_pkey" PRIMARY KEY using index "weekly_reflections_pkey";

alter table "public"."announcements" add constraint "announcements_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."announcements" validate constraint "announcements_author_id_fkey";

alter table "public"."attendance_logs" add constraint "attendance_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."attendance_logs" validate constraint "attendance_logs_user_id_fkey";

alter table "public"."board_resolutions" add constraint "board_resolutions_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."board_resolutions" validate constraint "board_resolutions_author_id_fkey";

alter table "public"."career_roles" add constraint "career_roles_slug_key" UNIQUE using index "career_roles_slug_key";

alter table "public"."commendations" add constraint "commendations_category_check" CHECK ((category = ANY (ARRAY['Tactical'::text, 'Innovation'::text, 'Culture'::text, 'Reliability'::text]))) not valid;

alter table "public"."commendations" validate constraint "commendations_category_check";

alter table "public"."commendations" add constraint "commendations_mentor_id_fkey" FOREIGN KEY (mentor_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."commendations" validate constraint "commendations_mentor_id_fkey";

alter table "public"."commendations" add constraint "commendations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."commendations" validate constraint "commendations_user_id_fkey";

alter table "public"."community_posts" add constraint "community_posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."community_posts" validate constraint "community_posts_user_id_fkey";

alter table "public"."compliance_tasks" add constraint "compliance_tasks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."compliance_tasks" validate constraint "compliance_tasks_user_id_fkey";

alter table "public"."corporate_policies" add constraint "corporate_policies_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'archived'::text]))) not valid;

alter table "public"."corporate_policies" validate constraint "corporate_policies_status_check";

alter table "public"."gtm_campaigns" add constraint "gtm_campaigns_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."gtm_campaigns" validate constraint "gtm_campaigns_user_id_fkey";

alter table "public"."intern_application_metrics" add constraint "intern_application_metrics_application_id_evaluator_role_me_key" UNIQUE using index "intern_application_metrics_application_id_evaluator_role_me_key";

alter table "public"."intern_application_metrics" add constraint "intern_application_metrics_application_id_fkey" FOREIGN KEY (application_id) REFERENCES public.intern_applications(id) ON DELETE CASCADE not valid;

alter table "public"."intern_application_metrics" validate constraint "intern_application_metrics_application_id_fkey";

alter table "public"."intern_application_metrics" add constraint "intern_application_metrics_evaluator_id_fkey" FOREIGN KEY (evaluator_id) REFERENCES public.profiles(id) not valid;

alter table "public"."intern_application_metrics" validate constraint "intern_application_metrics_evaluator_id_fkey";

alter table "public"."intern_application_metrics" add constraint "intern_application_metrics_score_check" CHECK (((score >= 0) AND (score <= 10))) not valid;

alter table "public"."intern_application_metrics" validate constraint "intern_application_metrics_score_check";

alter table "public"."intern_applications" add constraint "intern_applications_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) not valid;

alter table "public"."intern_applications" validate constraint "intern_applications_reviewed_by_fkey";

alter table "public"."intern_applications" add constraint "intern_applications_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'under_review'::text, 'shortlisted'::text, 'rejected'::text, 'hired'::text, 'onboarded'::text, 'contacted'::text]))) not valid;

alter table "public"."intern_applications" validate constraint "intern_applications_status_check";

alter table "public"."intern_onboarding_checklists" add constraint "intern_onboarding_checklists_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."intern_onboarding_checklists" validate constraint "intern_onboarding_checklists_user_id_fkey";

alter table "public"."leave_requests" add constraint "leave_requests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."leave_requests" validate constraint "leave_requests_user_id_fkey";

alter table "public"."mentorship_bookings" add constraint "mentorship_bookings_mentee_id_fkey" FOREIGN KEY (mentee_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."mentorship_bookings" validate constraint "mentorship_bookings_mentee_id_fkey";

alter table "public"."microai_interest" add constraint "microai_interest_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."microai_interest" validate constraint "microai_interest_user_id_fkey";

alter table "public"."nic_codes" add constraint "nic_codes_code_key" UNIQUE using index "nic_codes_code_key";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

alter table "public"."performance_metrics" add constraint "performance_metrics_reviewer_id_fkey" FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id) not valid;

alter table "public"."performance_metrics" validate constraint "performance_metrics_reviewer_id_fkey";

alter table "public"."performance_metrics" add constraint "performance_metrics_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."performance_metrics" validate constraint "performance_metrics_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_manager_id_fkey" FOREIGN KEY (manager_id) REFERENCES public.profiles(id) not valid;

alter table "public"."profiles" validate constraint "profiles_manager_id_fkey";

alter table "public"."promotion_pipeline" add constraint "promotion_pipeline_nominated_by_fkey" FOREIGN KEY (nominated_by) REFERENCES public.profiles(id) not valid;

alter table "public"."promotion_pipeline" validate constraint "promotion_pipeline_nominated_by_fkey";

alter table "public"."promotion_pipeline" add constraint "promotion_pipeline_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."promotion_pipeline" validate constraint "promotion_pipeline_user_id_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_resolved_by_fkey" FOREIGN KEY (resolved_by) REFERENCES public.profiles(id) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_resolved_by_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_status_check" CHECK ((status = ANY (ARRAY['open'::text, 'closed'::text, 'pending'::text]))) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_status_check";

alter table "public"."support_tickets" add constraint "support_tickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_user_id_fkey";

alter table "public"."system_logs" add constraint "system_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."system_logs" validate constraint "system_logs_user_id_fkey";

alter table "public"."task_comments" add constraint "task_comments_task_id_fkey" FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE not valid;

alter table "public"."task_comments" validate constraint "task_comments_task_id_fkey";

alter table "public"."task_comments" add constraint "task_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."task_comments" validate constraint "task_comments_user_id_fkey";

alter table "public"."task_logs" add constraint "task_logs_actor_id_fkey" FOREIGN KEY (actor_id) REFERENCES public.profiles(id) not valid;

alter table "public"."task_logs" validate constraint "task_logs_actor_id_fkey";

alter table "public"."task_logs" add constraint "task_logs_task_id_fkey" FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE not valid;

alter table "public"."task_logs" validate constraint "task_logs_task_id_fkey";

alter table "public"."tasks" add constraint "tasks_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES public.profiles(id) not valid;

alter table "public"."tasks" validate constraint "tasks_assigned_by_fkey";

alter table "public"."tasks" add constraint "tasks_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.profiles(id) not valid;

alter table "public"."tasks" validate constraint "tasks_assigned_to_fkey";

alter table "public"."tasks" add constraint "tasks_priority_check" CHECK ((priority = ANY (ARRAY['Low'::text, 'Medium'::text, 'High'::text, 'Urgent'::text]))) not valid;

alter table "public"."tasks" validate constraint "tasks_priority_check";

alter table "public"."tasks" add constraint "tasks_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'in_progress'::text, 'completed'::text, 'blocked'::text, 'Todo'::text]))) not valid;

alter table "public"."tasks" validate constraint "tasks_status_check";

alter table "public"."tasks" add constraint "tasks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."tasks" validate constraint "tasks_user_id_fkey";

alter table "public"."team_members" add constraint "team_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."team_members" validate constraint "team_members_user_id_fkey";

alter table "public"."user_progress" add constraint "user_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_progress" validate constraint "user_progress_user_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_user_id_fkey";

alter table "public"."weekly_reflections" add constraint "weekly_reflections_satisfaction_check" CHECK (((satisfaction >= 1) AND (satisfaction <= 5))) not valid;

alter table "public"."weekly_reflections" validate constraint "weekly_reflections_satisfaction_check";

alter table "public"."weekly_reflections" add constraint "weekly_reflections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."weekly_reflections" validate constraint "weekly_reflections_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION internal.check_user_status_logic(target_email text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  u_exists boolean;
  has_password boolean;
  hire_exists boolean;
BEGIN
  -- Check if user exists in auth.users and if they have a password set
  SELECT 
    EXISTS (SELECT 1 FROM auth.users WHERE pg_catalog.lower(email) = pg_catalog.lower(target_email)),
    EXISTS (SELECT 1 FROM auth.users WHERE pg_catalog.lower(email) = pg_catalog.lower(target_email) AND encrypted_password IS NOT NULL AND encrypted_password <> '')
  INTO u_exists, has_password;
  
  -- Check if hired/onboarded record exists in intern_applications
  SELECT EXISTS (
    SELECT 1 FROM public.intern_applications 
    WHERE pg_catalog.lower(email) = pg_catalog.lower(target_email) 
    AND (status = 'hired' OR status = 'onboarded')
  ) INTO hire_exists;

  IF u_exists AND has_password THEN
    RETURN 'active';
  ELSIF u_exists OR hire_exists THEN
    RETURN 'needs_activation';
  ELSE
    RETURN 'unknown';
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION internal.get_role_level(role_id text)
 RETURNS numeric
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
BEGIN
  RETURN CASE
    WHEN role_id IN ('super_admin', 'managing_partner', 'board_member') THEN 0
    WHEN role_id IN ('ceo', 'cto', 'cfo', 'coo', 'cmo', 'chro', 'cio') THEN 1
    WHEN role_id IN ('vp_engineering', 'vp_product', 'vp_operations', 'vp_marketing', 'vp_finance') THEN 1.5
    WHEN role_id IN ('director_engineering', 'director_product', 'director_operations', 'director_marketing', 'director_finance') THEN 2
    WHEN role_id IN ('hr_manager', 'recruiter', 'engineering_manager', 'product_manager', 'operations_manager') THEN 3
    WHEN role_id IN ('team_lead', 'project_lead', 'supervisor', 'coordinator') THEN 3.5
    WHEN role_id IN ('employee', 'analyst', 'software_engineer', 'marketing_specialist', 'financial_analyst') THEN 4
    WHEN role_id IN ('intern', 'associate', 'jr_developer', 'trainee') THEN 5
    ELSE 6
  END;
END;
$function$
;

CREATE OR REPLACE FUNCTION internal.get_user_role_level(user_id uuid)
 RETURNS numeric
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT internal.get_role_level(role) FROM public.profiles WHERE id = user_id;
$function$
;

CREATE OR REPLACE FUNCTION public.check_user_status(target_email text)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  RETURN internal.check_user_status_logic(target_email);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.decrement_opening_count(role_slug text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    UPDATE public.career_roles
    SET total_openings = pg_catalog.GREATEST(0, total_openings - 1)
    WHERE slug = role_slug;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_user()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  delete from auth.users where id = auth.uid();
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_user(target_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Only Super Admins and Board Members (Level 1) can delete users
  IF internal.get_user_role_level(auth.uid()) <= 1 THEN
    DELETE FROM auth.users WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Unauthorized: Insufficient privilege level for user deletion.';
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_role_by_id(user_id uuid)
 RETURNS TABLE(role text)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY SELECT p.role FROM public.profiles p WHERE p.id = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name, role, department, designation, career_level 
  )
  SELECT
    NEW.id,
    pg_catalog.lower(NEW.email),
    COALESCE(rec.full_name, NEW.raw_user_meta_data->>'full_name', 'MSME Member'::TEXT),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'::TEXT),
    COALESCE(NEW.raw_user_meta_data->>'department', 'Unassigned'::TEXT),
    COALESCE(rec.role, NEW.raw_user_meta_data->>'designation', 'Associate'::TEXT),
    COALESCE(NEW.raw_user_meta_data->>'career_level', 'L1'::TEXT)
  FROM (SELECT 1) d
  LEFT JOIN LATERAL (
    SELECT * FROM public.intern_applications 
    WHERE email = pg_catalog.lower(NEW.email) AND status = 'hired'
    ORDER BY applied_at DESC
    LIMIT 1
  ) rec ON TRUE
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    updated_at = pg_catalog.now();

  -- Seed onboarding checklist and first mission for interns
  IF (COALESCE(NEW.raw_user_meta_data->>'role', 'user'::TEXT) = 'intern') THEN
    INSERT INTO public.intern_onboarding_checklists (user_id, task_name, category)
    VALUES 
      (NEW.id, 'Complete Professional Profile', 'Account'),
      (NEW.id, 'Review Code of Conduct & NDA', 'Legal'),
      (NEW.id, 'Access Internal Tools & Slack', 'Infrastructure'),
      (NEW.id, 'Set Up Development Environment', 'Technical'),
      (NEW.id, 'First Mission Assignment', 'Operations');

    INSERT INTO public.tasks (user_id, assigned_to, assigned_by, title, description, priority, status)
    VALUES
      (NEW.id, NEW.id, NEW.id, 'Project Initialization Mission', 'Complete your setup and report to your assigned mentor for your first tactical mission.', 'High', 'Todo');
  END IF;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_support_resolution()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
        NEW.closed_at = pg_catalog.now();
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    NEW.updated_at = pg_catalog.now();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."ai_services" to "anon";

grant insert on table "public"."ai_services" to "anon";

grant references on table "public"."ai_services" to "anon";

grant select on table "public"."ai_services" to "anon";

grant trigger on table "public"."ai_services" to "anon";

grant truncate on table "public"."ai_services" to "anon";

grant update on table "public"."ai_services" to "anon";

grant delete on table "public"."ai_services" to "authenticated";

grant insert on table "public"."ai_services" to "authenticated";

grant references on table "public"."ai_services" to "authenticated";

grant select on table "public"."ai_services" to "authenticated";

grant trigger on table "public"."ai_services" to "authenticated";

grant truncate on table "public"."ai_services" to "authenticated";

grant update on table "public"."ai_services" to "authenticated";

grant delete on table "public"."ai_services" to "service_role";

grant insert on table "public"."ai_services" to "service_role";

grant references on table "public"."ai_services" to "service_role";

grant select on table "public"."ai_services" to "service_role";

grant trigger on table "public"."ai_services" to "service_role";

grant truncate on table "public"."ai_services" to "service_role";

grant update on table "public"."ai_services" to "service_role";

grant delete on table "public"."announcements" to "anon";

grant insert on table "public"."announcements" to "anon";

grant references on table "public"."announcements" to "anon";

grant select on table "public"."announcements" to "anon";

grant trigger on table "public"."announcements" to "anon";

grant truncate on table "public"."announcements" to "anon";

grant update on table "public"."announcements" to "anon";

grant delete on table "public"."announcements" to "authenticated";

grant insert on table "public"."announcements" to "authenticated";

grant references on table "public"."announcements" to "authenticated";

grant select on table "public"."announcements" to "authenticated";

grant trigger on table "public"."announcements" to "authenticated";

grant truncate on table "public"."announcements" to "authenticated";

grant update on table "public"."announcements" to "authenticated";

grant delete on table "public"."announcements" to "service_role";

grant insert on table "public"."announcements" to "service_role";

grant references on table "public"."announcements" to "service_role";

grant select on table "public"."announcements" to "service_role";

grant trigger on table "public"."announcements" to "service_role";

grant truncate on table "public"."announcements" to "service_role";

grant update on table "public"."announcements" to "service_role";

grant delete on table "public"."attendance_logs" to "anon";

grant insert on table "public"."attendance_logs" to "anon";

grant references on table "public"."attendance_logs" to "anon";

grant select on table "public"."attendance_logs" to "anon";

grant trigger on table "public"."attendance_logs" to "anon";

grant truncate on table "public"."attendance_logs" to "anon";

grant update on table "public"."attendance_logs" to "anon";

grant delete on table "public"."attendance_logs" to "authenticated";

grant insert on table "public"."attendance_logs" to "authenticated";

grant references on table "public"."attendance_logs" to "authenticated";

grant select on table "public"."attendance_logs" to "authenticated";

grant trigger on table "public"."attendance_logs" to "authenticated";

grant truncate on table "public"."attendance_logs" to "authenticated";

grant update on table "public"."attendance_logs" to "authenticated";

grant delete on table "public"."attendance_logs" to "service_role";

grant insert on table "public"."attendance_logs" to "service_role";

grant references on table "public"."attendance_logs" to "service_role";

grant select on table "public"."attendance_logs" to "service_role";

grant trigger on table "public"."attendance_logs" to "service_role";

grant truncate on table "public"."attendance_logs" to "service_role";

grant update on table "public"."attendance_logs" to "service_role";

grant delete on table "public"."board_resolutions" to "anon";

grant insert on table "public"."board_resolutions" to "anon";

grant references on table "public"."board_resolutions" to "anon";

grant select on table "public"."board_resolutions" to "anon";

grant trigger on table "public"."board_resolutions" to "anon";

grant truncate on table "public"."board_resolutions" to "anon";

grant update on table "public"."board_resolutions" to "anon";

grant delete on table "public"."board_resolutions" to "authenticated";

grant insert on table "public"."board_resolutions" to "authenticated";

grant references on table "public"."board_resolutions" to "authenticated";

grant select on table "public"."board_resolutions" to "authenticated";

grant trigger on table "public"."board_resolutions" to "authenticated";

grant truncate on table "public"."board_resolutions" to "authenticated";

grant update on table "public"."board_resolutions" to "authenticated";

grant delete on table "public"."board_resolutions" to "service_role";

grant insert on table "public"."board_resolutions" to "service_role";

grant references on table "public"."board_resolutions" to "service_role";

grant select on table "public"."board_resolutions" to "service_role";

grant trigger on table "public"."board_resolutions" to "service_role";

grant truncate on table "public"."board_resolutions" to "service_role";

grant update on table "public"."board_resolutions" to "service_role";

grant delete on table "public"."career_roles" to "anon";

grant insert on table "public"."career_roles" to "anon";

grant references on table "public"."career_roles" to "anon";

grant select on table "public"."career_roles" to "anon";

grant trigger on table "public"."career_roles" to "anon";

grant truncate on table "public"."career_roles" to "anon";

grant update on table "public"."career_roles" to "anon";

grant delete on table "public"."career_roles" to "authenticated";

grant insert on table "public"."career_roles" to "authenticated";

grant references on table "public"."career_roles" to "authenticated";

grant select on table "public"."career_roles" to "authenticated";

grant trigger on table "public"."career_roles" to "authenticated";

grant truncate on table "public"."career_roles" to "authenticated";

grant update on table "public"."career_roles" to "authenticated";

grant delete on table "public"."career_roles" to "service_role";

grant insert on table "public"."career_roles" to "service_role";

grant references on table "public"."career_roles" to "service_role";

grant select on table "public"."career_roles" to "service_role";

grant trigger on table "public"."career_roles" to "service_role";

grant truncate on table "public"."career_roles" to "service_role";

grant update on table "public"."career_roles" to "service_role";

grant delete on table "public"."career_testimonials" to "anon";

grant insert on table "public"."career_testimonials" to "anon";

grant references on table "public"."career_testimonials" to "anon";

grant select on table "public"."career_testimonials" to "anon";

grant trigger on table "public"."career_testimonials" to "anon";

grant truncate on table "public"."career_testimonials" to "anon";

grant update on table "public"."career_testimonials" to "anon";

grant delete on table "public"."career_testimonials" to "authenticated";

grant insert on table "public"."career_testimonials" to "authenticated";

grant references on table "public"."career_testimonials" to "authenticated";

grant select on table "public"."career_testimonials" to "authenticated";

grant trigger on table "public"."career_testimonials" to "authenticated";

grant truncate on table "public"."career_testimonials" to "authenticated";

grant update on table "public"."career_testimonials" to "authenticated";

grant delete on table "public"."career_testimonials" to "service_role";

grant insert on table "public"."career_testimonials" to "service_role";

grant references on table "public"."career_testimonials" to "service_role";

grant select on table "public"."career_testimonials" to "service_role";

grant trigger on table "public"."career_testimonials" to "service_role";

grant truncate on table "public"."career_testimonials" to "service_role";

grant update on table "public"."career_testimonials" to "service_role";

grant delete on table "public"."commendations" to "anon";

grant insert on table "public"."commendations" to "anon";

grant references on table "public"."commendations" to "anon";

grant select on table "public"."commendations" to "anon";

grant trigger on table "public"."commendations" to "anon";

grant truncate on table "public"."commendations" to "anon";

grant update on table "public"."commendations" to "anon";

grant delete on table "public"."commendations" to "authenticated";

grant insert on table "public"."commendations" to "authenticated";

grant references on table "public"."commendations" to "authenticated";

grant select on table "public"."commendations" to "authenticated";

grant trigger on table "public"."commendations" to "authenticated";

grant truncate on table "public"."commendations" to "authenticated";

grant update on table "public"."commendations" to "authenticated";

grant delete on table "public"."commendations" to "service_role";

grant insert on table "public"."commendations" to "service_role";

grant references on table "public"."commendations" to "service_role";

grant select on table "public"."commendations" to "service_role";

grant trigger on table "public"."commendations" to "service_role";

grant truncate on table "public"."commendations" to "service_role";

grant update on table "public"."commendations" to "service_role";

grant delete on table "public"."community_posts" to "anon";

grant insert on table "public"."community_posts" to "anon";

grant references on table "public"."community_posts" to "anon";

grant select on table "public"."community_posts" to "anon";

grant trigger on table "public"."community_posts" to "anon";

grant truncate on table "public"."community_posts" to "anon";

grant update on table "public"."community_posts" to "anon";

grant delete on table "public"."community_posts" to "authenticated";

grant insert on table "public"."community_posts" to "authenticated";

grant references on table "public"."community_posts" to "authenticated";

grant select on table "public"."community_posts" to "authenticated";

grant trigger on table "public"."community_posts" to "authenticated";

grant truncate on table "public"."community_posts" to "authenticated";

grant update on table "public"."community_posts" to "authenticated";

grant delete on table "public"."community_posts" to "service_role";

grant insert on table "public"."community_posts" to "service_role";

grant references on table "public"."community_posts" to "service_role";

grant select on table "public"."community_posts" to "service_role";

grant trigger on table "public"."community_posts" to "service_role";

grant truncate on table "public"."community_posts" to "service_role";

grant update on table "public"."community_posts" to "service_role";

grant delete on table "public"."compliance_tasks" to "anon";

grant insert on table "public"."compliance_tasks" to "anon";

grant references on table "public"."compliance_tasks" to "anon";

grant select on table "public"."compliance_tasks" to "anon";

grant trigger on table "public"."compliance_tasks" to "anon";

grant truncate on table "public"."compliance_tasks" to "anon";

grant update on table "public"."compliance_tasks" to "anon";

grant delete on table "public"."compliance_tasks" to "authenticated";

grant insert on table "public"."compliance_tasks" to "authenticated";

grant references on table "public"."compliance_tasks" to "authenticated";

grant select on table "public"."compliance_tasks" to "authenticated";

grant trigger on table "public"."compliance_tasks" to "authenticated";

grant truncate on table "public"."compliance_tasks" to "authenticated";

grant update on table "public"."compliance_tasks" to "authenticated";

grant delete on table "public"."compliance_tasks" to "service_role";

grant insert on table "public"."compliance_tasks" to "service_role";

grant references on table "public"."compliance_tasks" to "service_role";

grant select on table "public"."compliance_tasks" to "service_role";

grant trigger on table "public"."compliance_tasks" to "service_role";

grant truncate on table "public"."compliance_tasks" to "service_role";

grant update on table "public"."compliance_tasks" to "service_role";

grant delete on table "public"."corporate_policies" to "anon";

grant insert on table "public"."corporate_policies" to "anon";

grant references on table "public"."corporate_policies" to "anon";

grant select on table "public"."corporate_policies" to "anon";

grant trigger on table "public"."corporate_policies" to "anon";

grant truncate on table "public"."corporate_policies" to "anon";

grant update on table "public"."corporate_policies" to "anon";

grant delete on table "public"."corporate_policies" to "authenticated";

grant insert on table "public"."corporate_policies" to "authenticated";

grant references on table "public"."corporate_policies" to "authenticated";

grant select on table "public"."corporate_policies" to "authenticated";

grant trigger on table "public"."corporate_policies" to "authenticated";

grant truncate on table "public"."corporate_policies" to "authenticated";

grant update on table "public"."corporate_policies" to "authenticated";

grant delete on table "public"."corporate_policies" to "service_role";

grant insert on table "public"."corporate_policies" to "service_role";

grant references on table "public"."corporate_policies" to "service_role";

grant select on table "public"."corporate_policies" to "service_role";

grant trigger on table "public"."corporate_policies" to "service_role";

grant truncate on table "public"."corporate_policies" to "service_role";

grant update on table "public"."corporate_policies" to "service_role";

grant delete on table "public"."debug_logs" to "anon";

grant insert on table "public"."debug_logs" to "anon";

grant references on table "public"."debug_logs" to "anon";

grant select on table "public"."debug_logs" to "anon";

grant trigger on table "public"."debug_logs" to "anon";

grant truncate on table "public"."debug_logs" to "anon";

grant update on table "public"."debug_logs" to "anon";

grant delete on table "public"."debug_logs" to "authenticated";

grant insert on table "public"."debug_logs" to "authenticated";

grant references on table "public"."debug_logs" to "authenticated";

grant select on table "public"."debug_logs" to "authenticated";

grant trigger on table "public"."debug_logs" to "authenticated";

grant truncate on table "public"."debug_logs" to "authenticated";

grant update on table "public"."debug_logs" to "authenticated";

grant delete on table "public"."debug_logs" to "service_role";

grant insert on table "public"."debug_logs" to "service_role";

grant references on table "public"."debug_logs" to "service_role";

grant select on table "public"."debug_logs" to "service_role";

grant trigger on table "public"."debug_logs" to "service_role";

grant truncate on table "public"."debug_logs" to "service_role";

grant update on table "public"."debug_logs" to "service_role";

grant delete on table "public"."gtm_campaigns" to "anon";

grant insert on table "public"."gtm_campaigns" to "anon";

grant references on table "public"."gtm_campaigns" to "anon";

grant select on table "public"."gtm_campaigns" to "anon";

grant trigger on table "public"."gtm_campaigns" to "anon";

grant truncate on table "public"."gtm_campaigns" to "anon";

grant update on table "public"."gtm_campaigns" to "anon";

grant delete on table "public"."gtm_campaigns" to "authenticated";

grant insert on table "public"."gtm_campaigns" to "authenticated";

grant references on table "public"."gtm_campaigns" to "authenticated";

grant select on table "public"."gtm_campaigns" to "authenticated";

grant trigger on table "public"."gtm_campaigns" to "authenticated";

grant truncate on table "public"."gtm_campaigns" to "authenticated";

grant update on table "public"."gtm_campaigns" to "authenticated";

grant delete on table "public"."gtm_campaigns" to "service_role";

grant insert on table "public"."gtm_campaigns" to "service_role";

grant references on table "public"."gtm_campaigns" to "service_role";

grant select on table "public"."gtm_campaigns" to "service_role";

grant trigger on table "public"."gtm_campaigns" to "service_role";

grant truncate on table "public"."gtm_campaigns" to "service_role";

grant update on table "public"."gtm_campaigns" to "service_role";

grant delete on table "public"."gtm_templates" to "anon";

grant insert on table "public"."gtm_templates" to "anon";

grant references on table "public"."gtm_templates" to "anon";

grant select on table "public"."gtm_templates" to "anon";

grant trigger on table "public"."gtm_templates" to "anon";

grant truncate on table "public"."gtm_templates" to "anon";

grant update on table "public"."gtm_templates" to "anon";

grant delete on table "public"."gtm_templates" to "authenticated";

grant insert on table "public"."gtm_templates" to "authenticated";

grant references on table "public"."gtm_templates" to "authenticated";

grant select on table "public"."gtm_templates" to "authenticated";

grant trigger on table "public"."gtm_templates" to "authenticated";

grant truncate on table "public"."gtm_templates" to "authenticated";

grant update on table "public"."gtm_templates" to "authenticated";

grant delete on table "public"."gtm_templates" to "service_role";

grant insert on table "public"."gtm_templates" to "service_role";

grant references on table "public"."gtm_templates" to "service_role";

grant select on table "public"."gtm_templates" to "service_role";

grant trigger on table "public"."gtm_templates" to "service_role";

grant truncate on table "public"."gtm_templates" to "service_role";

grant update on table "public"."gtm_templates" to "service_role";

grant delete on table "public"."intern_application_metrics" to "anon";

grant insert on table "public"."intern_application_metrics" to "anon";

grant references on table "public"."intern_application_metrics" to "anon";

grant select on table "public"."intern_application_metrics" to "anon";

grant trigger on table "public"."intern_application_metrics" to "anon";

grant truncate on table "public"."intern_application_metrics" to "anon";

grant update on table "public"."intern_application_metrics" to "anon";

grant delete on table "public"."intern_application_metrics" to "authenticated";

grant insert on table "public"."intern_application_metrics" to "authenticated";

grant references on table "public"."intern_application_metrics" to "authenticated";

grant select on table "public"."intern_application_metrics" to "authenticated";

grant trigger on table "public"."intern_application_metrics" to "authenticated";

grant truncate on table "public"."intern_application_metrics" to "authenticated";

grant update on table "public"."intern_application_metrics" to "authenticated";

grant delete on table "public"."intern_application_metrics" to "service_role";

grant insert on table "public"."intern_application_metrics" to "service_role";

grant references on table "public"."intern_application_metrics" to "service_role";

grant select on table "public"."intern_application_metrics" to "service_role";

grant trigger on table "public"."intern_application_metrics" to "service_role";

grant truncate on table "public"."intern_application_metrics" to "service_role";

grant update on table "public"."intern_application_metrics" to "service_role";

grant delete on table "public"."intern_applications" to "anon";

grant insert on table "public"."intern_applications" to "anon";

grant references on table "public"."intern_applications" to "anon";

grant select on table "public"."intern_applications" to "anon";

grant trigger on table "public"."intern_applications" to "anon";

grant truncate on table "public"."intern_applications" to "anon";

grant update on table "public"."intern_applications" to "anon";

grant delete on table "public"."intern_applications" to "authenticated";

grant insert on table "public"."intern_applications" to "authenticated";

grant references on table "public"."intern_applications" to "authenticated";

grant select on table "public"."intern_applications" to "authenticated";

grant trigger on table "public"."intern_applications" to "authenticated";

grant truncate on table "public"."intern_applications" to "authenticated";

grant update on table "public"."intern_applications" to "authenticated";

grant delete on table "public"."intern_applications" to "service_role";

grant insert on table "public"."intern_applications" to "service_role";

grant references on table "public"."intern_applications" to "service_role";

grant select on table "public"."intern_applications" to "service_role";

grant trigger on table "public"."intern_applications" to "service_role";

grant truncate on table "public"."intern_applications" to "service_role";

grant update on table "public"."intern_applications" to "service_role";

grant delete on table "public"."intern_onboarding_checklists" to "anon";

grant insert on table "public"."intern_onboarding_checklists" to "anon";

grant references on table "public"."intern_onboarding_checklists" to "anon";

grant select on table "public"."intern_onboarding_checklists" to "anon";

grant trigger on table "public"."intern_onboarding_checklists" to "anon";

grant truncate on table "public"."intern_onboarding_checklists" to "anon";

grant update on table "public"."intern_onboarding_checklists" to "anon";

grant delete on table "public"."intern_onboarding_checklists" to "authenticated";

grant insert on table "public"."intern_onboarding_checklists" to "authenticated";

grant references on table "public"."intern_onboarding_checklists" to "authenticated";

grant select on table "public"."intern_onboarding_checklists" to "authenticated";

grant trigger on table "public"."intern_onboarding_checklists" to "authenticated";

grant truncate on table "public"."intern_onboarding_checklists" to "authenticated";

grant update on table "public"."intern_onboarding_checklists" to "authenticated";

grant delete on table "public"."intern_onboarding_checklists" to "service_role";

grant insert on table "public"."intern_onboarding_checklists" to "service_role";

grant references on table "public"."intern_onboarding_checklists" to "service_role";

grant select on table "public"."intern_onboarding_checklists" to "service_role";

grant trigger on table "public"."intern_onboarding_checklists" to "service_role";

grant truncate on table "public"."intern_onboarding_checklists" to "service_role";

grant update on table "public"."intern_onboarding_checklists" to "service_role";

grant delete on table "public"."leave_requests" to "anon";

grant insert on table "public"."leave_requests" to "anon";

grant references on table "public"."leave_requests" to "anon";

grant select on table "public"."leave_requests" to "anon";

grant trigger on table "public"."leave_requests" to "anon";

grant truncate on table "public"."leave_requests" to "anon";

grant update on table "public"."leave_requests" to "anon";

grant delete on table "public"."leave_requests" to "authenticated";

grant insert on table "public"."leave_requests" to "authenticated";

grant references on table "public"."leave_requests" to "authenticated";

grant select on table "public"."leave_requests" to "authenticated";

grant trigger on table "public"."leave_requests" to "authenticated";

grant truncate on table "public"."leave_requests" to "authenticated";

grant update on table "public"."leave_requests" to "authenticated";

grant delete on table "public"."leave_requests" to "service_role";

grant insert on table "public"."leave_requests" to "service_role";

grant references on table "public"."leave_requests" to "service_role";

grant select on table "public"."leave_requests" to "service_role";

grant trigger on table "public"."leave_requests" to "service_role";

grant truncate on table "public"."leave_requests" to "service_role";

grant update on table "public"."leave_requests" to "service_role";

grant delete on table "public"."mentorship_bookings" to "anon";

grant insert on table "public"."mentorship_bookings" to "anon";

grant references on table "public"."mentorship_bookings" to "anon";

grant select on table "public"."mentorship_bookings" to "anon";

grant trigger on table "public"."mentorship_bookings" to "anon";

grant truncate on table "public"."mentorship_bookings" to "anon";

grant update on table "public"."mentorship_bookings" to "anon";

grant delete on table "public"."mentorship_bookings" to "authenticated";

grant insert on table "public"."mentorship_bookings" to "authenticated";

grant references on table "public"."mentorship_bookings" to "authenticated";

grant select on table "public"."mentorship_bookings" to "authenticated";

grant trigger on table "public"."mentorship_bookings" to "authenticated";

grant truncate on table "public"."mentorship_bookings" to "authenticated";

grant update on table "public"."mentorship_bookings" to "authenticated";

grant delete on table "public"."mentorship_bookings" to "service_role";

grant insert on table "public"."mentorship_bookings" to "service_role";

grant references on table "public"."mentorship_bookings" to "service_role";

grant select on table "public"."mentorship_bookings" to "service_role";

grant trigger on table "public"."mentorship_bookings" to "service_role";

grant truncate on table "public"."mentorship_bookings" to "service_role";

grant update on table "public"."mentorship_bookings" to "service_role";

grant delete on table "public"."microai_interest" to "anon";

grant insert on table "public"."microai_interest" to "anon";

grant references on table "public"."microai_interest" to "anon";

grant select on table "public"."microai_interest" to "anon";

grant trigger on table "public"."microai_interest" to "anon";

grant truncate on table "public"."microai_interest" to "anon";

grant update on table "public"."microai_interest" to "anon";

grant delete on table "public"."microai_interest" to "authenticated";

grant insert on table "public"."microai_interest" to "authenticated";

grant references on table "public"."microai_interest" to "authenticated";

grant select on table "public"."microai_interest" to "authenticated";

grant trigger on table "public"."microai_interest" to "authenticated";

grant truncate on table "public"."microai_interest" to "authenticated";

grant update on table "public"."microai_interest" to "authenticated";

grant delete on table "public"."microai_interest" to "service_role";

grant insert on table "public"."microai_interest" to "service_role";

grant references on table "public"."microai_interest" to "service_role";

grant select on table "public"."microai_interest" to "service_role";

grant trigger on table "public"."microai_interest" to "service_role";

grant truncate on table "public"."microai_interest" to "service_role";

grant update on table "public"."microai_interest" to "service_role";

grant delete on table "public"."nic_codes" to "anon";

grant insert on table "public"."nic_codes" to "anon";

grant references on table "public"."nic_codes" to "anon";

grant select on table "public"."nic_codes" to "anon";

grant trigger on table "public"."nic_codes" to "anon";

grant truncate on table "public"."nic_codes" to "anon";

grant update on table "public"."nic_codes" to "anon";

grant delete on table "public"."nic_codes" to "authenticated";

grant insert on table "public"."nic_codes" to "authenticated";

grant references on table "public"."nic_codes" to "authenticated";

grant select on table "public"."nic_codes" to "authenticated";

grant trigger on table "public"."nic_codes" to "authenticated";

grant truncate on table "public"."nic_codes" to "authenticated";

grant update on table "public"."nic_codes" to "authenticated";

grant delete on table "public"."nic_codes" to "service_role";

grant insert on table "public"."nic_codes" to "service_role";

grant references on table "public"."nic_codes" to "service_role";

grant select on table "public"."nic_codes" to "service_role";

grant trigger on table "public"."nic_codes" to "service_role";

grant truncate on table "public"."nic_codes" to "service_role";

grant update on table "public"."nic_codes" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."performance_metrics" to "anon";

grant insert on table "public"."performance_metrics" to "anon";

grant references on table "public"."performance_metrics" to "anon";

grant select on table "public"."performance_metrics" to "anon";

grant trigger on table "public"."performance_metrics" to "anon";

grant truncate on table "public"."performance_metrics" to "anon";

grant update on table "public"."performance_metrics" to "anon";

grant delete on table "public"."performance_metrics" to "authenticated";

grant insert on table "public"."performance_metrics" to "authenticated";

grant references on table "public"."performance_metrics" to "authenticated";

grant select on table "public"."performance_metrics" to "authenticated";

grant trigger on table "public"."performance_metrics" to "authenticated";

grant truncate on table "public"."performance_metrics" to "authenticated";

grant update on table "public"."performance_metrics" to "authenticated";

grant delete on table "public"."performance_metrics" to "service_role";

grant insert on table "public"."performance_metrics" to "service_role";

grant references on table "public"."performance_metrics" to "service_role";

grant select on table "public"."performance_metrics" to "service_role";

grant trigger on table "public"."performance_metrics" to "service_role";

grant truncate on table "public"."performance_metrics" to "service_role";

grant update on table "public"."performance_metrics" to "service_role";

grant delete on table "public"."platform_metrics" to "anon";

grant insert on table "public"."platform_metrics" to "anon";

grant references on table "public"."platform_metrics" to "anon";

grant select on table "public"."platform_metrics" to "anon";

grant trigger on table "public"."platform_metrics" to "anon";

grant truncate on table "public"."platform_metrics" to "anon";

grant update on table "public"."platform_metrics" to "anon";

grant delete on table "public"."platform_metrics" to "authenticated";

grant insert on table "public"."platform_metrics" to "authenticated";

grant references on table "public"."platform_metrics" to "authenticated";

grant select on table "public"."platform_metrics" to "authenticated";

grant trigger on table "public"."platform_metrics" to "authenticated";

grant truncate on table "public"."platform_metrics" to "authenticated";

grant update on table "public"."platform_metrics" to "authenticated";

grant delete on table "public"."platform_metrics" to "service_role";

grant insert on table "public"."platform_metrics" to "service_role";

grant references on table "public"."platform_metrics" to "service_role";

grant select on table "public"."platform_metrics" to "service_role";

grant trigger on table "public"."platform_metrics" to "service_role";

grant truncate on table "public"."platform_metrics" to "service_role";

grant update on table "public"."platform_metrics" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."promotion_pipeline" to "anon";

grant insert on table "public"."promotion_pipeline" to "anon";

grant references on table "public"."promotion_pipeline" to "anon";

grant select on table "public"."promotion_pipeline" to "anon";

grant trigger on table "public"."promotion_pipeline" to "anon";

grant truncate on table "public"."promotion_pipeline" to "anon";

grant update on table "public"."promotion_pipeline" to "anon";

grant delete on table "public"."promotion_pipeline" to "authenticated";

grant insert on table "public"."promotion_pipeline" to "authenticated";

grant references on table "public"."promotion_pipeline" to "authenticated";

grant select on table "public"."promotion_pipeline" to "authenticated";

grant trigger on table "public"."promotion_pipeline" to "authenticated";

grant truncate on table "public"."promotion_pipeline" to "authenticated";

grant update on table "public"."promotion_pipeline" to "authenticated";

grant delete on table "public"."promotion_pipeline" to "service_role";

grant insert on table "public"."promotion_pipeline" to "service_role";

grant references on table "public"."promotion_pipeline" to "service_role";

grant select on table "public"."promotion_pipeline" to "service_role";

grant trigger on table "public"."promotion_pipeline" to "service_role";

grant truncate on table "public"."promotion_pipeline" to "service_role";

grant update on table "public"."promotion_pipeline" to "service_role";

grant delete on table "public"."schemes" to "anon";

grant insert on table "public"."schemes" to "anon";

grant references on table "public"."schemes" to "anon";

grant select on table "public"."schemes" to "anon";

grant trigger on table "public"."schemes" to "anon";

grant truncate on table "public"."schemes" to "anon";

grant update on table "public"."schemes" to "anon";

grant delete on table "public"."schemes" to "authenticated";

grant insert on table "public"."schemes" to "authenticated";

grant references on table "public"."schemes" to "authenticated";

grant select on table "public"."schemes" to "authenticated";

grant trigger on table "public"."schemes" to "authenticated";

grant truncate on table "public"."schemes" to "authenticated";

grant update on table "public"."schemes" to "authenticated";

grant delete on table "public"."schemes" to "service_role";

grant insert on table "public"."schemes" to "service_role";

grant references on table "public"."schemes" to "service_role";

grant select on table "public"."schemes" to "service_role";

grant trigger on table "public"."schemes" to "service_role";

grant truncate on table "public"."schemes" to "service_role";

grant update on table "public"."schemes" to "service_role";

grant delete on table "public"."service_health" to "anon";

grant insert on table "public"."service_health" to "anon";

grant references on table "public"."service_health" to "anon";

grant select on table "public"."service_health" to "anon";

grant trigger on table "public"."service_health" to "anon";

grant truncate on table "public"."service_health" to "anon";

grant update on table "public"."service_health" to "anon";

grant delete on table "public"."service_health" to "authenticated";

grant insert on table "public"."service_health" to "authenticated";

grant references on table "public"."service_health" to "authenticated";

grant select on table "public"."service_health" to "authenticated";

grant trigger on table "public"."service_health" to "authenticated";

grant truncate on table "public"."service_health" to "authenticated";

grant update on table "public"."service_health" to "authenticated";

grant delete on table "public"."service_health" to "service_role";

grant insert on table "public"."service_health" to "service_role";

grant references on table "public"."service_health" to "service_role";

grant select on table "public"."service_health" to "service_role";

grant trigger on table "public"."service_health" to "service_role";

grant truncate on table "public"."service_health" to "service_role";

grant update on table "public"."service_health" to "service_role";

grant delete on table "public"."support_tickets" to "anon";

grant insert on table "public"."support_tickets" to "anon";

grant references on table "public"."support_tickets" to "anon";

grant select on table "public"."support_tickets" to "anon";

grant trigger on table "public"."support_tickets" to "anon";

grant truncate on table "public"."support_tickets" to "anon";

grant update on table "public"."support_tickets" to "anon";

grant delete on table "public"."support_tickets" to "authenticated";

grant insert on table "public"."support_tickets" to "authenticated";

grant references on table "public"."support_tickets" to "authenticated";

grant select on table "public"."support_tickets" to "authenticated";

grant trigger on table "public"."support_tickets" to "authenticated";

grant truncate on table "public"."support_tickets" to "authenticated";

grant update on table "public"."support_tickets" to "authenticated";

grant delete on table "public"."support_tickets" to "service_role";

grant insert on table "public"."support_tickets" to "service_role";

grant references on table "public"."support_tickets" to "service_role";

grant select on table "public"."support_tickets" to "service_role";

grant trigger on table "public"."support_tickets" to "service_role";

grant truncate on table "public"."support_tickets" to "service_role";

grant update on table "public"."support_tickets" to "service_role";

grant delete on table "public"."system_logs" to "anon";

grant insert on table "public"."system_logs" to "anon";

grant references on table "public"."system_logs" to "anon";

grant select on table "public"."system_logs" to "anon";

grant trigger on table "public"."system_logs" to "anon";

grant truncate on table "public"."system_logs" to "anon";

grant update on table "public"."system_logs" to "anon";

grant delete on table "public"."system_logs" to "authenticated";

grant insert on table "public"."system_logs" to "authenticated";

grant references on table "public"."system_logs" to "authenticated";

grant select on table "public"."system_logs" to "authenticated";

grant trigger on table "public"."system_logs" to "authenticated";

grant truncate on table "public"."system_logs" to "authenticated";

grant update on table "public"."system_logs" to "authenticated";

grant delete on table "public"."system_logs" to "service_role";

grant insert on table "public"."system_logs" to "service_role";

grant references on table "public"."system_logs" to "service_role";

grant select on table "public"."system_logs" to "service_role";

grant trigger on table "public"."system_logs" to "service_role";

grant truncate on table "public"."system_logs" to "service_role";

grant update on table "public"."system_logs" to "service_role";

grant delete on table "public"."task_comments" to "anon";

grant insert on table "public"."task_comments" to "anon";

grant references on table "public"."task_comments" to "anon";

grant select on table "public"."task_comments" to "anon";

grant trigger on table "public"."task_comments" to "anon";

grant truncate on table "public"."task_comments" to "anon";

grant update on table "public"."task_comments" to "anon";

grant delete on table "public"."task_comments" to "authenticated";

grant insert on table "public"."task_comments" to "authenticated";

grant references on table "public"."task_comments" to "authenticated";

grant select on table "public"."task_comments" to "authenticated";

grant trigger on table "public"."task_comments" to "authenticated";

grant truncate on table "public"."task_comments" to "authenticated";

grant update on table "public"."task_comments" to "authenticated";

grant delete on table "public"."task_comments" to "service_role";

grant insert on table "public"."task_comments" to "service_role";

grant references on table "public"."task_comments" to "service_role";

grant select on table "public"."task_comments" to "service_role";

grant trigger on table "public"."task_comments" to "service_role";

grant truncate on table "public"."task_comments" to "service_role";

grant update on table "public"."task_comments" to "service_role";

grant delete on table "public"."task_logs" to "anon";

grant insert on table "public"."task_logs" to "anon";

grant references on table "public"."task_logs" to "anon";

grant select on table "public"."task_logs" to "anon";

grant trigger on table "public"."task_logs" to "anon";

grant truncate on table "public"."task_logs" to "anon";

grant update on table "public"."task_logs" to "anon";

grant delete on table "public"."task_logs" to "authenticated";

grant insert on table "public"."task_logs" to "authenticated";

grant references on table "public"."task_logs" to "authenticated";

grant select on table "public"."task_logs" to "authenticated";

grant trigger on table "public"."task_logs" to "authenticated";

grant truncate on table "public"."task_logs" to "authenticated";

grant update on table "public"."task_logs" to "authenticated";

grant delete on table "public"."task_logs" to "service_role";

grant insert on table "public"."task_logs" to "service_role";

grant references on table "public"."task_logs" to "service_role";

grant select on table "public"."task_logs" to "service_role";

grant trigger on table "public"."task_logs" to "service_role";

grant truncate on table "public"."task_logs" to "service_role";

grant update on table "public"."task_logs" to "service_role";

grant delete on table "public"."tasks" to "anon";

grant insert on table "public"."tasks" to "anon";

grant references on table "public"."tasks" to "anon";

grant select on table "public"."tasks" to "anon";

grant trigger on table "public"."tasks" to "anon";

grant truncate on table "public"."tasks" to "anon";

grant update on table "public"."tasks" to "anon";

grant delete on table "public"."tasks" to "authenticated";

grant insert on table "public"."tasks" to "authenticated";

grant references on table "public"."tasks" to "authenticated";

grant select on table "public"."tasks" to "authenticated";

grant trigger on table "public"."tasks" to "authenticated";

grant truncate on table "public"."tasks" to "authenticated";

grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";

grant insert on table "public"."tasks" to "service_role";

grant references on table "public"."tasks" to "service_role";

grant select on table "public"."tasks" to "service_role";

grant trigger on table "public"."tasks" to "service_role";

grant truncate on table "public"."tasks" to "service_role";

grant update on table "public"."tasks" to "service_role";

grant delete on table "public"."team_members" to "anon";

grant insert on table "public"."team_members" to "anon";

grant references on table "public"."team_members" to "anon";

grant select on table "public"."team_members" to "anon";

grant trigger on table "public"."team_members" to "anon";

grant truncate on table "public"."team_members" to "anon";

grant update on table "public"."team_members" to "anon";

grant delete on table "public"."team_members" to "authenticated";

grant insert on table "public"."team_members" to "authenticated";

grant references on table "public"."team_members" to "authenticated";

grant select on table "public"."team_members" to "authenticated";

grant trigger on table "public"."team_members" to "authenticated";

grant truncate on table "public"."team_members" to "authenticated";

grant update on table "public"."team_members" to "authenticated";

grant delete on table "public"."team_members" to "service_role";

grant insert on table "public"."team_members" to "service_role";

grant references on table "public"."team_members" to "service_role";

grant select on table "public"."team_members" to "service_role";

grant trigger on table "public"."team_members" to "service_role";

grant truncate on table "public"."team_members" to "service_role";

grant update on table "public"."team_members" to "service_role";

grant delete on table "public"."tenders" to "anon";

grant insert on table "public"."tenders" to "anon";

grant references on table "public"."tenders" to "anon";

grant select on table "public"."tenders" to "anon";

grant trigger on table "public"."tenders" to "anon";

grant truncate on table "public"."tenders" to "anon";

grant update on table "public"."tenders" to "anon";

grant delete on table "public"."tenders" to "authenticated";

grant insert on table "public"."tenders" to "authenticated";

grant references on table "public"."tenders" to "authenticated";

grant select on table "public"."tenders" to "authenticated";

grant trigger on table "public"."tenders" to "authenticated";

grant truncate on table "public"."tenders" to "authenticated";

grant update on table "public"."tenders" to "authenticated";

grant delete on table "public"."tenders" to "service_role";

grant insert on table "public"."tenders" to "service_role";

grant references on table "public"."tenders" to "service_role";

grant select on table "public"."tenders" to "service_role";

grant trigger on table "public"."tenders" to "service_role";

grant truncate on table "public"."tenders" to "service_role";

grant update on table "public"."tenders" to "service_role";

grant delete on table "public"."user_progress" to "anon";

grant insert on table "public"."user_progress" to "anon";

grant references on table "public"."user_progress" to "anon";

grant select on table "public"."user_progress" to "anon";

grant trigger on table "public"."user_progress" to "anon";

grant truncate on table "public"."user_progress" to "anon";

grant update on table "public"."user_progress" to "anon";

grant delete on table "public"."user_progress" to "authenticated";

grant insert on table "public"."user_progress" to "authenticated";

grant references on table "public"."user_progress" to "authenticated";

grant select on table "public"."user_progress" to "authenticated";

grant trigger on table "public"."user_progress" to "authenticated";

grant truncate on table "public"."user_progress" to "authenticated";

grant update on table "public"."user_progress" to "authenticated";

grant delete on table "public"."user_progress" to "service_role";

grant insert on table "public"."user_progress" to "service_role";

grant references on table "public"."user_progress" to "service_role";

grant select on table "public"."user_progress" to "service_role";

grant trigger on table "public"."user_progress" to "service_role";

grant truncate on table "public"."user_progress" to "service_role";

grant update on table "public"."user_progress" to "service_role";

grant delete on table "public"."user_settings" to "anon";

grant insert on table "public"."user_settings" to "anon";

grant references on table "public"."user_settings" to "anon";

grant select on table "public"."user_settings" to "anon";

grant trigger on table "public"."user_settings" to "anon";

grant truncate on table "public"."user_settings" to "anon";

grant update on table "public"."user_settings" to "anon";

grant delete on table "public"."user_settings" to "authenticated";

grant insert on table "public"."user_settings" to "authenticated";

grant references on table "public"."user_settings" to "authenticated";

grant select on table "public"."user_settings" to "authenticated";

grant trigger on table "public"."user_settings" to "authenticated";

grant truncate on table "public"."user_settings" to "authenticated";

grant update on table "public"."user_settings" to "authenticated";

grant delete on table "public"."user_settings" to "service_role";

grant insert on table "public"."user_settings" to "service_role";

grant references on table "public"."user_settings" to "service_role";

grant select on table "public"."user_settings" to "service_role";

grant trigger on table "public"."user_settings" to "service_role";

grant truncate on table "public"."user_settings" to "service_role";

grant update on table "public"."user_settings" to "service_role";

grant delete on table "public"."weekly_reflections" to "anon";

grant insert on table "public"."weekly_reflections" to "anon";

grant references on table "public"."weekly_reflections" to "anon";

grant select on table "public"."weekly_reflections" to "anon";

grant trigger on table "public"."weekly_reflections" to "anon";

grant truncate on table "public"."weekly_reflections" to "anon";

grant update on table "public"."weekly_reflections" to "anon";

grant delete on table "public"."weekly_reflections" to "authenticated";

grant insert on table "public"."weekly_reflections" to "authenticated";

grant references on table "public"."weekly_reflections" to "authenticated";

grant select on table "public"."weekly_reflections" to "authenticated";

grant trigger on table "public"."weekly_reflections" to "authenticated";

grant truncate on table "public"."weekly_reflections" to "authenticated";

grant update on table "public"."weekly_reflections" to "authenticated";

grant delete on table "public"."weekly_reflections" to "service_role";

grant insert on table "public"."weekly_reflections" to "service_role";

grant references on table "public"."weekly_reflections" to "service_role";

grant select on table "public"."weekly_reflections" to "service_role";

grant trigger on table "public"."weekly_reflections" to "service_role";

grant truncate on table "public"."weekly_reflections" to "service_role";

grant update on table "public"."weekly_reflections" to "service_role";


  create policy "AI select policy"
  on "public"."ai_services"
  as permissive
  for select
  to public
using (true);



  create policy "Announcements policy"
  on "public"."announcements"
  as permissive
  for select
  to public
using ((( SELECT auth.uid() AS uid) IS NOT NULL));



  create policy "Attend policy"
  on "public"."attendance_logs"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric)));



  create policy "Res policy"
  on "public"."board_resolutions"
  as permissive
  for select
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (1)::numeric));



  create policy "Roles delete"
  on "public"."career_roles"
  as permissive
  for delete
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Roles insert"
  on "public"."career_roles"
  as permissive
  for insert
  to public
with check ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Roles select"
  on "public"."career_roles"
  as permissive
  for select
  to public
using (true);



  create policy "Roles update"
  on "public"."career_roles"
  as permissive
  for update
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Testimonials delete"
  on "public"."career_testimonials"
  as permissive
  for delete
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Testimonials insert"
  on "public"."career_testimonials"
  as permissive
  for insert
  to public
with check ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Testimonials select"
  on "public"."career_testimonials"
  as permissive
  for select
  to public
using (true);



  create policy "Testimonials update"
  on "public"."career_testimonials"
  as permissive
  for update
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Commendations select policy"
  on "public"."commendations"
  as permissive
  for select
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (( SELECT auth.uid() AS uid) = mentor_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric)));



  create policy "Mentors and Team Leads can award commendations"
  on "public"."commendations"
  as permissive
  for insert
  to public
with check ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Community insert policy"
  on "public"."community_posts"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Community select policy"
  on "public"."community_posts"
  as permissive
  for select
  to public
using (true);



  create policy "Comp policy"
  on "public"."compliance_tasks"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (1)::numeric)));



  create policy "Policy delete"
  on "public"."corporate_policies"
  as permissive
  for delete
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Policy insert"
  on "public"."corporate_policies"
  as permissive
  for insert
  to public
with check ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Policy select"
  on "public"."corporate_policies"
  as permissive
  for select
  to public
using (true);



  create policy "Policy update"
  on "public"."corporate_policies"
  as permissive
  for update
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Debug logs policy"
  on "public"."debug_logs"
  as permissive
  for all
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "GTM policy"
  on "public"."gtm_campaigns"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (1)::numeric)));



  create policy "GTM template policy"
  on "public"."gtm_templates"
  as permissive
  for select
  to public
using (true);



  create policy "Metrics delete policy"
  on "public"."intern_application_metrics"
  as permissive
  for delete
  to public
using (((( SELECT auth.uid() AS uid) = evaluator_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (1)::numeric)));



  create policy "Metrics insert policy"
  on "public"."intern_application_metrics"
  as permissive
  for insert
  to public
with check (((( SELECT auth.uid() AS uid) = evaluator_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (1)::numeric)));



  create policy "Metrics read policy"
  on "public"."intern_application_metrics"
  as permissive
  for select
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Metrics update policy"
  on "public"."intern_application_metrics"
  as permissive
  for update
  to public
using (((( SELECT auth.uid() AS uid) = evaluator_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (1)::numeric)));



  create policy "Apps public insert"
  on "public"."intern_applications"
  as permissive
  for insert
  to public
with check ((email IS NOT NULL));



  create policy "Apps staff delete"
  on "public"."intern_applications"
  as permissive
  for delete
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Apps staff select"
  on "public"."intern_applications"
  as permissive
  for select
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Apps staff update"
  on "public"."intern_applications"
  as permissive
  for update
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Checklist policy"
  on "public"."intern_onboarding_checklists"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric)));



  create policy "Leaves policy"
  on "public"."leave_requests"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric)));



  create policy "Mentorship policy"
  on "public"."mentorship_bookings"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = mentee_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (1)::numeric)));



  create policy "MicroAI interest policy"
  on "public"."microai_interest"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (1)::numeric)));



  create policy "NIC policy"
  on "public"."nic_codes"
  as permissive
  for select
  to public
using (true);



  create policy "Notif policy"
  on "public"."notifications"
  as permissive
  for all
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Metrics policy"
  on "public"."performance_metrics"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (1)::numeric)));



  create policy "Platform metrics policy"
  on "public"."platform_metrics"
  as permissive
  for select
  to public
using ((( SELECT auth.uid() AS uid) IS NOT NULL));



  create policy "Profiles policy"
  on "public"."profiles"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric)));



  create policy "Promotion policy"
  on "public"."promotion_pipeline"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (1)::numeric)));



  create policy "Scheme select policy"
  on "public"."schemes"
  as permissive
  for select
  to public
using (true);



  create policy "Service health policy"
  on "public"."service_health"
  as permissive
  for select
  to public
using ((( SELECT auth.uid() AS uid) IS NOT NULL));



  create policy "Support policy"
  on "public"."support_tickets"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric)));



  create policy "Logs insert"
  on "public"."system_logs"
  as permissive
  for insert
  to public
with check (((( SELECT auth.uid() AS uid) = user_id) OR (user_id IS NULL)));



  create policy "Logs policy"
  on "public"."system_logs"
  as permissive
  for select
  to public
using ((internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric));



  create policy "Comment policy"
  on "public"."task_comments"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.tasks
  WHERE ((tasks.id = task_comments.task_id) AND ((tasks.assigned_to = ( SELECT auth.uid() AS uid)) OR (tasks.assigned_by = ( SELECT auth.uid() AS uid)) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric))))));



  create policy "Task logs policy"
  on "public"."task_logs"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.tasks
  WHERE ((tasks.id = task_logs.task_id) AND ((tasks.assigned_to = ( SELECT auth.uid() AS uid)) OR (tasks.assigned_by = ( SELECT auth.uid() AS uid)) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric))))));



  create policy "Task policy"
  on "public"."tasks"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = assigned_to) OR (( SELECT auth.uid() AS uid) = assigned_by) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric)));



  create policy "Team policy"
  on "public"."team_members"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric)));



  create policy "Tender select policy"
  on "public"."tenders"
  as permissive
  for select
  to public
using (true);



  create policy "Progress policy"
  on "public"."user_progress"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric)));



  create policy "Settings policy"
  on "public"."user_settings"
  as permissive
  for all
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Reflections policy"
  on "public"."weekly_reflections"
  as permissive
  for all
  to public
using (((( SELECT auth.uid() AS uid) = user_id) OR (internal.get_user_role_level(( SELECT auth.uid() AS uid)) <= (3)::numeric)));


CREATE TRIGGER on_support_ticket_resolved BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.handle_support_resolution();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Avatar owner access"
  on "storage"."objects"
  as permissive
  for all
  to public
using (((bucket_id = 'avatars'::text) AND (( SELECT auth.uid() AS uid) = owner)));



  create policy "Avatar owner manage"
  on "storage"."objects"
  as permissive
  for all
  to public
using (((bucket_id = 'avatars'::text) AND (( SELECT auth.uid() AS uid) = owner)));



  create policy "Avatar upload access"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'avatars'::text));



