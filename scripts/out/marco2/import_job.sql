-- Marco 2 - Importacao inicial idempotente
-- Gerado automaticamente por scripts/import_supabase_marco2.py
-- generated_at: 2026-07-30T19:52:20Z

begin;

insert into public.ligas (id, nome, url_logo, cidade, criado_em, atualizado_em)
values
  ('l1', 'Liga de Futebol Antifascista (LFA)', '/logos/gerais/lfa.png', NULL, '2022-01-01T00:00:00Z', '2026-07-23T00:00:00Z')
on conflict (id) do update set
  nome = excluded.nome, url_logo = excluded.url_logo, cidade = excluded.cidade, criado_em = excluded.criado_em, atualizado_em = excluded.atualizado_em;

insert into public.temporadas (id, liga_id, nome, slug, ano, semestre, data_inicio, data_fim, status, descricao, url_banner, criado_em, atualizado_em)
values
  ('season-2022-a', 'l1', 'Apertura 22', 'apertura-22', 2022, 'apertura', '2022-03-01', '2022-06-30', 'finalizada', 'Primeira temporada da LFA em 2022.', '/banners/2022-apertura.jpg', '2022-03-01T00:00:00Z', '2022-07-01T00:00:00Z'),
  ('season-2022-c', 'l1', 'Clausura 22', 'clausura-22', 2022, 'clausura', '2022-07-01', '2022-10-31', 'finalizada', 'Segunda temporada da LFA em 2022.', '/banners/2022-clausura.jpg', '2022-07-01T00:00:00Z', '2022-11-01T00:00:00Z'),
  ('season-2023-a', 'l1', 'Apertura 23', 'apertura-23', 2023, 'apertura', '2023-03-01', '2023-06-30', 'finalizada', 'Temporada de 2023 com forte presença da Taça Cecília.', '/banners/2023-apertura.jpg', '2023-03-01T00:00:00Z', '2023-07-01T00:00:00Z'),
  ('season-2023-c', 'l1', 'Clausura 23', 'clausura-23', 2023, 'clausura', '2023-07-01', '2023-10-31', 'finalizada', 'Clausura de 2023.', '/banners/2023-clausura.jpg', '2023-07-01T00:00:00Z', '2023-11-01T00:00:00Z'),
  ('season-2024-a', 'l1', 'Apertura 24', 'apertura-24', 2024, 'apertura', '2024-03-01', '2024-06-30', 'finalizada', 'Temporada de 2024 com edição da Taça Cecília.', '/banners/2024-apertura.jpg', '2024-03-01T00:00:00Z', '2024-07-01T00:00:00Z'),
  ('season-2024-c', 'l1', 'Clausura 24', 'clausura-24', 2024, 'clausura', '2024-07-01', '2024-10-31', 'finalizada', 'Clausura de 2024.', '/banners/2024-clausura.jpg', '2024-07-01T00:00:00Z', '2024-11-01T00:00:00Z'),
  ('season-2025-a', 'l1', 'Apertura 25', 'apertura-25', 2025, 'apertura', '2025-03-01', '2025-06-30', 'finalizada', 'Taça Cecília 2025 Apertura e Copa Eric Cantona.', '/banners/2025-apertura.jpg', '2025-03-01T00:00:00Z', '2025-07-01T00:00:00Z'),
  ('season-2025-c', 'l1', 'Clausura 25', 'clausura-25', 2025, 'clausura', '2025-07-01', '2025-10-31', 'finalizada', 'Taça Cecília 2025 Clausura.', '/banners/2025-clausura.jpg', '2025-07-01T00:00:00Z', '2025-11-01T00:00:00Z'),
  ('season-2026-a', 'l1', 'Apertura 26', 'apertura-26', 2026, 'apertura', '2026-03-01', '2026-06-30', 'em_andamento', 'Temporada atual da LFA em 2026.', '/banners/2026-apertura.jpg', '2026-02-01T00:00:00Z', '2026-05-28T00:00:00Z')
on conflict (id) do update set
  liga_id = excluded.liga_id, nome = excluded.nome, slug = excluded.slug, ano = excluded.ano, semestre = excluded.semestre, data_inicio = excluded.data_inicio, data_fim = excluded.data_fim, status = excluded.status, descricao = excluded.descricao, url_banner = excluded.url_banner, criado_em = excluded.criado_em, atualizado_em = excluded.atualizado_em;

