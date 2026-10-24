-- Disha Habitat website: feedback and leads.
-- Run once in the Supabase SQL editor (or `supabase db push`) on the project the site uses.
--
-- Both tables are written and read only by the website's server, with the service-role key
-- (SUPABASE_SERVICE_ROLE_KEY). Row-level security is on and no policy grants the anon or
-- authenticated roles anything, so the public anon key can neither read nor write them.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------------------------
-- Feedback: what a visitor said about a page, and exactly where on the page they pointed.
-- ---------------------------------------------------------------------------------------------
create table if not exists public.feedback (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- triage
  status        text not null default 'new'
                check (status in ('new', 'in_progress', 'done', 'wont_fix')),
  kind          text not null
                check (kind in ('problem', 'content', 'design', 'idea', 'praise', 'other')),
  priority      smallint check (priority between 1 and 3),
  team_note     text check (char_length(team_note) <= 2000),

  -- what they said
  message       text not null check (char_length(message) between 1 and 4000),
  name          text check (char_length(name) <= 120),
  email         text check (char_length(email) <= 200),

  -- where they were
  page_path     text not null check (char_length(page_path) <= 500),
  page_title    text check (char_length(page_title) <= 300),
  section       text check (char_length(section) <= 300),     -- e.g. "Our communities"
  target_label  text check (char_length(target_label) <= 300), -- e.g. "Card: Central Park"
  target_kind   text check (char_length(target_kind) <= 60),   -- heading, image, button, card…
  target_text   text check (char_length(target_text) <= 600),  -- the words in it, shortened
  selector      text check (char_length(selector) <= 1000),    -- CSS selector to find it again
  whole_page    boolean not null default false,

  -- what they saw
  rect          jsonb,   -- {x, y, width, height} in page pixels
  viewport      jsonb,   -- {width, height, dpr, scrollY}
  device        text check (device in ('phone', 'tablet', 'computer')),
  browser       text check (char_length(browser) <= 400),
  language      text check (char_length(language) <= 40),

  -- the same visitor across several notes (a random id kept in their browser; no personal data)
  visitor_id    text check (char_length(visitor_id) <= 64),
  meta          jsonb
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);
create index if not exists feedback_status_idx     on public.feedback (status);
create index if not exists feedback_page_idx       on public.feedback (page_path);
create index if not exists feedback_kind_idx       on public.feedback (kind);

-- ---------------------------------------------------------------------------------------------
-- Leads: every enquiry, site-visit request and message, saved before the visitor is handed to
-- WhatsApp, email or a call, so none is lost.
-- ---------------------------------------------------------------------------------------------
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  status        text not null default 'new'
                check (status in ('new', 'contacted', 'visit_booked', 'closed', 'spam')),
  kind          text not null
                check (kind in ('enquiry', 'site-visit', 'message', 'callback', 'guide')),

  name          text check (char_length(name) <= 120),
  phone         text check (char_length(phone) <= 40),
  email         text check (char_length(email) <= 200),
  interest      text check (char_length(interest) <= 200),
  message       text check (char_length(message) <= 4000),
  channel       text check (channel in ('whatsapp', 'email', 'call')),
  details       jsonb,
  consent       boolean not null,
  consent_text  text check (char_length(consent_text) <= 500),

  page_path     text check (char_length(page_path) <= 500),
  referrer      text check (char_length(referrer) <= 500),
  browser       text check (char_length(browser) <= 400),
  team_note     text check (char_length(team_note) <= 2000)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);

-- Keep updated_at current on every change.
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists feedback_touch on public.feedback;
create trigger feedback_touch before update on public.feedback
  for each row execute function public.touch_updated_at();

drop trigger if exists leads_touch on public.leads;
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------------------------
-- Access: server only. RLS on with no policies blocks anon and authenticated entirely.
-- ---------------------------------------------------------------------------------------------
alter table public.feedback enable row level security;
alter table public.leads    enable row level security;

revoke all on public.feedback from anon, authenticated;
revoke all on public.leads    from anon, authenticated;

grant select, insert, update, delete on public.feedback to service_role;
grant select, insert, update, delete on public.leads    to service_role;
