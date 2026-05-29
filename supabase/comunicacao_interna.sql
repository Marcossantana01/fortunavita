create table if not exists public.comunicacao_interna (
  id uuid primary key default gen_random_uuid(),
  area_origem text not null,
  area_destino text not null,
  remetente_nome text not null,
  remetente_tipo text,
  titulo text not null default 'Requisicao interna',
  assunto text not null default 'Comunicacao interna',
  mensagem text not null,
  resposta text,
  respondido_por text,
  respondido_em timestamptz,
  status text not null default 'aberta',
  created_at timestamptz not null default now()
);

alter table public.comunicacao_interna
  add column if not exists titulo text not null default 'Requisicao interna',
  add column if not exists resposta text,
  add column if not exists respondido_por text,
  add column if not exists respondido_em timestamptz;

create index if not exists comunicacao_interna_created_at_idx
  on public.comunicacao_interna (created_at);

create index if not exists comunicacao_interna_areas_idx
  on public.comunicacao_interna (area_origem, area_destino);

alter table public.comunicacao_interna enable row level security;

grant select, insert, update on public.comunicacao_interna to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'comunicacao_interna'
      and policyname = 'Permitir leitura de comunicacao interna'
  ) then
    create policy "Permitir leitura de comunicacao interna"
      on public.comunicacao_interna
      for select
      to anon, authenticated
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'comunicacao_interna'
      and policyname = 'Permitir registro de comunicacao interna'
  ) then
    create policy "Permitir registro de comunicacao interna"
      on public.comunicacao_interna
      for insert
      to anon, authenticated
      with check (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'comunicacao_interna'
      and policyname = 'Permitir atualizacao de comunicacao interna'
  ) then
    create policy "Permitir atualizacao de comunicacao interna"
      on public.comunicacao_interna
      for update
      to anon, authenticated
      using (true)
      with check (true);
  end if;
end $$;
