-- Marco 1 - Supabase base (infra e seguranca)
-- Objetivo: schema inicial + RLS + escrita somente admin

begin;

create extension if not exists pgcrypto;

-- =========================
-- Enums
-- =========================
create type papel_usuario as enum ('admin', 'moderador', 'jogador', 'torcedor');
create type tipo_competicao as enum ('campeonato', 'copa', 'playoff');
create type formato_competicao as enum ('turno_unico', 'eliminacao_direta', 'grupos_playoff');
create type status_temporada as enum ('rascunho', 'em_andamento', 'finalizada');
create type status_competicao as enum ('rascunho', 'em_andamento', 'finalizada', 'cancelada');
create type status_partida as enum ('agendada', 'ao_vivo', 'finalizada', 'cancelada');
create type tipo_evento as enum ('gol', 'assistencia', 'cartao_amarelo', 'cartao_vermelho', 'gol_contra');
create type tipo_midia as enum ('foto', 'video', 'logo', 'banner', 'uniforme');

-- =========================
-- Tabelas
-- =========================
create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null unique,
  papel papel_usuario not null default 'torcedor',
  url_avatar text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.ligas (
  id text primary key,
  nome text not null,
  url_logo text,
  cidade text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.temporadas (
  id text primary key,
  liga_id text not null references public.ligas(id) on delete cascade,
  nome text not null,
  slug text not null,
  ano integer not null check (ano >= 1900 and ano <= 2200),
  semestre text not null check (semestre in ('apertura', 'clausura')),
  data_inicio date not null,
  data_fim date not null,
  status status_temporada not null default 'rascunho',
  descricao text,
  url_banner text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint temporadas_liga_slug_uk unique (liga_id, slug),
  constraint temporadas_periodo_ck check (data_fim >= data_inicio)
);

create table if not exists public.competicoes (
  id text primary key,
  temporada_id text not null references public.temporadas(id) on delete cascade,
  nome text not null,
  slug text not null,
  tipo tipo_competicao not null,
  formato formato_competicao not null default 'turno_unico',
  data_inicio date,
  data_fim date,
  status status_competicao not null default 'rascunho',
  ordem integer not null default 0,
  descricao text,
  organizador text,
  url_logo text,
  url_banner text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint competicoes_temporada_slug_uk unique (temporada_id, slug),
  constraint competicoes_periodo_ck check (data_fim is null or data_inicio is null or data_fim >= data_inicio)
);

create table if not exists public.times (
  id text primary key,
  nome text not null,
  slug text unique,
  nome_curto text,
  url_logo text,
  url_foto_capa text,
  url_uniforme_titular text,
  cor_primaria text,
  cor_secundaria text,
  ano_fundacao integer check (ano_fundacao is null or (ano_fundacao >= 1800 and ano_fundacao <= 2200)),
  cidade text,
  alinhamento text,
  descricao text,
  historia text,
  origem text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.times_temporada (
  id text primary key,
  temporada_id text not null references public.temporadas(id) on delete cascade,
  time_id text not null references public.times(id) on delete cascade,
  inscrito_em timestamptz not null default now(),
  constraint times_temporada_uk unique (temporada_id, time_id)
);

create table if not exists public.jogadores (
  id text primary key,
  usuario_id uuid references auth.users(id) on delete set null,
  nome text not null,
  apelido text,
  url_foto text,
  data_nascimento date,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.registros_jogador (
  id text primary key,
  jogador_id text not null references public.jogadores(id) on delete cascade,
  time_id text not null references public.times(id) on delete cascade,
  temporada_id text not null references public.temporadas(id) on delete cascade,
  numero_camisa integer,
  posicao text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint registro_jogador_unico_por_temporada unique (jogador_id, temporada_id)
);

create table if not exists public.partidas (
  id text primary key,
  competicao_id text not null references public.competicoes(id) on delete cascade,
  time_casa_id text not null references public.times(id) on delete restrict,
  time_visitante_id text not null references public.times(id) on delete restrict,
  placar_casa integer,
  placar_visitante integer,
  data_hora timestamptz not null,
  rodada text not null,
  local text,
  status status_partida not null default 'agendada',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint partidas_times_distintos_ck check (time_casa_id <> time_visitante_id),
  constraint partidas_placar_ck check (
    (placar_casa is null and placar_visitante is null)
    or (placar_casa is not null and placar_visitante is not null and placar_casa >= 0 and placar_visitante >= 0)
  )
);

create table if not exists public.eventos_partida (
  id text primary key,
  partida_id text not null references public.partidas(id) on delete cascade,
  jogador_id text references public.jogadores(id) on delete set null,
  time_id text references public.times(id) on delete set null,
  tipo tipo_evento not null,
  minuto integer not null check (minuto >= 0 and minuto <= 180),
  criado_em timestamptz not null default now()
);

create table if not exists public.classificacao (
  id text primary key,
  competicao_id text not null references public.competicoes(id) on delete cascade,
  time_id text not null references public.times(id) on delete cascade,
  jogos integer not null default 0,
  vitorias integer not null default 0,
  empates integer not null default 0,
  derrotas integer not null default 0,
  gols_pro integer not null default 0,
  gols_contra integer not null default 0,
  pontos integer not null default 0,
  atualizado_em timestamptz not null default now(),
  constraint classificacao_competicao_time_uk unique (competicao_id, time_id),
  constraint classificacao_nao_negativa_ck check (
    jogos >= 0 and vitorias >= 0 and empates >= 0 and derrotas >= 0 and gols_pro >= 0 and gols_contra >= 0 and pontos >= 0
  )
);

create table if not exists public.midia (
  id text primary key,
  liga_id text not null references public.ligas(id) on delete cascade,
  temporada_id text references public.temporadas(id) on delete set null,
  partida_id text references public.partidas(id) on delete set null,
  time_id text references public.times(id) on delete set null,
  tipo tipo_midia not null,
  url text not null,
  url_thumbnail text,
  legenda text,
  titulo text,
  categoria text,
  escopo text,
  carregado_por uuid references auth.users(id) on delete set null,
  criado_em timestamptz not null default now()
);

create table if not exists public.podios (
  id text primary key,
  competicao_id text not null unique references public.competicoes(id) on delete cascade,
  time_primeiro_id text references public.times(id) on delete set null,
  time_segundo_id text references public.times(id) on delete set null,
  time_terceiro_id text references public.times(id) on delete set null,
  jogador_artilheiro_id text references public.jogadores(id) on delete set null,
  jogador_melhor_id text references public.jogadores(id) on delete set null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- =========================
-- Indices
-- =========================
create index if not exists idx_temporadas_liga_status on public.temporadas(liga_id, status);
create index if not exists idx_competicoes_temporada_status on public.competicoes(temporada_id, status);
create index if not exists idx_partidas_competicao_data on public.partidas(competicao_id, data_hora desc);
create index if not exists idx_classificacao_competicao_pontos on public.classificacao(competicao_id, pontos desc, gols_pro desc);
create index if not exists idx_midia_liga_escopo on public.midia(liga_id, escopo);

-- =========================
-- Trigger de atualizado_em
-- =========================
create or replace function public.set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists trg_usuarios_set_atualizado_em on public.usuarios;
create trigger trg_usuarios_set_atualizado_em before update on public.usuarios
for each row execute function public.set_atualizado_em();

drop trigger if exists trg_ligas_set_atualizado_em on public.ligas;
create trigger trg_ligas_set_atualizado_em before update on public.ligas
for each row execute function public.set_atualizado_em();

drop trigger if exists trg_temporadas_set_atualizado_em on public.temporadas;
create trigger trg_temporadas_set_atualizado_em before update on public.temporadas
for each row execute function public.set_atualizado_em();

drop trigger if exists trg_competicoes_set_atualizado_em on public.competicoes;
create trigger trg_competicoes_set_atualizado_em before update on public.competicoes
for each row execute function public.set_atualizado_em();

drop trigger if exists trg_times_set_atualizado_em on public.times;
create trigger trg_times_set_atualizado_em before update on public.times
for each row execute function public.set_atualizado_em();

drop trigger if exists trg_jogadores_set_atualizado_em on public.jogadores;
create trigger trg_jogadores_set_atualizado_em before update on public.jogadores
for each row execute function public.set_atualizado_em();

drop trigger if exists trg_registros_jogador_set_atualizado_em on public.registros_jogador;
create trigger trg_registros_jogador_set_atualizado_em before update on public.registros_jogador
for each row execute function public.set_atualizado_em();

drop trigger if exists trg_partidas_set_atualizado_em on public.partidas;
create trigger trg_partidas_set_atualizado_em before update on public.partidas
for each row execute function public.set_atualizado_em();

drop trigger if exists trg_classificacao_set_atualizado_em on public.classificacao;
create trigger trg_classificacao_set_atualizado_em before update on public.classificacao
for each row execute function public.set_atualizado_em();

drop trigger if exists trg_podios_set_atualizado_em on public.podios;
create trigger trg_podios_set_atualizado_em before update on public.podios
for each row execute function public.set_atualizado_em();

-- =========================
-- Funcoes de seguranca
-- =========================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.usuarios u
    where u.id = auth.uid() and u.papel = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- =========================
-- Grants basicos
-- =========================
grant usage on schema public to anon, authenticated;

grant select on
  public.ligas,
  public.temporadas,
  public.competicoes,
  public.times,
  public.times_temporada,
  public.jogadores,
  public.registros_jogador,
  public.partidas,
  public.eventos_partida,
  public.classificacao,
  public.midia,
  public.podios
to anon, authenticated;

-- Escrita somente authenticated + policy admin true
-- (anon nunca deve escrever)
grant insert, update, delete on
  public.usuarios,
  public.ligas,
  public.temporadas,
  public.competicoes,
  public.times,
  public.times_temporada,
  public.jogadores,
  public.registros_jogador,
  public.partidas,
  public.eventos_partida,
  public.classificacao,
  public.midia,
  public.podios
to authenticated;

-- =========================
-- Habilitar RLS
-- =========================
alter table public.usuarios enable row level security;
alter table public.ligas enable row level security;
alter table public.temporadas enable row level security;
alter table public.competicoes enable row level security;
alter table public.times enable row level security;
alter table public.times_temporada enable row level security;
alter table public.jogadores enable row level security;
alter table public.registros_jogador enable row level security;
alter table public.partidas enable row level security;
alter table public.eventos_partida enable row level security;
alter table public.classificacao enable row level security;
alter table public.midia enable row level security;
alter table public.podios enable row level security;

-- =========================
-- Policies de leitura publica controlada
-- =========================
create policy ligas_select_public on public.ligas
for select to anon, authenticated
using (true);

create policy temporadas_select_public on public.temporadas
for select to anon, authenticated
using (status <> 'rascunho');

create policy competicoes_select_public on public.competicoes
for select to anon, authenticated
using (status <> 'rascunho');

create policy times_select_public on public.times
for select to anon, authenticated
using (ativo = true);

create policy times_temporada_select_public on public.times_temporada
for select to anon, authenticated
using (true);

create policy jogadores_select_public on public.jogadores
for select to anon, authenticated
using (true);

create policy registros_jogador_select_public on public.registros_jogador
for select to anon, authenticated
using (true);

create policy partidas_select_public on public.partidas
for select to anon, authenticated
using (status in ('agendada', 'ao_vivo', 'finalizada'));

create policy eventos_partida_select_public on public.eventos_partida
for select to anon, authenticated
using (true);

create policy classificacao_select_public on public.classificacao
for select to anon, authenticated
using (true);

create policy midia_select_public on public.midia
for select to anon, authenticated
using (true);

create policy podios_select_public on public.podios
for select to anon, authenticated
using (true);

-- Usuarios: sem leitura anon. autenticado le apenas o proprio. admin le todos.
create policy usuarios_select_self_or_admin on public.usuarios
for select to authenticated
using (id = auth.uid() or public.is_admin());

-- =========================
-- Policies de escrita admin only
-- =========================
create policy usuarios_write_admin_only on public.usuarios
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy ligas_write_admin_only on public.ligas
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy temporadas_write_admin_only on public.temporadas
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy competicoes_write_admin_only on public.competicoes
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy times_write_admin_only on public.times
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy times_temporada_write_admin_only on public.times_temporada
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy jogadores_write_admin_only on public.jogadores
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy registros_jogador_write_admin_only on public.registros_jogador
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy partidas_write_admin_only on public.partidas
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy eventos_partida_write_admin_only on public.eventos_partida
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy classificacao_write_admin_only on public.classificacao
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy midia_write_admin_only on public.midia
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy podios_write_admin_only on public.podios
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

commit;

-- =========================
-- Bootstrap de primeiro admin (executar 1x, manual)
-- =========================
-- update public.usuarios
-- set papel = 'admin'
-- where email = 'SEU_EMAIL_AQUI';
