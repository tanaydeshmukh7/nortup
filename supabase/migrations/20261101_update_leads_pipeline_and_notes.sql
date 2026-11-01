-- ==============================================================================
-- NORTHUP STUDIO — Phase 4 Migration: Lead Pipeline, Internal Notes & Admin Users
-- Description:
-- 1. Updates leads.status constraint to exact Phase 4 pipeline:
--    'new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'
--    (with backwards-compatible aliases for closed_won/closed_lost/in_review)
-- 2. Migrates existing closed_won -> won and closed_lost -> lost
-- 3. Creates lead_notes table with foreign key to leads and strict RLS
-- 4. Creates admin_users table for database-driven admin allowlist
-- ==============================================================================

-- 1. Safely update status check constraint on leads table
alter table public.leads drop constraint if exists leads_status_check;

alter table public.leads add constraint leads_status_check check (
    status in (
        'new',
        'contacted',
        'qualified',
        'proposal_sent',
        'won',
        'lost',
        -- Backwards compatibility aliases
        'closed_won',
        'closed_lost',
        'in_review',
        'archived'
    )
);

-- 2. Migrate existing status values to new canonical pipeline
update public.leads set status = 'won' where status = 'closed_won';
update public.leads set status = 'lost' where status = 'closed_lost';

-- 3. Create lead_notes table for private internal administration
create table if not exists public.lead_notes (
    id uuid primary key default gen_random_uuid(),
    lead_id uuid not null references public.leads(id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    author_email text not null check (length(trim(author_email)) > 0),
    content text not null check (length(trim(content)) >= 1 and length(content) <= 3000)
);

comment on table public.lead_notes is 'Stores private internal team notes for customer enquiries.';

-- Performance Indexes for lead notes
create index if not exists idx_lead_notes_lead_id on public.lead_notes (lead_id);
create index if not exists idx_lead_notes_created_at on public.lead_notes (created_at desc);

-- Row Level Security (RLS) for lead_notes
alter table public.lead_notes enable row level security;

-- Revoke all access from anon and authenticated public clients
revoke all on table public.lead_notes from anon;
revoke all on table public.lead_notes from authenticated;

-- Grant full management permissions strictly to service_role (used by serverless API)
grant select, insert, update, delete on table public.lead_notes to service_role;

-- 4. Create admin_users table for explicit admin authorization
create table if not exists public.admin_users (
    id uuid primary key default gen_random_uuid(),
    email text not null unique check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    role text not null default 'admin' check (role in ('admin', 'super_admin')),
    created_at timestamptz not null default now()
);

comment on table public.admin_users is 'Explicit allowlist of users authorized to access Northup Studio Admin Dashboard.';

-- Row Level Security (RLS) for admin_users
alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon;
revoke all on table public.admin_users from authenticated;
grant select, insert, update, delete on table public.admin_users to service_role;

-- Seed default primary studio email into admin_users allowlist
insert into public.admin_users (email, role)
values ('northup4work@gmail.com', 'super_admin')
on conflict (email) do nothing;