insert into public.competicoes (id, temporada_id, nome, slug, tipo, formato, data_inicio, data_fim, status, ordem, descricao, organizador, url_logo, url_banner, criado_em, atualizado_em)
values
  ('comp-2022-a-01', 'season-2022-a', 'Taça Cecília', 'taca-cecilia', 'campeonato', 'grupos_playoff', '2022-03-01', '2022-06-30', 'finalizada', 1, 'Competição principal da Apertura 2022 da LFA.', 'LFA', '/logos/gerais/logo_cecilia.jpg', '/banners/taca-cecilia.jpg', '2022-02-01T00:00:00Z', '2022-07-01T00:00:00Z'),
  ('comp-2022-a-02', 'season-2022-a', 'Copa Carlos Caszely', 'copa-carlos-caszely', 'copa', 'eliminacao_direta', '2022-03-01', '2022-06-30', 'finalizada', 2, 'Copa disputada na Apertura 2022.', 'LFA', '/logos/gerais/logo_caszely.jpg', '/banners/copa-caszely.jpg', '2022-02-01T00:00:00Z', '2022-07-01T00:00:00Z'),
  ('comp-2022-a-03', 'season-2022-a', 'Copa Eric Cantona', 'copa-eric-cantona', 'copa', 'eliminacao_direta', '2022-03-01', '2022-06-30', 'finalizada', 3, 'Copa dedicada à memória de Eric Cantona na Apertura 2022.', 'LFA', '/logos/gerais/logo_cantona.jpg', '/banners/copa-cantona.jpg', '2022-02-01T00:00:00Z', '2022-07-01T00:00:00Z'),
  ('comp-2022-c-01', 'season-2022-c', 'Copa Carlos Caszely', 'copa-carlos-caszely', 'copa', 'eliminacao_direta', '2022-07-01', '2022-10-31', 'finalizada', 1, 'Copa disputada na Clausura 2022.', 'LFA', '/logos/gerais/logo_caszely.jpg', '/banners/copa-caszely.jpg', '2022-06-20T00:00:00Z', '2022-11-01T00:00:00Z'),
  ('comp-2022-c-02', 'season-2022-c', 'Copa Eric Cantona', 'copa-eric-cantona', 'copa', 'eliminacao_direta', '2022-07-01', '2022-10-31', 'finalizada', 2, 'Copa dedicada à memória de Eric Cantona na Clausura 2022.', 'LFA', '/logos/gerais/logo_cantona.jpg', '/banners/copa-cantona.jpg', '2022-06-20T00:00:00Z', '2022-11-01T00:00:00Z'),
  ('comp-2022-c-03', 'season-2022-c', 'Taça Cecília', 'taca-cecilia', 'campeonato', 'grupos_playoff', '2022-07-01', '2022-10-31', 'finalizada', 3, 'Competição principal da Clausura 2022 da LFA.', 'LFA', '/logos/gerais/logo_cecilia.jpg', '/banners/taca-cecilia.jpg', '2022-06-20T00:00:00Z', '2022-11-01T00:00:00Z'),
  ('comp-2023-a-01', 'season-2023-a', 'Taça Cecília', 'taca-cecilia', 'campeonato', 'grupos_playoff', '2023-03-01', '2023-06-30', 'finalizada', 1, 'Competição principal da Apertura 2023 da LFA.', 'LFA', '/logos/gerais/logo_cecilia.jpg', '/banners/taca-cecilia.jpg', '2023-02-01T00:00:00Z', '2023-07-01T00:00:00Z'),
  ('comp-2023-a-02', 'season-2023-a', 'Copa Eric Cantona', 'copa-eric-cantona', 'copa', 'eliminacao_direta', '2023-03-01', '2023-06-30', 'finalizada', 2, 'Copa dedicada à memória de Eric Cantona na Apertura 2023.', 'LFA', '/logos/gerais/logo_cantona.jpg', '/banners/copa-cantona.jpg', '2023-02-01T00:00:00Z', '2023-07-01T00:00:00Z'),
  ('comp-2023-a-03', 'season-2023-a', 'Copa Carlos Caszely', 'copa-carlos-caszely', 'copa', 'eliminacao_direta', '2023-03-01', '2023-06-30', 'finalizada', 3, 'Copa disputada na Apertura 2023.', 'LFA', '/logos/gerais/logo_caszely.jpg', '/banners/copa-caszely.jpg', '2023-02-01T00:00:00Z', '2023-07-01T00:00:00Z'),
  ('comp-2023-c-01', 'season-2023-c', 'Taça Cecília', 'taca-cecilia', 'campeonato', 'grupos_playoff', '2023-07-01', '2023-10-31', 'finalizada', 1, 'Competição principal da Clausura 2023 da LFA.', 'LFA', '/logos/gerais/logo_cecilia.jpg', '/banners/taca-cecilia.jpg', '2023-06-20T00:00:00Z', '2023-11-01T00:00:00Z'),
  ('comp-2023-c-02', 'season-2023-c', 'Copa Eric Cantona', 'copa-eric-cantona', 'copa', 'eliminacao_direta', '2023-07-01', '2023-10-31', 'finalizada', 2, 'Copa dedicada à memória de Eric Cantona na Clausura 2023.', 'LFA', '/logos/gerais/logo_cantona.jpg', '/banners/copa-cantona.jpg', '2023-06-20T00:00:00Z', '2023-11-01T00:00:00Z'),
  ('comp-2023-c-03', 'season-2023-c', 'Copa Carlos Caszely', 'copa-carlos-caszely', 'copa', 'eliminacao_direta', '2023-07-01', '2023-10-31', 'finalizada', 3, 'Copa disputada na Clausura 2023.', 'LFA', '/logos/gerais/logo_caszely.jpg', '/banners/copa-caszely.jpg', '2023-06-20T00:00:00Z', '2023-11-01T00:00:00Z'),
  ('comp-2024-a-01', 'season-2024-a', 'Copa Eric Cantona', 'copa-eric-cantona', 'copa', 'eliminacao_direta', '2024-03-01', '2024-06-30', 'finalizada', 1, 'Copa dedicada à memória de Eric Cantona na Apertura 2024.', 'LFA', '/logos/gerais/logo_cantona.jpg', '/banners/copa-cantona.jpg', '2024-02-01T00:00:00Z', '2024-07-01T00:00:00Z'),
  ('comp-2024-a-02', 'season-2024-a', 'Copa Carlos Caszely', 'copa-carlos-caszely', 'copa', 'eliminacao_direta', '2024-03-01', '2024-06-30', 'finalizada', 2, 'Copa disputada na Apertura 2024.', 'LFA', '/logos/gerais/logo_caszely.jpg', '/banners/copa-caszely.jpg', '2024-02-01T00:00:00Z', '2024-07-01T00:00:00Z'),
  ('comp-2024-a-03', 'season-2024-a', 'Taça Cecília', 'taca-cecilia', 'campeonato', 'grupos_playoff', '2024-03-01', '2024-06-30', 'finalizada', 3, 'Competição principal da Apertura 2024 da LFA.', 'LFA', '/logos/gerais/logo_cecilia.jpg', '/banners/taca-cecilia.jpg', '2024-02-01T00:00:00Z', '2024-07-01T00:00:00Z'),
  ('comp-2024-c-01', 'season-2024-c', 'Copa Carlos Caszely', 'copa-carlos-caszely', 'copa', 'eliminacao_direta', '2024-07-01', '2024-10-31', 'finalizada', 1, 'Copa disputada na Clausura 2024.', 'LFA', '/logos/gerais/logo_caszely.jpg', '/banners/copa-caszely.jpg', '2024-06-20T00:00:00Z', '2024-11-01T00:00:00Z'),
  ('comp-2024-c-02', 'season-2024-c', 'Copa Eric Cantona', 'copa-eric-cantona', 'copa', 'eliminacao_direta', '2024-07-01', '2024-10-31', 'finalizada', 2, 'Copa dedicada à memória de Eric Cantona na Clausura 2024.', 'LFA', '/logos/gerais/logo_cantona.jpg', '/banners/copa-cantona.jpg', '2024-06-20T00:00:00Z', '2024-11-01T00:00:00Z'),
  ('comp-2024-c-03', 'season-2024-c', 'Taça Cecília', 'taca-cecilia', 'campeonato', 'grupos_playoff', '2024-07-01', '2024-10-31', 'finalizada', 3, 'Competição principal da Clausura 2024 da LFA.', 'LFA', '/logos/gerais/logo_cecilia.jpg', '/banners/taca-cecilia.jpg', '2024-06-20T00:00:00Z', '2024-11-01T00:00:00Z'),
  ('comp-2025-a-01', 'season-2025-a', 'Taça Wladimir Rodrigues', 'taca-wladimir-rodrigues', 'copa', 'grupos_playoff', '2025-03-01', '2025-06-30', 'finalizada', 1, 'Competição disputada na Apertura 2025 da LFA.', 'LFA', '/logos/gerais/logo_wladimir.jpg', '/banners/taca-wladimir.jpg', '2025-02-01T00:00:00Z', '2025-07-01T00:00:00Z'),
  ('comp-2025-a-02', 'season-2025-a', 'Copa Carlos Caszely', 'copa-carlos-caszely', 'copa', 'eliminacao_direta', '2025-03-01', '2025-06-30', 'finalizada', 2, 'Copa disputada na Apertura 2025.', 'LFA', '/logos/gerais/logo_caszely.jpg', '/banners/copa-caszely.jpg', '2025-02-01T00:00:00Z', '2025-07-01T00:00:00Z'),
  ('comp-2025-a-03', 'season-2025-a', 'Copa Eric Cantona', 'copa-eric-cantona', 'copa', 'eliminacao_direta', '2025-03-01', '2025-06-30', 'finalizada', 3, 'Copa dedicada à memória de Eric Cantona na Apertura 2025.', 'LFA', '/logos/gerais/logo_cantona.jpg', '/banners/copa-cantona.jpg', '2025-02-01T00:00:00Z', '2025-07-01T00:00:00Z'),
  ('comp-2025-a-04', 'season-2025-a', 'Taça Cecília', 'taca-cecilia', 'campeonato', 'grupos_playoff', '2025-03-01', '2025-06-30', 'finalizada', 4, 'Competição principal da Apertura 2025 da LFA.', 'LFA', '/logos/gerais/logo_cecilia.jpg', '/banners/taca-cecilia.jpg', '2025-02-01T00:00:00Z', '2025-07-01T00:00:00Z'),
  ('comp-2025-a-05', 'season-2025-a', 'Taça Sissi', 'taca-sissi', 'copa', 'grupos_playoff', '2025-03-01', '2025-06-30', 'finalizada', 5, 'Competição especial da Apertura 2025.', 'LFA', '/logos/gerais/logo_sissi.jpg', '/banners/taca-sissi.jpg', '2025-02-01T00:00:00Z', '2025-07-01T00:00:00Z'),
  ('comp-2025-c-01', 'season-2025-c', 'Copa Carlos Caszely', 'copa-carlos-caszely', 'copa', 'eliminacao_direta', '2025-07-01', '2025-10-31', 'finalizada', 1, 'Copa disputada na Clausura 2025.', 'LFA', '/logos/gerais/logo_caszely.jpg', '/banners/copa-caszely.jpg', '2025-06-20T00:00:00Z', '2025-11-01T00:00:00Z'),
  ('comp-2025-c-02', 'season-2025-c', 'Copa Eric Cantona', 'copa-eric-cantona', 'copa', 'eliminacao_direta', '2025-07-01', '2025-10-31', 'finalizada', 2, 'Copa dedicada à memória de Eric Cantona na Clausura 2025.', 'LFA', '/logos/gerais/logo_cantona.jpg', '/banners/copa-cantona.jpg', '2025-06-20T00:00:00Z', '2025-11-01T00:00:00Z'),
  ('comp-2025-c-03', 'season-2025-c', 'Taça Wladimir Rodrigues', 'taca-wladimir-rodrigues', 'copa', 'grupos_playoff', '2025-07-01', '2025-10-31', 'finalizada', 3, 'Competição disputada na Clausura 2025 da LFA.', 'LFA', '/logos/gerais/logo_wladimir.jpg', '/banners/taca-wladimir.jpg', '2025-06-20T00:00:00Z', '2025-11-01T00:00:00Z'),
  ('comp-2025-c-04', 'season-2025-c', 'Taça Cecília', 'taca-cecilia', 'campeonato', 'grupos_playoff', '2025-07-01', '2025-10-31', 'finalizada', 4, 'Competição principal da Clausura 2025 da LFA.', 'LFA', '/logos/gerais/logo_cecilia.jpg', '/banners/taca-cecilia.jpg', '2025-06-20T00:00:00Z', '2025-11-01T00:00:00Z'),
  ('comp-2025-c-05', 'season-2025-c', 'Supertaça', 'supertaca', 'copa', 'eliminacao_direta', '2025-07-01', '2025-10-31', 'finalizada', 5, 'Supertaça disputada na Clausura 2025.', 'LFA', '/logos/gerais/escudo_LFA.jpg', '/banners/supertaca.jpg', '2025-06-20T00:00:00Z', '2025-11-01T00:00:00Z'),
  ('comp-2025-c-06', 'season-2025-c', 'Recopa', 'recopa', 'copa', 'eliminacao_direta', '2025-07-01', '2025-10-31', 'finalizada', 6, 'Recopa disputada na Clausura 2025.', 'LFA', '/logos/gerais/escudo_LFA.jpg', '/banners/recopa.jpg', '2025-06-20T00:00:00Z', '2025-11-01T00:00:00Z'),
  ('comp-2026-a-01', 'season-2026-a', 'Copa Foice', 'copa-foice', 'copa', 'eliminacao_direta', '2026-03-01', '2026-06-30', 'em_andamento', 1, 'Competição disputada na Apertura 2026 da LFA.', 'LFA', '/logos/gerais/logo_foice.jpg', '/banners/copa-foice.jpg', '2026-02-01T00:00:00Z', '2026-05-28T00:00:00Z'),
  ('comp-2026-a-02', 'season-2026-a', 'Copa Carlos Caszely', 'copa-carlos-caszely', 'copa', 'eliminacao_direta', '2026-03-01', '2026-06-30', 'em_andamento', 2, 'Copa disputada na Apertura 2026.', 'LFA', '/logos/gerais/logo_caszely.jpg', '/banners/copa-caszely.jpg', '2026-02-01T00:00:00Z', '2026-05-28T00:00:00Z'),
  ('comp-2026-a-03', 'season-2026-a', 'Copa Eric Cantona', 'copa-eric-cantona', 'copa', 'eliminacao_direta', '2026-03-01', '2026-06-30', 'em_andamento', 3, 'Copa dedicada à memória de Eric Cantona na Apertura 2026.', 'LFA', '/logos/gerais/logo_cantona.jpg', '/banners/copa-cantona.jpg', '2026-02-01T00:00:00Z', '2026-05-28T00:00:00Z'),
  ('comp-2026-a-04', 'season-2026-a', 'Taça Wladimir Rodrigues', 'taca-wladimir-rodrigues', 'copa', 'grupos_playoff', '2026-03-01', '2026-06-30', 'em_andamento', 4, 'Competição disputada na Apertura 2026 da LFA.', 'LFA', '/logos/gerais/logo_wladimir.jpg', '/banners/taca-wladimir.jpg', '2026-02-01T00:00:00Z', '2026-05-28T00:00:00Z'),
  ('comp-2026-a-05', 'season-2026-a', 'Taça Cecília', 'taca-cecilia', 'campeonato', 'grupos_playoff', '2026-03-01', '2026-06-30', 'em_andamento', 5, 'Competição principal da Apertura 2026 da LFA.', 'LFA', '/logos/gerais/logo_cecilia.jpg', '/banners/taca-cecilia.jpg', '2026-02-01T00:00:00Z', '2026-05-28T00:00:00Z'),
  ('comp-2026-a-06', 'season-2026-a', 'Supertaça', 'supertaca', 'copa', 'eliminacao_direta', '2026-03-01', '2026-06-30', 'em_andamento', 6, 'Supertaça disputada na Apertura 2026.', 'LFA', '/logos/gerais/escudo_LFA.jpg', '/banners/supertaca.jpg', '2026-02-01T00:00:00Z', '2026-05-28T00:00:00Z'),
  ('comp-2026-a-07', 'season-2026-a', 'Recopa', 'recopa', 'copa', 'eliminacao_direta', '2026-03-01', '2026-06-30', 'em_andamento', 7, 'Recopa disputada na Apertura 2026.', 'LFA', '/logos/gerais/escudo_LFA.jpg', '/banners/recopa.jpg', '2026-02-01T00:00:00Z', '2026-05-28T00:00:00Z')
