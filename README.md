# NORTHUP STUDIO — Official Production Website

**Production Domain:** [https://northupstudio.vercel.app/](https://northupstudio.vercel.app/)  
**Design & Engineering:** Northup Studio  

NORTHUP STUDIO is an independent creative studio specializing in bespoke website design, web development, UI/UX architecture, and brand platforms.

---

## Architecture Overview

- **Frontend:** React 18, Vite 6, Tailwind CSS, Framer Motion, Three.js / React Three Fiber, Lenis smooth scrolling.
- **Serverless API:** Vercel Node.js Serverless Functions located in `/api/`.
- **Database & Leads Storage:** Supabase PostgreSQL with strict Row Level Security (RLS).
- **SEO & Social Sharing:** Dynamic centralized SEO registry, Schema.org JSON-LD structured data, and automated post-build static pre-rendering for all case study routes.

---

## Phase 3: Production Client Enquiry & Supabase Setup

Phase 3 introduces an enterprise-grade client intake and lead generation pipeline.

### 1. Database Migration (Supabase)

The migration file is located at:
[`supabase/migrations/20261101_create_leads_table.sql`](./supabase/migrations/20261101_create_leads_table.sql)

#### Steps to Apply:
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project (or create a new one: e.g. `northup-studio-production`).
3. In the left sidebar, click **SQL Editor**.
4. Click **New Query**.
5. Copy the entire contents of `supabase/migrations/20261101_create_leads_table.sql` and paste it into the editor.
6. Click **Run** (or `Ctrl+Enter`).
7. Verify table creation under **Table Editor** > `public.leads`.

#### Table Schema:
- `id`: UUID primary key (`gen_random_uuid()`).
- `created_at`: timestamptz with default `now()`.
- `name`: Text (2 to 100 characters, required).
- `email`: Text (validated format, up to 120 characters, required).
- `company`: Text (optional, up to 120 characters).
- `service`: Text (`Website Design`, `Web Development`, `UI/UX Design`, `Branding`, `Other`).
- `budget`: Text (selectable range: `< $5,000`, `$5,000 – $10,000`, `$10,000 – $25,000`, `$25,000+`, `Flexible / Undisclosed`).
- `timeline`: Text (`Immediately (< 2 weeks)`, `1 – 2 months`, `2 – 3 months`, `Flexible`).
- `project_description`: Text (10 to 3000 characters, required).
- `source`: Text (`website_contact_form`, `contact_modal_...`).
- `status`: Controlled lead lifecycle state (`new`, `contacted`, `in_review`, `qualified`, `proposal_sent`, `closed_won`, `closed_lost`, `archived`).
- `metadata`: JSONB for IP hash, user agent, and referrer diagnostics.

#### Security & Row Level Security (RLS):
- RLS is enabled on `public.leads`.
- Public access (`anon` and `authenticated`) is completely revoked. Anonymous users cannot read, list, modify, or delete leads.
- Full access is granted solely to the internal `service_role`, used safely inside the `/api/contact` serverless function.

---

### 2. Environment Variables Configuration

Copy `.env.example` to `.env` for local testing:

```bash
cp .env.example .env
```

#### Required Variables in Vercel:
Go to **Vercel Dashboard** > **Project Settings** > **Environment Variables**:

| Variable Name | Environment | Description |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Production, Preview, Dev | Your Supabase Project URL (`https://<project-ref>.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Dev | Your secret `service_role` key (found in Supabase Settings > API) |
| `RESEND_API_KEY` | *(Optional)* Production | Resend API key (`re_...`) for real-time email dispatch |
| `CONTACT_NOTIFICATION_EMAIL` | *(Optional)* Production | Recipient inbox for new enquiries (default: `northup4work@gmail.com`) |

> **IMPORTANT:** Never prefix `SUPABASE_SERVICE_ROLE_KEY` with `VITE_`. Vercel Serverless Functions have direct access to server-side environment variables, ensuring your service role key is never bundled or transmitted to the browser.

---

### 3. Serverless Endpoint & Anti-Spam Architecture

The submission endpoint is located at [`api/contact.js`](./api/contact.js):
- **Rate Limiting:** Protects against abuse by limiting requests per IP window.
- **Honeypot Trap:** Hidden `website_hp` field traps automated form bots without false alarms.
- **Input Sanitization:** Strips control characters, enforces field length boundaries, and validates email syntax on the server.
- **Safe Failure Handling:** If Supabase credentials are missing or database connection fails, the endpoint returns a clear 503/500 code with friendly client instructions and zero sensitive stack trace leaks.

---

## Local Development & Build

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

### Build Production Bundle & Pre-render SEO Routes
```bash
npm run build
```
This runs `vite build` followed by `node scripts/prerender-seo.cjs`, which creates static SEO HTML files for all case study routes in `dist/work/*/index.html`.

### Run Automated Verification Suite
```bash
node scripts/verify-seo-production.cjs
```
Runs 45 automated Playwright browser tests verifying static assets, clean metadata, single H1 heading hierarchy, Schema.org JSON-LD, and zero console errors.
