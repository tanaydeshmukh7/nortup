-- ==============================================================================
-- NORTHUP STUDIO — Phase 3 Production Leads Migration
-- Table: leads
-- Description: Stores incoming client project enquiries from Northup Studio website
-- ==============================================================================

-- 1. Enable pgcrypto / uuid-ossp if not already available
create extension if not exists "pgcrypto";

-- 2. Create the leads table with rigorous constraints
create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    name text not null check (length(trim(name)) >= 2 and length(name) <= 100),
    email text not null check (
        length(trim(email)) <= 120 and 
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    company text check (company is null or length(trim(company)) <= 120),
    service text not null check (
        service in (
            'Website Design',
            'Web Development',
            'UI/UX Design',
            'Branding',
            'Other'
        )
    ),
    budget text check (
        budget is null or length(budget) <= 60
    ),
    timeline text check (
        timeline is null or length(timeline) <= 60
    ),
    project_description text not null check (
        length(trim(project_description)) >= 10 and 
        length(project_description) <= 3000
    ),
    source text not null default 'website_contact_form' check (length(source) <= 80),
    status text not null default 'new' check (
        status in (
            'new',
            'contacted',
            'in_review',
            'qualified',
            'proposal_sent',
            'closed_won',
            'closed_lost',
            'archived'
        )
    ),
    metadata jsonb default '{}'::jsonb
);

-- 3. Helpful Comment Documentation
comment on table public.leads is 'Stores production enquiries submitted via Northup Studio client intake flows.';
comment on column public.leads.status is 'Controlled lead lifecycle status: new, contacted, in_review, qualified, proposal_sent, closed_won, closed_lost, archived.';

-- 4. High-Performance Indexes for Admin Queries & Dashboards
create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_email on public.leads (email);
create index if not exists idx_leads_service on public.leads (service);

-- 5. Row Level Security (RLS) Configuration
-- Strictly isolate leads to prevent unauthorized public reads, updates, or deletions.
alter table public.leads enable row level security;

-- Drop any conflicting or legacy policies
drop policy if exists "Deny all public reads" on public.leads;
drop policy if exists "Deny all public updates" on public.leads;
drop policy if exists "Deny all public deletes" on public.leads;
drop policy if exists "Allow server role full access" on public.leads;

-- Explicitly revoke public access from anon and authenticated roles
revoke all on table public.leads from anon;
revoke all on table public.leads from authenticated;

-- Grant full access solely to service_role (used securely by the server-side /api/contact endpoint)
grant select, insert, update, delete on table public.leads to service_role;
grant usage, select on all sequences in schema public to service_role;

-- Verification query
-- SELECT count(*) FROM public.leads;