on conflict (id) do update set
  temporada_id = excluded.temporada_id, nome = excluded.nome, slug = excluded.slug, tipo = excluded.tipo, formato = excluded.formato, data_inicio = excluded.data_inicio, data_fim = excluded.data_fim, status = excluded.status, ordem = excluded.ordem, descricao = excluded.descricao, organizador = excluded.organizador, url_logo = excluded.url_logo, url_banner = excluded.url_banner, criado_em = excluded.criado_em, atualizado_em = excluded.atualizado_em;

insert into public.times (id, nome, slug, nome_curto, url_logo, url_foto_capa, url_uniforme_titular, cor_primaria, cor_secundaria, ano_fundacao, cidade, alinhamento, descricao, historia, origem, ativo, criado_em, atualizado_em)
values
  ('1', 'CF Estrela Vermelha', 'cf-estrela-vermelha', 'CEV', '/logos/teams/estrela.jpg', '/banners/teams/cf-estrela-vermelha.png', '/logos/teams/estrela.jpg', '#dc2626', '#991b1b', 2018, 'São Paulo', NULL, 'Clube de futebol revolucionário com raízes comunitárias e histórico forte na LFA.', 'Clube de futebol revolucionário com raízes comunitárias e histórico forte na LFA.', 'SP', TRUE, '2018-03-15T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('2', 'Guairacá Futebol Ancestral', 'guairaca-futebol-ancestral', 'GFA', '/logos/teams/guairaca.jpg', '/banners/teams/guairaca-futebol-ancestral.png', '/logos/teams/guairaca.jpg', '#84cc16', '#65a30d', 2020, 'Maringá', NULL, 'Time ancestral que valoriza tradições, cultura popular e futebol comunitário.', 'Time ancestral que valoriza tradições, cultura popular e futebol comunitário.', 'PR', TRUE, '2020-01-10T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('3', 'Deportivo Oriental', 'deportivo-oriental', 'DO', '/logos/teams/deportivo.jpg', '/banners/teams/deportivo-oriental.png', '/logos/teams/deportivo.jpg', '#0ea5e9', '#0284c7', 2023, 'Rio de Janeiro', NULL, 'Equipe orientada para o futebol solidário, com forte presença cultural e política.', 'Equipe orientada para o futebol solidário, com forte presença cultural e política.', 'RJ', TRUE, '2019-05-20T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('4', 'Sankara', 'sankara', 'SKR', '/logos/teams/sankara.jpg', '/banners/teams/sankara.png', '/logos/teams/sankara.jpg', '#f59e0b', '#d97706', 2022, 'Brasília', NULL, 'Time inspirado em ideais de autonomia, liberdade e solidariedade.', 'Time inspirado em ideais de autonomia, liberdade e solidariedade.', 'DF', TRUE, '2021-02-14T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('5', 'Primavera F.C.', 'primavera', 'PRI', '/logos/teams/primavera.jpg', '/banners/teams/primavera.png', '/logos/teams/primavera.jpg', '#ec4899', '#be185d', 2022, 'Curitiba', NULL, 'Time jovem, dinâmico e muito ligado ao renascimento do futebol popular.', 'Time jovem, dinâmico e muito ligado ao renascimento do futebol popular.', 'PR', TRUE, '2022-03-01T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('6', 'Teto Preto FC', 'teto-preto', 'TP', '/logos/teams/teto.jpg', '/banners/teams/teto-preto.png', '/logos/teams/teto.jpg', '#1f2937', '#111827', 2017, 'Salvador', NULL, 'Movimento de futebol de base em periferias com identidade forte.', 'Movimento de futebol de base em periferias com identidade forte.', 'BA', TRUE, '2017-07-20T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('7', 'Pé de Pano', 'pe-de-pano', 'PP', '/logos/teams/pe-de-pano.jpg', '/banners/teams/pe-de-pano.png', '/logos/teams/pe-de-pano.jpg', '#6366f1', '#4f46e5', 2001, 'Recife', NULL, 'Time que celebra a cultura popular, a rua e uma estética muito própria.', 'Time que celebra a cultura popular, a rua e uma estética muito própria.', 'PE', TRUE, '2019-04-10T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('8', 'Locomotiva Makhnovista F.S.C.', 'locomotiva-makhnovista-fsc', 'LMF', '/logos/teams/locomotiva.jpg', '/banners/teams/locomotiva-makhnovista-fsc.png', '/logos/teams/locomotiva.jpg', '#14b8a6', '#0d9488', 2020, 'Porto Alegre', NULL, 'Time que propaga ideais libertários e modos de organização coletiva.', 'Time que propaga ideais libertários e modos de organização coletiva.', 'RS', TRUE, '2020-06-15T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('9', 'Resistência Alviverde', 'resistencia-alviverde', 'RAV', '/logos/teams/resistencia-alviverde.jpg', '/banners/teams/resistencia-alviverde.png', '/logos/teams/resistencia-alviverde.jpg', '#10b981', '#059669', 2021, 'Belo Horizonte', NULL, 'Time que resiste e persiste pela democratização do futebol.', 'Time que resiste e persiste pela democratização do futebol.', 'MG', TRUE, '2021-08-25T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('10', 'Azulão Esporte Clube', 'azulao', 'AZL', '/logos/teams/azulao.jpg', '/banners/teams/azulao.jpg', '/logos/teams/azulao.jpg', '#3b82f6', '#1d4ed8', 2018, 'Santos', NULL, 'Grande força do futebol paulista com tradição comunitária.', 'Grande força do futebol paulista com tradição comunitária.', 'SP', TRUE, '2018-09-10T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('11', 'Bolchesítio Futebol Clube', 'bolchesitio', 'BOL', '/logos/teams/bolchesitio.jpg', '/banners/teams/bolchesitio.png', '/logos/teams/bolchesitio.jpg', '#ef4444', '#b91c1c', 2019, 'São Gonçalo', NULL, 'Time de orientação revolucionária e futebol comunitário.', 'Time de orientação revolucionária e futebol comunitário.', 'RJ', TRUE, '2019-10-20T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('12', 'Linha Esquerda FR', 'linha-esquerda-fr', 'LEF', '/logos/teams/linha.jpg', '/banners/teams/linha-esquerda-fr.png', '/logos/teams/linha.jpg', '#8b5cf6', '#7c3aed', 2021, 'Campinas', NULL, 'Frente revolucionária dedicada ao futebol livre e à participação popular.', 'Frente revolucionária dedicada ao futebol livre e à participação popular.', 'SP', TRUE, '2021-01-30T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('13', 'América de Calo', 'america-de-calo', 'ADC', '/logos/teams/america.jpg', '/banners/teams/america-de-calo.png', '/logos/teams/america.jpg', '#f97316', '#ea580c', 2024, 'Porto Alegre', NULL, 'Equipe com forte vínculo com o futebol das periferias e o imaginário popular.', 'Equipe com forte vínculo com o futebol das periferias e o imaginário popular.', 'RS', TRUE, '2024-01-15T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('14', 'Atleticomuna', 'atleticomuna', 'AMU', '/logos/teams/atleticomuna.jpg', '/banners/teams/atleticomuna.png', '/logos/teams/atleticomuna.jpg', '#6366f1', '#4338ca', 2025, 'Curitiba', NULL, 'Time ligado à cultura do bairro e à organização coletiva.', 'Time ligado à cultura do bairro e à organização coletiva.', 'PR', TRUE, '2022-04-10T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('15', '9DEDOS', '9-dedos', '9DD', '/logos/teams/9-dedos.jpg', '/banners/teams/9-dedos.png', '/logos/teams/9-dedos.jpg', '#111827', '#374151', 2021, 'Curitiba', NULL, 'Equipe técnica, veloz e muito presente nas decisões da LFA.', 'Equipe técnica, veloz e muito presente nas decisões da LFA.', 'PR', TRUE, '2021-05-01T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('16', 'Resistência Latinofuturista', 'latinofuturista', 'LTF', '/logos/teams/latinofuturista.jpg', '/banners/teams/latinofuturista.png', '/logos/teams/latinofuturista.jpg', '#facc15', '#ca8a04', 2023, 'São Paulo', NULL, 'Time com identidade urbana e forte presença artística.', 'Time com identidade urbana e forte presença artística.', 'SP', TRUE, '2023-02-18T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('17', 'Liverpanças', 'liverpancas', 'LVP', '/logos/teams/liverpancas.jpg', '/banners/teams/liverpancas.png', '/logos/teams/liverpancas.jpg', '#0f766e', '#115e59', 2022, 'Porto Alegre', NULL, 'Equipe brasileira com identidade forte e espírito de coletividade.', 'Equipe brasileira com identidade forte e espírito de coletividade.', 'RS', TRUE, '2022-06-20T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('18', 'FC ST. Paulo Freire', 'paulo-freire', 'PFR', '/logos/teams/paulo.jpg', '/banners/teams/paulo-freire.png', '/logos/teams/paulo.jpg', '#7c3aed', '#5b21b6', 2021, 'Recife', NULL, 'Equipe voltada à educação popular e ao esporte comunitário.', 'Equipe voltada à educação popular e ao esporte comunitário.', 'PE', TRUE, '2021-09-12T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('19', 'Coletivo Sem Fronteiras', 'sem-fronteiras', 'SFR', '/logos/teams/coletivo.jpg', '/banners/teams/sem-fronteiras.png', '/logos/teams/coletivo.jpg', '#4f46e5', '#312e81', 2026, 'Belo Horizonte', NULL, 'Time que representa a pluralidade da LFA.', 'Time que representa a pluralidade da LFA.', 'MG', TRUE, '2022-07-12T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('20', 'Toque de Classe - Associação Desportiva', 'toque-de-classe', 'TQC', '/logos/teams/toque.jpg', '/banners/teams/toque-de-classe.png', '/logos/teams/toque.jpg', '#f43f5e', '#be123c', 2023, 'Salvador', NULL, 'Equipe com forte presença ofensiva e dinâmica de jogo.', 'Equipe com forte presença ofensiva e dinâmica de jogo.', 'BA', TRUE, '2023-04-30T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('21', 'DIAMANTE FUTEBOL CLUBE', 'diamante', 'DMA', '/logos/teams/diamante.jpg', '/banners/teams/diamante.png', '/logos/teams/diamante.jpg', '#64748b', '#475569', 2026, 'Florianópolis', NULL, 'Time com cara de competição e histórico consistente.', 'Time com cara de competição e histórico consistente.', 'SC', TRUE, '2022-01-20T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('22', 'Discaída', 'discaida', 'DIS', '/logos/teams/discaida.jpg', '/banners/teams/discaida.png', '/logos/teams/discaida.jpg', '#a3e635', '#65a30d', 2021, 'Recife', NULL, 'Equipe que mistura fervor popular e competitividade.', 'Equipe que mistura fervor popular e competitividade.', 'PE', TRUE, '2021-07-10T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('23', 'Brigada Lupicínia F.C.', 'brigada-lupicinia', 'BLP', '/logos/teams/brigada.jpg', '/banners/teams/brigada-lupicinia.png', '/logos/teams/brigada.jpg', '#fb923c', '#c2410c', 2022, 'Porto Alegre', NULL, 'Time com forte identidade política e competitiva.', 'Time com forte identidade política e competitiva.', 'RS', TRUE, '2022-09-10T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('24', 'Baianos de Mauá', 'baianos-de-maua', 'BMA', '/logos/teams/baianos.jpg', '/banners/teams/baianos-de-maua.png', '/logos/teams/baianos.jpg', '#eab308', '#a16207', 2024, 'Mauá', NULL, 'Equipe tradicional da LFA com forte presença de identidade regional.', 'Equipe tradicional da LFA com forte presença de identidade regional.', 'SP', TRUE, '2021-11-12T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('25', 'Caos da Villa', 'caos-da-villa', 'CDV', '/logos/teams/caos.jpg', '/banners/teams/caos-da-villa.png', '/logos/teams/caos.jpg', '#f59e0b', '#92400e', 2023, 'São Paulo', NULL, 'Time com muita energia e presença marcante nas partidas.', 'Time com muita energia e presença marcante nas partidas.', 'SP', TRUE, '2023-03-05T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('26', 'Delas Futebol Clube', 'delas', 'DEL', '/logos/teams/delas.jpg', '/banners/teams/delas.png', '/logos/teams/delas.jpg', '#f472b6', '#9d174d', 2015, 'Rio de Janeiro', NULL, 'Equipe que valoriza a participação feminina e a diversidade no futebol.', 'Equipe que valoriza a participação feminina e a diversidade no futebol.', 'RJ', TRUE, '2022-08-02T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('27', 'Faixa Preta', 'faixa-preta', 'FXP', '/logos/teams/faixa.jpg', '/banners/teams/faixa-preta.png', '/logos/teams/faixa.jpg', '#111827', '#1f2937', 2019, 'Curitiba', NULL, 'Equipe de forte presença técnica e muita disciplina tática.', 'Equipe de forte presença técnica e muita disciplina tática.', 'PR', TRUE, '2021-04-03T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('28', 'Ginga', 'ginga', 'GIN', '/logos/teams/ginga.jpg', '/banners/teams/ginga.png', '/logos/teams/ginga.jpg', '#06b6d4', '#0f766e', 2022, 'São Paulo', NULL, 'Time com forte conexão com a cultura popular e a criatividade no campo.', 'Time com forte conexão com a cultura popular e a criatividade no campo.', 'SP', TRUE, '2022-05-07T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('29', 'Matsubara', 'matsubara', 'MAT', '/logos/teams/matsubara.jpg', '/banners/teams/matsubara.png', '/logos/teams/matsubara.jpg', '#84cc16', '#4d7c0f', 2021, 'Campinas', NULL, 'Equipe com identidade forte e presença antiga na LFA.', 'Equipe com identidade forte e presença antiga na LFA.', 'SP', TRUE, '2021-03-20T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('30', 'São Bento', 'sao-bento', 'SBE', '/logos/teams/sao-bento.jpg', '/banners/teams/sao-bento.png', '/logos/teams/sao-bento.jpg', '#38bdf8', '#0369a1', 2022, 'Santos', NULL, 'Equipe ligada à tradição do futebol de bairro.', 'Equipe ligada à tradição do futebol de bairro.', 'SP', TRUE, '2022-06-14T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('31', 'Clube Atlético Zapatista', 'zapatista', 'ZAP', '/logos/teams/zapatista.jpg', '/banners/teams/zapatista.png', '/logos/teams/zapatista.jpg', '#dc2626', '#b91c1c', 2024, 'Porto Alegre', NULL, 'Equipe com forte perspectiva política e comunitária.', 'Equipe com forte perspectiva política e comunitária.', 'RS', TRUE, '2023-01-08T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('32', 'IV:XX de Novembro', 'ivxx-de-novembro', 'IVX', '/logos/teams/iv-xx.jpg', '/banners/teams/ivxx-de-novembro.png', '/logos/teams/iv-xx.jpg', '#a855f7', '#7e22ce', 2022, 'Curitiba', NULL, 'Time com forte presença histórica e identidade de bairro.', 'Time com forte presença histórica e identidade de bairro.', 'PR', TRUE, '2022-02-22T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('33', 'Aqui Estamos Futebol, Amizade e Pixação', 'aqui-estamos', 'AQE', '/logos/teams/aqui-estamos.jpg', '/banners/teams/aqui-estamos.png', '/logos/teams/aqui-estamos.jpg', '#fbbf24', '#d97706', 2022, 'Curitiba', NULL, 'Time que representa a presença constante e organizada da LFA.', 'Time que representa a presença constante e organizada da LFA.', 'PR', TRUE, '2022-04-27T00:00:00Z', '2026-07-30T19:20:08Z'),
  ('34', 'Imperial RSports', 'imperial-rsports', 'IMP', '/logos/teams/imperial.jpg', '/banners/teams/imperial-rsports.png', '/logos/teams/imperial.jpg', '#fb923c', '#c2410c', 2023, 'Porto Alegre', NULL, 'Equipe de forte presença ofensiva e tradição recente na LFA.', 'Equipe de forte presença ofensiva e tradição recente na LFA.', 'RS', TRUE, '2023-06-02T00:00:00Z', '2026-05-21T00:00:00Z')
on conflict (id) do update set
  nome = excluded.nome, slug = excluded.slug, nome_curto = excluded.nome_curto, url_logo = excluded.url_logo, url_foto_capa = excluded.url_foto_capa, url_uniforme_titular = excluded.url_uniforme_titular, cor_primaria = excluded.cor_primaria, cor_secundaria = excluded.cor_secundaria, ano_fundacao = excluded.ano_fundacao, cidade = excluded.cidade, alinhamento = excluded.alinhamento, descricao = excluded.descricao, historia = excluded.historia, origem = excluded.origem, ativo = excluded.ativo, criado_em = excluded.criado_em, atualizado_em = excluded.atualizado_em;

insert into public.times_temporada (id, temporada_id, time_id, inscrito_em)
values
  ('tt-season-2022-a-1', 'season-2022-a', '1', '2026-07-30T19:52:20Z'),
  ('tt-season-2022-a-7', 'season-2022-a', '7', '2026-07-30T19:52:20Z'),
  ('tt-season-2023-a-2', 'season-2023-a', '2', '2026-07-30T19:52:20Z'),
  ('tt-season-2023-a-5', 'season-2023-a', '5', '2026-07-30T19:52:20Z'),
  ('tt-season-2024-a-15', 'season-2024-a', '15', '2026-07-30T19:52:20Z'),
  ('tt-season-2024-a-2', 'season-2024-a', '2', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-1', 'season-2025-a', '1', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-15', 'season-2025-a', '15', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-2', 'season-2025-a', '2', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-20', 'season-2025-a', '20', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-3', 'season-2025-a', '3', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-33', 'season-2025-a', '33', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-34', 'season-2025-a', '34', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-4', 'season-2025-a', '4', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-5', 'season-2025-a', '5', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-6', 'season-2025-a', '6', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-7', 'season-2025-a', '7', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-a-8', 'season-2025-a', '8', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-c-1', 'season-2025-c', '1', '2026-07-30T19:52:20Z'),
  ('tt-season-2025-c-34', 'season-2025-c', '34', '2026-07-30T19:52:20Z')
on conflict (id) do update set
  temporada_id = excluded.temporada_id, time_id = excluded.time_id, inscrito_em = excluded.inscrito_em;

insert into public.jogadores (id, usuario_id, nome, apelido, url_foto, data_nascimento, criado_em, atualizado_em)
values
  ('p1', NULL, 'Gui', 'Gui', '/avatares/players/gui.png', '1998-03-12', '2020-03-15T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('p2', NULL, 'Cauan', 'Cauan', '/avatares/players/cauan.png', '1999-06-10', '2020-05-02T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('p3', NULL, 'N''tcho Sá', 'N''tcho Sá', '/avatares/players/ntcho-sa.png', '1997-07-19', '2020-07-14T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('p4', NULL, 'John', 'John', '/avatares/players/john.png', '1996-01-25', '2019-08-20T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('p5', NULL, 'JR', 'JR', '/avatares/players/jr.png', '1995-11-04', '2019-04-20T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('p6', NULL, 'Marion', 'Marion', '/avatares/players/marion.png', '1998-09-01', '2020-01-11T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('p7', NULL, 'Schmidt', 'Schmidt', '/avatares/players/schmidt.png', '1997-04-22', '2020-02-01T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('p8', NULL, 'Apolinário', 'Apolinário', '/avatares/players/apolinario.png', '1996-10-15', '2019-12-01T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('p9', NULL, 'Doug', 'Doug', '/avatares/players/doug.png', '1998-08-08', '2020-03-01T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('p10', NULL, 'Jean Thiago Mottin', 'Jean Thiago Mottin', '/avatares/players/jean-thiago-mottin.png', '1995-05-09', '2019-11-20T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('p11', NULL, 'Imperial', 'Imperial', '/avatares/players/imperial.png', '1997-07-11', '2023-06-10T00:00:00Z', '2026-05-21T00:00:00Z')
on conflict (id) do update set
  usuario_id = excluded.usuario_id, nome = excluded.nome, apelido = excluded.apelido, url_foto = excluded.url_foto, data_nascimento = excluded.data_nascimento, criado_em = excluded.criado_em, atualizado_em = excluded.atualizado_em;

insert into public.registros_jogador (id, jogador_id, time_id, temporada_id, numero_camisa, posicao, ativo, criado_em, atualizado_em)
values
  ('reg-p1-season-2026-a', 'p1', '1', 'season-2026-a', 9, 'Atacante', TRUE, '2020-03-15T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('reg-p2-season-2026-a', 'p2', '1', 'season-2026-a', 7, 'Meia', TRUE, '2020-05-02T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('reg-p3-season-2026-a', 'p3', '2', 'season-2026-a', 11, 'Atacante', TRUE, '2020-07-14T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('reg-p4-season-2026-a', 'p4', '6', 'season-2026-a', 10, 'Atacante', TRUE, '2019-08-20T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('reg-p5-season-2026-a', 'p5', '7', 'season-2026-a', 8, 'Meia', TRUE, '2019-04-20T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('reg-p6-season-2026-a', 'p6', '7', 'season-2026-a', 13, 'Atacante', TRUE, '2020-01-11T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('reg-p7-season-2026-a', 'p7', '7', 'season-2026-a', 5, 'Zagueiro', TRUE, '2020-02-01T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('reg-p8-season-2026-a', 'p8', '7', 'season-2026-a', 9, 'Atacante', TRUE, '2019-12-01T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('reg-p9-season-2026-a', 'p9', '15', 'season-2026-a', 10, 'Atacante', TRUE, '2020-03-01T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('reg-p10-season-2026-a', 'p10', '15', 'season-2026-a', 11, 'Meia', TRUE, '2019-11-20T00:00:00Z', '2026-05-21T00:00:00Z'),
  ('reg-p11-season-2023-a', 'p11', '34', 'season-2023-a', 7, 'Atacante', TRUE, '2023-06-10T00:00:00Z', '2026-05-21T00:00:00Z')
on conflict (id) do update set
  jogador_id = excluded.jogador_id, time_id = excluded.time_id, temporada_id = excluded.temporada_id, numero_camisa = excluded.numero_camisa, posicao = excluded.posicao, ativo = excluded.ativo, criado_em = excluded.criado_em, atualizado_em = excluded.atualizado_em;

insert into public.partidas (id, competicao_id, time_casa_id, time_visitante_id, placar_casa, placar_visitante, data_hora, rodada, local, status, criado_em, atualizado_em)
values
  ('match-001', 'comp-2025-a-04', '2', '15', 1, 4, '2025-05-17', 'Semifinal', 'Canil - Ecosoccer', 'finalizada', '2025-05-17T00:00:00Z', '2025-05-17T00:00:00Z'),
  ('match-002', 'comp-2025-a-04', '1', '7', 3, 3, '2025-05-10', 'Semifinal', 'Canil - Ecosoccer', 'finalizada', '2025-05-10T00:00:00Z', '2025-05-10T00:00:00Z'),
  ('match-003', 'comp-2025-a-04', '7', '15', 2, 2, '2025-06-01', 'Final', 'Canil - Ecosoccer', 'finalizada', '2025-06-01T00:00:00Z', '2025-06-01T00:00:00Z'),
  ('match-004', 'comp-2025-a-04', '1', '2', 4, 1, '2025-06-08', 'Disputa pelo 3º lugar', 'Campo Cecília', 'finalizada', '2025-06-08T00:00:00Z', '2025-06-08T00:00:00Z'),
  ('match-011', 'comp-2022-a-01', '7', '1', 5, 1, '2022-05-21', 'Final', 'Canil - Ecosoccer', 'finalizada', '2022-05-21T00:00:00Z', '2022-05-21T00:00:00Z'),
  ('match-013', 'comp-2023-a-01', '2', '5', 4, 2, '2023-05-28', 'Final', 'Canil - Ecosoccer', 'finalizada', '2023-05-28T00:00:00Z', '2023-05-28T00:00:00Z'),
  ('match-015', 'comp-2024-a-03', '2', '15', 4, 1, '2024-06-09', 'Final', 'Canil - Ecosoccer', 'finalizada', '2024-06-09T00:00:00Z', '2024-06-09T00:00:00Z'),
  ('match-003b', 'comp-2025-c-04', '34', '1', 2, 2, '2025-10-19', 'Final', 'Cruzeta', 'finalizada', '2025-10-19T00:00:00Z', '2025-10-19T00:00:00Z')
on conflict (id) do update set
  competicao_id = excluded.competicao_id, time_casa_id = excluded.time_casa_id, time_visitante_id = excluded.time_visitante_id, placar_casa = excluded.placar_casa, placar_visitante = excluded.placar_visitante, data_hora = excluded.data_hora, rodada = excluded.rodada, local = excluded.local, status = excluded.status, criado_em = excluded.criado_em, atualizado_em = excluded.atualizado_em;

insert into public.classificacao (id, competicao_id, time_id, jogos, vitorias, empates, derrotas, gols_pro, gols_contra, pontos, atualizado_em)
values
  ('standing-001', 'comp-2025-a-04', '1', 11, 10, 1, 0, 66, 23, 31, '2026-07-30T19:52:20Z'),
  ('standing-002', 'comp-2025-a-04', '2', 11, 7, 3, 1, 41, 32, 24, '2026-07-30T19:52:20Z'),
  ('standing-003', 'comp-2025-a-04', '15', 11, 7, 1, 3, 54, 29, 22, '2026-07-30T19:52:20Z'),
  ('standing-004', 'comp-2025-a-04', '7', 11, 6, 2, 3, 65, 30, 20, '2026-07-30T19:52:20Z'),
  ('standing-005', 'comp-2025-a-04', '6', 11, 5, 2, 4, 36, 43, 17, '2026-07-30T19:52:20Z'),
  ('standing-006', 'comp-2025-a-04', '5', 11, 4, 2, 5, 39, 46, 14, '2026-07-30T19:52:20Z'),
  ('standing-007', 'comp-2025-a-04', '4', 11, 4, 0, 7, 26, 35, 12, '2026-07-30T19:52:20Z'),
  ('standing-008', 'comp-2025-a-04', '20', 11, 4, 0, 7, 27, 40, 12, '2026-07-30T19:52:20Z'),
  ('standing-009', 'comp-2025-a-04', '34', 11, 3, 3, 5, 44, 39, 12, '2026-07-30T19:52:20Z'),
  ('standing-010', 'comp-2025-a-04', '3', 11, 3, 1, 7, 22, 40, 10, '2026-07-30T19:52:20Z'),
  ('standing-011', 'comp-2025-a-04', '33', 11, 2, 3, 6, 38, 50, 9, '2026-07-30T19:52:20Z'),
  ('standing-012', 'comp-2025-a-04', '8', 11, 2, 0, 9, 19, 70, 6, '2026-07-30T19:52:20Z'),
  ('standing-013', 'comp-2022-a-01', '7', 11, 10, 1, 0, 66, 23, 31, '2026-07-30T19:52:20Z'),
  ('standing-014', 'comp-2023-a-01', '2', 11, 9, 1, 1, 58, 22, 28, '2026-07-30T19:52:20Z'),
  ('standing-015', 'comp-2024-a-03', '2', 11, 10, 0, 1, 61, 25, 30, '2026-07-30T19:52:20Z')
on conflict (id) do update set
  competicao_id = excluded.competicao_id, time_id = excluded.time_id, jogos = excluded.jogos, vitorias = excluded.vitorias, empates = excluded.empates, derrotas = excluded.derrotas, gols_pro = excluded.gols_pro, gols_contra = excluded.gols_contra, pontos = excluded.pontos, atualizado_em = excluded.atualizado_em;

insert into public.podios (id, competicao_id, time_primeiro_id, time_segundo_id, time_terceiro_id, jogador_artilheiro_id, jogador_melhor_id, criado_em, atualizado_em)
values
  ('podium-001', 'comp-2025-a-04', '7', '15', '1', NULL, NULL, '2026-07-30T19:52:20Z', '2026-07-30T19:52:20Z'),
  ('podium-002', 'comp-2025-a-03', '1', '2', '7', NULL, NULL, '2026-07-30T19:52:20Z', '2026-07-30T19:52:20Z'),
  ('podium-003', 'comp-2025-c-04', '34', '1', '3', NULL, NULL, '2026-07-30T19:52:20Z', '2026-07-30T19:52:20Z'),
  ('podium-011', 'comp-2022-a-01', '7', '1', '6', NULL, NULL, '2026-07-30T19:52:20Z', '2026-07-30T19:52:20Z'),
  ('podium-012', 'comp-2022-c-03', '7', '1', '9', NULL, NULL, '2026-07-30T19:52:20Z', '2026-07-30T19:52:20Z'),
  ('podium-013', 'comp-2023-a-01', '2', '5', '1', NULL, NULL, '2026-07-30T19:52:20Z', '2026-07-30T19:52:20Z'),
  ('podium-014', 'comp-2023-c-01', '2', '7', '4', NULL, NULL, '2026-07-30T19:52:20Z', '2026-07-30T19:52:20Z'),
  ('podium-015', 'comp-2024-a-03', '2', '15', '1', NULL, NULL, '2026-07-30T19:52:20Z', '2026-07-30T19:52:20Z'),
  ('podium-016', 'comp-2024-c-03', '2', '6', '3', NULL, NULL, '2026-07-30T19:52:20Z', '2026-07-30T19:52:20Z')
on conflict (id) do update set
  competicao_id = excluded.competicao_id, time_primeiro_id = excluded.time_primeiro_id, time_segundo_id = excluded.time_segundo_id, time_terceiro_id = excluded.time_terceiro_id, jogador_artilheiro_id = excluded.jogador_artilheiro_id, jogador_melhor_id = excluded.jogador_melhor_id, criado_em = excluded.criado_em, atualizado_em = excluded.atualizado_em;

insert into public.midia (id, liga_id, temporada_id, partida_id, time_id, tipo, url, url_thumbnail, legenda, titulo, categoria, escopo, carregado_por, criado_em)
values
  ('md-001', 'l1', 'season-2025-a', NULL, NULL, 'foto', '/media/photos/taca-cecilia-2025-final.jpg', '/media/photos/thumbnails/taca-cecilia-2025-final.jpg', 'Momento da decisão entre Pé-de-pano e 9-Dedos com resultado decidido nos pênaltis.', 'Final da Taça Cecília 2025 – Apertura', 'json', 'liga', NULL, '2025-06-02T00:00:00Z'),
  ('md-002', 'l1', 'season-2025-a', NULL, NULL, 'foto', '/media/photos/pe-de-pano-campeao-2025.jpg', '/media/photos/thumbnails/pe-de-pano-campeao-2025.jpg', 'Equipe campeã celebra a conquista após a decisão.', 'Celebrando o título do Pé-de-pano', 'json', 'liga', NULL, '2025-06-02T00:00:00Z'),
  ('md-003', 'l1', 'season-2025-a', NULL, NULL, 'foto', '/media/photos/copa-eric-cantona.jpg', '/media/photos/thumbnails/copa-eric-cantona.jpg', 'Registro da competição em homenagem a Eric Cantona.', 'Copa Eric Cantona 2025', 'json', 'liga', NULL, '2025-06-16T00:00:00Z'),
  ('md-004', 'l1', 'season-2025-c', NULL, NULL, 'video', '/media/videos/taca-cecilia-2025-clausura.mp4', '/media/videos/thumbnails/taca-cecilia-2025-clausura.jpg', 'Recapitulação da fase final e da conquista do Imperial.', 'Resumo da Taça Cecília 2025 – Clausura', 'json', 'liga', NULL, '2025-11-01T00:00:00Z'),
  ('md-005', 'l1', 'season-2024-a', NULL, '2', 'foto', '/media/photos/guairaca-2024.jpg', '/media/photos/thumbnails/guairaca-2024.jpg', 'Registro da campanha histórica do Guairacá na edição de 2024.', 'Guairacá campeão da Taça Cecília 2024', 'json', 'liga', NULL, '2024-06-16T00:00:00Z')
on conflict (id) do update set
  liga_id = excluded.liga_id, temporada_id = excluded.temporada_id, partida_id = excluded.partida_id, time_id = excluded.time_id, tipo = excluded.tipo, url = excluded.url, url_thumbnail = excluded.url_thumbnail, legenda = excluded.legenda, titulo = excluded.titulo, categoria = excluded.categoria, escopo = excluded.escopo, carregado_por = excluded.carregado_por, criado_em = excluded.criado_em;

commit;
