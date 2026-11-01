-- ==============================================================================
-- NORTHUP STUDIO — Phase B: CRM Expansion Migration
-- Description:
-- 1. Updates leads.status constraint to include 'negotiation'
-- 2. Adds phone, next_follow_up_date, follow_up_completed, converted_at to leads
-- 3. Creates communication_logs table for email/WhatsApp/meeting audit trail
-- 4. Creates proposals table for client scope, pricing, terms, and delivery tracking
-- 5. Creates message_templates table for editable agency communication templates
-- ==============================================================================

-- 1. Safely update status check constraint on leads table
alter table public.leads drop constraint if exists leads_status_check;

alter table public.leads add constraint leads_status_check check (
    status in (
        'new',
        'contacted',
        'qualified',
        'proposal_sent',
        'negotiation',
        'won',
        'lost',
        -- Backwards compatibility aliases
        'closed_won',
        'closed_lost',
        'in_review',
        'archived'
    )
);

-- 2. Add CRM fields to leads table if they don't already exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leads' and column_name = 'phone') then
        alter table public.leads add column phone text;
    end if;

    if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leads' and column_name = 'next_follow_up_date') then
        alter table public.leads add column next_follow_up_date timestamptz;
    end if;

    if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leads' and column_name = 'follow_up_completed') then
        alter table public.leads add column follow_up_completed boolean default false;
    end if;

    if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leads' and column_name = 'converted_at') then
        alter table public.leads add column converted_at timestamptz;
    end if;

    if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leads' and column_name = 'converted_client_id') then
        alter table public.leads add column converted_client_id text;
    end if;
end $$;

-- 3. Communication Logs Table
create table if not exists public.communication_logs (
    id uuid primary key default gen_random_uuid(),
    lead_id uuid not null references public.leads(id) on delete cascade,
    channel text not null check (channel in ('email', 'whatsapp', 'call', 'meeting', 'note')),
    direction text not null default 'outbound' check (direction in ('inbound', 'outbound')),
    recipient text,
    subject text,
    template_key text,
    content text not null,
    status text not null check (status in ('sent', 'delivered', 'failed', 'scheduled', 'draft', 'manual_opened')),
    provider_id text,
    error_message text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists idx_comm_logs_lead_id on public.communication_logs(lead_id);
create index if not exists idx_comm_logs_created_at on public.communication_logs(created_at desc);

alter table public.communication_logs enable row level security;
revoke all on table public.communication_logs from anon;
revoke all on table public.communication_logs from authenticated;
grant select, insert, update, delete on table public.communication_logs to service_role;

-- 4. Proposals Table
create table if not exists public.proposals (
    id uuid primary key default gen_random_uuid(),
    lead_id uuid not null references public.leads(id) on delete cascade,
    proposal_number text not null unique,
    title text not null,
    client_name text not null,
    client_email text not null,
    client_company text,
    project_overview text,
    deliverables jsonb default '[]'::jsonb,
    milestones jsonb default '[]'::jsonb,
    line_items jsonb default '[]'::jsonb,
    currency text default 'USD',
    subtotal numeric(12,2) default 0,
    tax_rate numeric(5,2) default 0,
    total_amount numeric(12,2) default 0,
    payment_terms text,
    valid_until date,
    exclusions text,
    notes text,
    status text not null default 'draft' check (status in ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
    sent_at timestamptz,
    accepted_at timestamptz,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_proposals_lead_id on public.proposals(lead_id);
create index if not exists idx_proposals_created_at on public.proposals(created_at desc);

alter table public.proposals enable row level security;
revoke all on table public.proposals from anon;
revoke all on table public.proposals from authenticated;
grant select, insert, update, delete on table public.proposals to service_role;

-- 5. Message Templates Table
create table if not exists public.message_templates (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    title text not null,
    category text not null,
    subject text,
    body_email text not null,
    body_whatsapp text not null,
    variables jsonb not null default '[]'::jsonb,
    is_system boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.message_templates enable row level security;
revoke all on table public.message_templates from anon;
revoke all on table public.message_templates from authenticated;
grant select, insert, update, delete on table public.message_templates to service_role;
