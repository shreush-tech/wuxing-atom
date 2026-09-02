-- Wu Xing SaaS v0.87 — backend-ready PostgreSQL domain schema
-- Reference architecture only. Do not deploy without authentication, authorization,
-- encryption, backup, retention and LGPD/privacy review.

create table organizations (
  id uuid primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table app_users (
  id uuid primary key,
  email text unique not null,
  display_name text,
  created_at timestamptz not null default now()
);

create type member_role as enum ('owner','physician','student','assistant');
create table organization_members (
  organization_id uuid references organizations(id) on delete cascade,
  user_id uuid references app_users(id) on delete cascade,
  role member_role not null,
  primary key (organization_id,user_id)
);

create table patients (
  id uuid primary key,
  organization_id uuid not null references organizations(id) on delete cascade,
  patient_user_id uuid null references app_users(id),
  -- In production, identifiers/names should be protected according to the chosen security model.
  display_name_protected text not null,
  preferred_name_protected text,
  status text not null default 'active' check (status in ('active','paused','archived')),
  created_by uuid not null references app_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index patients_org_updated_idx on patients(organization_id,updated_at desc);

create table clinical_sessions (
  id uuid primary key,
  organization_id uuid not null references organizations(id) on delete cascade,
  patient_id uuid not null references patients(id) on delete cascade,
  practitioner_id uuid not null references app_users(id),
  session_number integer not null check (session_number>0),
  occurred_at timestamptz not null,
  symptom_burden smallint check (symptom_burden between 0 and 10),
  clinician_note_protected text,
  patient_note_protected text,
  engine_version text not null,
  knowledge_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(patient_id,session_number)
);
create index sessions_patient_date_idx on clinical_sessions(patient_id,occurred_at desc);

create table session_answers (
  session_id uuid references clinical_sessions(id) on delete cascade,
  symptom_id text not null,
  answer text not null check (answer in ('yes','no','unknown')),
  primary key(session_id,symptom_id)
);

create table session_patterns (
  session_id uuid references clinical_sessions(id) on delete cascade,
  pattern_id text not null,
  rank integer not null,
  raw_score double precision not null,
  confidence double precision not null,
  primary key(session_id,pattern_id)
);

create table session_elements (
  session_id uuid references clinical_sessions(id) on delete cascade,
  element_id text not null check (element_id in ('wood','fire','earth','metal','water')),
  activity double precision not null,
  deficiency double precision not null,
  excess double precision not null,
  heat double precision not null,
  cold double precision not null,
  stagnation double precision not null,
  primary key(session_id,element_id)
);

create table session_points (
  id uuid primary key,
  session_id uuid not null references clinical_sessions(id) on delete cascade,
  point_code text not null,
  origin text not null check (origin in ('clinician','recommended')),
  rationale text
);

create table clinical_diagnosis_context (
  session_id uuid references clinical_sessions(id) on delete cascade,
  diagnosis_id text not null,
  primary key(session_id,diagnosis_id)
);

create table audit_events (
  id uuid primary key,
  organization_id uuid not null references organizations(id) on delete cascade,
  actor_user_id uuid not null references app_users(id),
  patient_id uuid null references patients(id) on delete set null,
  event_type text not null,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);
create index audit_org_date_idx on audit_events(organization_id,created_at desc);

-- Production authorization invariant:
-- every patient/session query must be scoped by organization membership and role.
-- Students should only access explicitly assigned/owned teaching cases.
-- Patient accounts should only access their own record and the fields intentionally shared with them.
