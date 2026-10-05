-- ShadowMeet meetings schema (Supabase / PostgreSQL).
-- The Express backend currently uses an in-memory store with the same shape;
-- point DATABASE_URL here and swap the store layer without changing APIs.
-- Never store raw passwords/secrets: only sha256 hashes (see server/livekit.js).

create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  room_id text unique not null,
  meeting_code text unique not null,
  title text not null default 'ShadowMeet Room',
  room_type text not null default 'meeting'
    check (room_type in ('meeting','classroom','webinar','study','watch')),
  host_id text not null,
  host_name text not null default 'Host',
  host_token_hash text not null,
  password_hash text,
  scheduled_at timestamptz,
  expires_at timestamptz not null,
  status text not null default 'active'
    check (status in ('scheduled','waiting','active','ended','expired')),
  locked boolean not null default false,
  settings jsonb not null default '{"waitingRoom":false,"allowUnmute":true,"allowVideo":true,"whiteboardEnabled":true,"classroomMode":false}',
  created_at timestamptz not null default now()
);
create index if not exists meetings_code_idx on meetings (meeting_code);
create index if not exists meetings_status_idx on meetings (status);
create index if not exists meetings_expires_idx on meetings (expires_at);

create table if not exists meeting_participants (
  id uuid primary key default gen_random_uuid(),
  meeting_code text not null references meetings (meeting_code) on delete cascade,
  participant_id text not null,
  display_name text not null,
  role text not null default 'participant' check (role in ('host','cohost','participant')),
  joined_at timestamptz not null default now(),
  unique (meeting_code, participant_id)
);

create table if not exists meeting_settings (
  meeting_code text primary key references meetings (meeting_code) on delete cascade,
  waiting_room boolean not null default false,
  allow_unmute boolean not null default true,
  allow_video boolean not null default true,
  whiteboard_enabled boolean not null default true,
  classroom_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists scheduled_meetings (
  id uuid primary key default gen_random_uuid(),
  meeting_code text not null references meetings (meeting_code) on delete cascade,
  scheduled_at timestamptz not null,
  duration_min integer not null default 60,
  recurrence text,
  created_at timestamptz not null default now()
);

create table if not exists meeting_events (
  id bigserial primary key,
  meeting_code text not null,
  kind text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);
create index if not exists meeting_events_code_idx on meeting_events (meeting_code);
