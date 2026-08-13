-- Marco 2 - Validacao de contagem fonte vs destino
-- Rode apos executar scripts/out/marco2/import_job.sql no Supabase

select 'ligas' as entidade, count(*) as destino_count from public.ligas
union all
select 'temporadas', count(*) from public.temporadas
union all
select 'competicoes', count(*) from public.competicoes
union all
select 'times', count(*) from public.times
union all
select 'times_temporada', count(*) from public.times_temporada
union all
select 'jogadores', count(*) from public.jogadores
union all
select 'registros_jogador', count(*) from public.registros_jogador
union all
select 'partidas', count(*) from public.partidas
union all
select 'classificacao', count(*) from public.classificacao
union all
select 'podios', count(*) from public.podios
union all
select 'midia', count(*) from public.midia
order by entidade;
