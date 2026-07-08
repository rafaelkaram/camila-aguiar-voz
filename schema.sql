-- ============================================================
-- Avaliação de Saúde Vocal — Camila Aguiar Fonoaudióloga
-- Schema Supabase / PostgreSQL
-- ============================================================

-- Sessões dos participantes
create table if not exists sessions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  nome            text not null,
  data_nascimento date not null,
  profissao       text not null,
  email           text
);

-- Respostas individuais por instrumento
create table if not exists responses (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid references sessions(id) on delete cascade,
  instrumento    text not null check (instrumento in ('idv10', 'habitos', 'fadiga')),
  question_index integer not null,
  valor          integer not null,
  created_at     timestamptz default now()
);

create index if not exists responses_session_idx on responses(session_id);

-- Resultados calculados
create table if not exists results (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid references sessions(id) on delete cascade,
  score_idv10    numeric not null default 0,
  score_habitos  numeric not null default 0,
  score_fadiga   numeric not null default 0,
  score_composto numeric not null default 0,
  classificacao  integer not null check (classificacao between 1 and 4),
  created_at     timestamptz default now()
);

create index if not exists results_session_idx on results(session_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table sessions  enable row level security;
alter table responses enable row level security;
alter table results   enable row level security;

-- Authenticated users (fonoaudióloga) can read everything
create policy "Auth users can read sessions"
  on sessions for select
  using (auth.role() = 'authenticated');

create policy "Auth users can read responses"
  on responses for select
  using (auth.role() = 'authenticated');

create policy "Auth users can read results"
  on results for select
  using (auth.role() = 'authenticated');

-- Public inserts are handled via service_role key in Server Actions
-- (no anon insert policies needed)

-- ============================================================
-- Optional: view to simplify dashboard queries
-- ============================================================

create or replace view sessions_with_results as
select
  s.id,
  s.created_at,
  s.nome,
  s.data_nascimento,
  s.profissao,
  s.email,
  date_part('year', age(s.data_nascimento)) as idade,
  r.score_idv10,
  r.score_habitos,
  r.score_fadiga,
  r.score_composto,
  r.classificacao
from sessions s
left join results r on r.session_id = s.id;
