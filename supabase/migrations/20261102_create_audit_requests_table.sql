-- ==============================================================================
-- NORTHUP STUDIO — Production Audit Requests Migration
-- Table: audit_requests
-- Description: Stores incoming Free Digital Audit requests from Northup Studio
-- ==============================================================================

-- 1. Enable pgcrypto / uuid-ossp if not already available
create extension if not exists "pgcrypto";

-- 2. Create the audit_requests table with rigorous constraints
create table if not exists public.audit_requests (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    full_name text not null check (length(trim(full_name)) >= 2 and length(full_name) <= 100),
    work_email text not null check (
        length(trim(work_email)) <= 120 and 
        work_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    website_url text not null check (
        length(trim(website_url)) >= 4 and 
        length(trim(website_url)) <= 255
    ),
    audit_type text not null check (
        audit_type in (
            'Website design & user experience',
            'SEO & search visibility',
            'Performance & technical issues',
            'Complete digital experience'
        )
    ),
    biggest_challenge text check (
        biggest_challenge is null or length(biggest_challenge) <= 1000
    ),
    status text not null default 'new' check (
        status in (
            'new',
            'in_progress',
            'completed',
            'rejected',
            'archived'
        )
    ),
    admin_notes text check (
        admin_notes is null or length(admin_notes) <= 3000
    ),
    converted_lead_id uuid references public.leads(id) on delete set null,
    source text not null default 'northup_studio_hero_audit' check (length(source) <= 80),
    metadata jsonb default '{}'::jsonb
);

-- 3. Table Comments
comment on table public.audit_requests is 'Stores production audit requests submitted via Northup Studio Free Digital Audit intake.';
comment on column public.audit_requests.status is 'Controlled audit lifecycle status: new, in_progress, completed, rejected, archived.';
comment on column public.audit_requests.converted_lead_id is 'Optional link to a lead in public.leads if the prospective client was converted.';

-- 4. High-Performance Indexes for Admin Queries & Filtering
create index if not exists idx_audit_requests_created_at on public.audit_requests (created_at desc);
create index if not exists idx_audit_requests_status on public.audit_requests (status);
create index if not exists idx_audit_requests_work_email on public.audit_requests (work_email);
create index if not exists idx_audit_requests_audit_type on public.audit_requests (audit_type);

-- 5. Row Level Security (RLS) Configuration
-- Strictly isolate audit requests to prevent unauthorized public reads, updates, or deletions.
alter table public.audit_requests enable row level security;

-- Drop legacy policies if any
drop policy if exists "Deny all public reads" on public.audit_requests;
drop policy if exists "Deny all public updates" on public.audit_requests;
drop policy if exists "Deny all public deletes" on public.audit_requests;
drop policy if exists "Allow server role full access" on public.audit_requests;

-- Revoke public access from anon and authenticated roles
revoke all on table public.audit_requests from anon;
revoke all on table public.audit_requests from authenticated;

-- Grant full access solely to service_role (used securely by server-side endpoints)
grant select, insert, update, delete on table public.audit_requests to service_role;
grant usage, select on all sequences in schema public to service_role;
