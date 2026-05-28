/**
 * SRC/DATA/DATABASE.TS
 * ===============================
 * PROPÓSITO: Dados mockados completos seguindo schema de banco de dados (PT-BR)
 * - Tabelas: ligas, temporadas, competicoes, times, times_temporada
 * - Tabelas: jogadores, registros_jogador, partidas, eventos_partida
 * - Tabelas: classificacao, midia, podios, usuarios
 * - Todos os campos incluem criado_em e atualizado_em
 * MOTIVO: Fornece dados realistas para desenvolvimento sem API backend
 */

import {
  Liga,
  Temporada,
  Competicao,
  Time,
  TimeTemporada,
  Jogador,
  RegistroJogador,
  Partida,
  EventoPartida,
  Classificacao,
  Midia,
  Podio,
  Usuario,
} from '@/types/league';

// ==========================================
// 1. TABELA: LIGAS
// ==========================================
export const ligas: Liga[] = [
  {
    id: 'liga-001',
    nome: 'Liga Antifascista de Futebol',
    url_logo: '/logos/gerais/laf-logo.png',
    cidade: 'São Paulo',
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
];

// ==========================================
// 2. TABELA: TEMPORADAS (Edições)
// ==========================================
export const temporadas: Temporada[] = [
  {
    id: 'temp-001',
    liga_id: 'liga-001',
    nome: 'Apertura 25',
    slug: 'apertura-25',
    ano: 2025,
    semestre: 'apertura',
    data_inicio: '2025-03-01',
    data_fim: '2025-06-30',
    status: 'finalizada',
    descricao: 'Primeira edição de 2025',
    url_banner: '/banners/apertura-25.jpg',
    criado_em: '2024-12-01T00:00:00Z',
    atualizado_em: '2025-07-01T00:00:00Z',
  },
  {
    id: 'temp-002',
    liga_id: 'liga-001',
    nome: 'Clausura 25',
    slug: 'clausura-25',
    ano: 2025,
    semestre: 'clausura',
    data_inicio: '2025-07-01',
    data_fim: '2025-10-31',
    status: 'finalizada',
    descricao: 'Segunda edição de 2025',
    url_banner: '/banners/clausura-25.jpg',
    criado_em: '2025-06-01T00:00:00Z',
    atualizado_em: '2025-11-01T00:00:00Z',
  },
  {
    id: 'temp-003',
    liga_id: 'liga-001',
    nome: 'Apertura 26',
    slug: 'apertura-26',
    ano: 2026,
    semestre: 'apertura',
    data_inicio: '2026-03-01',
    data_fim: '2026-06-30',
    status: 'em_andamento',
    descricao: 'Primeira edição de 2026',
    url_banner: '/banners/apertura-26.jpg',
    criado_em: '2026-02-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
];

// ==========================================
// 3. TABELA: COMPETIÇÕES
// ==========================================
export const competicoes: Competicao[] = [
  {
    id: 'comp-001',
    temporada_id: 'temp-001',
    nome: 'Campeonato Principal Apertura 25',
    tipo: 'campeonato',
    formato: 'turno_unico',
    data_inicio: '2025-03-01',
    data_fim: '2025-06-30',
    status: 'finalizada',
    ordem: 1,
    criado_em: '2024-12-01T00:00:00Z',
    atualizado_em: '2025-07-01T00:00:00Z',
  },
  {
    id: 'comp-002',
    temporada_id: 'temp-001',
    nome: 'Copa Interna Apertura 25',
    tipo: 'copa',
    formato: 'eliminacao_direta',
    data_inicio: '2025-05-01',
    data_fim: '2025-06-15',
    status: 'finalizada',
    ordem: 2,
    criado_em: '2024-12-15T00:00:00Z',
    atualizado_em: '2025-06-16T00:00:00Z',
  },
  {
    id: 'comp-003',
    temporada_id: 'temp-002',
    nome: 'Campeonato Principal Clausura 25',
    tipo: 'campeonato',
    formato: 'turno_unico',
    data_inicio: '2025-07-01',
    data_fim: '2025-10-31',
    status: 'finalizada',
    ordem: 1,
    criado_em: '2025-06-01T00:00:00Z',
    atualizado_em: '2025-11-01T00:00:00Z',
  },
  {
    id: 'comp-004',
    temporada_id: 'temp-003',
    nome: 'Campeonato Principal Apertura 26',
    tipo: 'campeonato',
    formato: 'turno_unico',
    data_inicio: '2026-03-01',
    data_fim: '2026-06-30',
    status: 'em_andamento',
    ordem: 1,
    criado_em: '2026-02-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
];

// ==========================================
// 4. TABELA: TIMES
// ==========================================
export const times: Time[] = [
  { id: 't-001', nome: 'CF Estrela Vermelha', nome_curto: 'CER', url_logo: '/logos/times/estrela-vermelha.png', cor_primaria: '#dc2626', cor_secundaria: '#991b1b', ano_fundacao: 2010, ativo: true, criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 't-002', nome: 'Guairacá Futebol Ancestral', nome_curto: 'GFA', url_logo: '/logos/times/guairaca.png', cor_primaria: '#84cc16', cor_secundaria: '#65a30d', ano_fundacao: 2012, ativo: true, criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 't-003', nome: 'Deportivo Oriental', nome_curto: 'DO', url_logo: '/logos/times/deportivo-oriental.png', cor_primaria: '#0ea5e9', cor_secundaria: '#0369a1', ano_fundacao: 2008, ativo: true, criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 't-004', nome: 'Sankara', nome_curto: 'SNK', url_logo: '/logos/times/sankara.png', cor_primaria: '#f59e0b', cor_secundaria: '#d97706', ano_fundacao: 2015, ativo: true, criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 't-005', nome: 'Primavera', nome_curto: 'PRI', url_logo: '/logos/times/primavera.png', cor_primaria: '#ec4899', cor_secundaria: '#be185d', ano_fundacao: 2011, ativo: true, criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 't-006', nome: 'Teto Preto', nome_curto: 'TP', url_logo: '/logos/times/teto-preto.png', cor_primaria: '#1f2937', cor_secundaria: '#111827', ano_fundacao: 2009, ativo: true, criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 't-007', nome: 'Pé de Pano', nome_curto: 'PDP', url_logo: '/logos/times/pe-de-pano.png', cor_primaria: '#6366f1', cor_secundaria: '#4f46e5', ano_fundacao: 2013, ativo: true, criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 't-008', nome: 'Locomotiva Makhnovista F.S.C.', nome_curto: 'LOKM', url_logo: '/logos/times/locomotiva.png', cor_primaria: '#14b8a6', cor_secundaria: '#0d9488', ano_fundacao: 2014, ativo: true, criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 't-009', nome: 'Resistência Alviverde', nome_curto: 'RA', url_logo: '/logos/times/resistencia.png', cor_primaria: '#10b981', cor_secundaria: '#059669', ano_fundacao: 2010, ativo: true, criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 't-010', nome: 'Azulão', nome_curto: 'AZL', url_logo: '/logos/times/azulao.png', cor_primaria: '#3b82f6', cor_secundaria: '#1d4ed8', ano_fundacao: 2007, ativo: true, criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
];

// ==========================================
// 5. TABELA: TIMES_TEMPORADA
// ==========================================
export const times_temporada: TimeTemporada[] = [
  // Apertura 25
  { id: 'tt-001', temporada_id: 'temp-001', time_id: 't-001', inscrito_em: '2025-02-15T00:00:00Z' },
  { id: 'tt-002', temporada_id: 'temp-001', time_id: 't-002', inscrito_em: '2025-02-15T00:00:00Z' },
  { id: 'tt-003', temporada_id: 'temp-001', time_id: 't-003', inscrito_em: '2025-02-15T00:00:00Z' },
  { id: 'tt-004', temporada_id: 'temp-001', time_id: 't-004', inscrito_em: '2025-02-15T00:00:00Z' },
  { id: 'tt-005', temporada_id: 'temp-001', time_id: 't-005', inscrito_em: '2025-02-15T00:00:00Z' },
  // Clausura 25
  { id: 'tt-006', temporada_id: 'temp-002', time_id: 't-001', inscrito_em: '2025-06-15T00:00:00Z' },
  { id: 'tt-007', temporada_id: 'temp-002', time_id: 't-002', inscrito_em: '2025-06-15T00:00:00Z' },
  { id: 'tt-008', temporada_id: 'temp-002', time_id: 't-003', inscrito_em: '2025-06-15T00:00:00Z' },
  { id: 'tt-009', temporada_id: 'temp-002', time_id: 't-006', inscrito_em: '2025-06-15T00:00:00Z' },
  { id: 'tt-010', temporada_id: 'temp-002', time_id: 't-007', inscrito_em: '2025-06-15T00:00:00Z' },
  // Apertura 26
  { id: 'tt-011', temporada_id: 'temp-003', time_id: 't-001', inscrito_em: '2026-02-15T00:00:00Z' },
  { id: 'tt-012', temporada_id: 'temp-003', time_id: 't-002', inscrito_em: '2026-02-15T00:00:00Z' },
  { id: 'tt-013', temporada_id: 'temp-003', time_id: 't-003', inscrito_em: '2026-02-15T00:00:00Z' },
  { id: 'tt-014', temporada_id: 'temp-003', time_id: 't-004', inscrito_em: '2026-02-15T00:00:00Z' },
  { id: 'tt-015', temporada_id: 'temp-003', time_id: 't-005', inscrito_em: '2026-02-15T00:00:00Z' },
  { id: 'tt-016', temporada_id: 'temp-003', time_id: 't-008', inscrito_em: '2026-02-15T00:00:00Z' },
  { id: 'tt-017', temporada_id: 'temp-003', time_id: 't-009', inscrito_em: '2026-02-15T00:00:00Z' },
  { id: 'tt-018', temporada_id: 'temp-003', time_id: 't-010', inscrito_em: '2026-02-15T00:00:00Z' },
];

// ==========================================
// 6. TABELA: JOGADORES
// ==========================================
export const jogadores: Jogador[] = [
  { id: 'j-001', usuario_id: 'u-001', nome: 'Carlos Silva', apelido: 'Carlão', url_foto: '/avatars/carlos-silva.jpg', data_nascimento: '1998-05-15', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-002', usuario_id: 'u-002', nome: 'Bruno Santos', apelido: 'Bruno', url_foto: '/avatars/bruno-santos.jpg', data_nascimento: '1995-03-22', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-003', usuario_id: undefined, nome: 'Marcos Lima', apelido: 'Marcão', url_foto: '/avatars/marcos-lima.jpg', data_nascimento: '1999-08-10', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-004', usuario_id: undefined, nome: 'Rafael Costa', apelido: 'Rafa', url_foto: '/avatars/rafael-costa.jpg', data_nascimento: '1997-11-30', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-005', usuario_id: undefined, nome: 'Diego Alves', apelido: 'Diego', url_foto: '/avatars/diego-alves.jpg', data_nascimento: '1996-06-18', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-006', usuario_id: undefined, nome: 'Lucas Oliveira', apelido: 'Lucas', url_foto: '/avatars/lucas-oliveira.jpg', data_nascimento: '2000-02-05', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-007', usuario_id: 'u-003', nome: 'André Souza', apelido: 'André', url_foto: '/avatars/andre-souza.jpg', data_nascimento: '1994-09-12', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-008', usuario_id: undefined, nome: 'Felipe Rocha', apelido: 'Feipe', url_foto: '/avatars/felipe-rocha.jpg', data_nascimento: '1998-07-25', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-009', usuario_id: undefined, nome: 'Gustavo Mendes', apelido: 'Guga', url_foto: '/avatars/gustavo-mendes.jpg', data_nascimento: '1999-01-14', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-010', usuario_id: undefined, nome: 'Thiago Ferreira', apelido: 'Thiago', url_foto: '/avatars/thiago-ferreira.jpg', data_nascimento: '1996-12-03', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
];

// ==========================================
// 7. TABELA: REGISTROS_JOGADOR
// ==========================================
export const registros_jogador: RegistroJogador[] = [
  // Apertura 25 - Time 001
  { id: 'rj-001', jogador_id: 'j-001', time_id: 't-001', temporada_id: 'temp-001', numero_camisa: 10, posicao: 'Atacante', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  { id: 'rj-002', jogador_id: 'j-002', time_id: 't-001', temporada_id: 'temp-001', numero_camisa: 1, posicao: 'Goleiro', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  { id: 'rj-003', jogador_id: 'j-003', time_id: 't-001', temporada_id: 'temp-001', numero_camisa: 7, posicao: 'Meia', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  { id: 'rj-004', jogador_id: 'j-008', time_id: 't-001', temporada_id: 'temp-001', numero_camisa: 4, posicao: 'Zagueiro', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  // Apertura 25 - Time 003
  { id: 'rj-005', jogador_id: 'j-004', time_id: 't-003', temporada_id: 'temp-001', numero_camisa: 9, posicao: 'Atacante', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  { id: 'rj-006', jogador_id: 'j-005', time_id: 't-003', temporada_id: 'temp-001', numero_camisa: 5, posicao: 'Zagueiro', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  // Apertura 25 - Time 007
  { id: 'rj-007', jogador_id: 'j-006', time_id: 't-007', temporada_id: 'temp-001', numero_camisa: 11, posicao: 'Ponta', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  // Apertura 25 - Time 008
  { id: 'rj-008', jogador_id: 'j-007', time_id: 't-008', temporada_id: 'temp-001', numero_camisa: 8, posicao: 'Volante', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  // Apertura 26
  { id: 'rj-009', jogador_id: 'j-001', time_id: 't-001', temporada_id: 'temp-003', numero_camisa: 10, posicao: 'Atacante', ativo: true, criado_em: '2026-02-20T00:00:00Z', atualizado_em: '2026-02-20T00:00:00Z' },
  { id: 'rj-010', jogador_id: 'j-002', time_id: 't-001', temporada_id: 'temp-003', numero_camisa: 1, posicao: 'Goleiro', ativo: true, criado_em: '2026-02-20T00:00:00Z', atualizado_em: '2026-02-20T00:00:00Z' },
];

// ==========================================
// 8. TABELA: PARTIDAS
// ==========================================
export const partidas: Partida[] = [
  {
    id: 'p-001',
    competicao_id: 'comp-001',
    time_casa_id: 't-001',
    time_visitante_id: 't-002',
    placar_casa: 3,
    placar_visitante: 1,
    data_hora: '2025-03-10T19:00:00Z',
    rodada: 'Rodada 1',
    local: 'Estádio Principal',
    status: 'finalizada',
    criado_em: '2025-03-10T00:00:00Z',
    atualizado_em: '2025-03-10T21:30:00Z',
  },
  {
    id: 'p-002',
    competicao_id: 'comp-001',
    time_casa_id: 't-003',
    time_visitante_id: 't-004',
    placar_casa: 2,
    placar_visitante: 2,
    data_hora: '2025-03-10T20:00:00Z',
    rodada: 'Rodada 1',
    local: 'Estádio Central',
    status: 'finalizada',
    criado_em: '2025-03-10T00:00:00Z',
    atualizado_em: '2025-03-10T22:00:00Z',
  },
  {
    id: 'p-003',
    competicao_id: 'comp-001',
    time_casa_id: 't-001',
    time_visitante_id: 't-003',
    placar_casa: 2,
    placar_visitante: 1,
    data_hora: '2026-03-15T19:00:00Z',
    rodada: 'Rodada 2',
    local: 'Estádio Principal',
    status: 'finalizada',
    criado_em: '2026-03-15T00:00:00Z',
    atualizado_em: '2026-03-15T21:30:00Z',
  },
  {
    id: 'p-004',
    competicao_id: 'comp-004',
    time_casa_id: 't-002',
    time_visitante_id: 't-005',
    placar_casa: undefined,
    placar_visitante: undefined,
    data_hora: '2026-06-10T19:00:00Z',
    rodada: 'Rodada 3',
    local: 'Estádio Principal',
    status: 'agendada',
    criado_em: '2026-05-28T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
];

// ==========================================
// 9. TABELA: EVENTOS_PARTIDA
// ==========================================
export const eventos_partida: EventoPartida[] = [
  { id: 'ev-001', partida_id: 'p-001', jogador_id: 'j-001', time_id: 't-001', tipo: 'gol', minuto: 15, criado_em: '2025-03-10T19:15:00Z' },
  { id: 'ev-002', partida_id: 'p-001', jogador_id: 'j-003', time_id: 't-001', tipo: 'assistencia', minuto: 15, criado_em: '2025-03-10T19:15:00Z' },
  { id: 'ev-003', partida_id: 'p-001', jogador_id: 'j-001', time_id: 't-001', tipo: 'gol', minuto: 32, criado_em: '2025-03-10T19:32:00Z' },
  { id: 'ev-004', partida_id: 'p-001', jogador_id: 'j-001', time_id: 't-001', tipo: 'gol', minuto: 67, criado_em: '2025-03-10T20:07:00Z' },
  { id: 'ev-005', partida_id: 'p-002', jogador_id: 'j-004', time_id: 't-003', tipo: 'gol', minuto: 22, criado_em: '2025-03-10T20:22:00Z' },
  { id: 'ev-006', partida_id: 'p-002', jogador_id: 'j-005', time_id: 't-003', tipo: 'cartao_amarelo', minuto: 45, criado_em: '2025-03-10T20:45:00Z' },
];

// ==========================================
// 10. TABELA: CLASSIFICAÇÃO
// ==========================================
export const classificacao: Classificacao[] = [
  { id: 'c-001', competicao_id: 'comp-004', time_id: 't-001', jogos: 2, vitorias: 1, empates: 1, derrotas: 0, gols_pro: 5, gols_contra: 2, pontos: 4, atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'c-002', competicao_id: 'comp-004', time_id: 't-002', jogos: 2, vitorias: 1, empates: 0, derrotas: 1, gols_pro: 3, gols_contra: 4, pontos: 3, atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'c-003', competicao_id: 'comp-004', time_id: 't-003', jogos: 2, vitorias: 1, empates: 0, derrotas: 1, gols_pro: 3, gols_contra: 3, pontos: 3, atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'c-004', competicao_id: 'comp-004', time_id: 't-004', jogos: 2, vitorias: 0, empates: 1, derrotas: 1, gols_pro: 2, gols_contra: 4, pontos: 1, atualizado_em: '2026-05-28T00:00:00Z' },
];

// ==========================================
// 11. TABELA: MÍDIA
// ==========================================
export const midia: Midia[] = [
  {
    id: 'md-001',
    liga_id: 'liga-001',
    temporada_id: 'temp-001',
    partida_id: 'p-001',
    time_id: 't-001',
    tipo: 'foto',
    url: '/media/foto-partida-001.jpg',
    url_thumbnail: '/media/thumb-partida-001.jpg',
    legenda: 'Gol de Carlos Silva na Rodada 1 - Apertura 25',
    carregado_por: 'u-001',
    criado_em: '2025-03-10T21:30:00Z',
  },
  {
    id: 'md-002',
    liga_id: 'liga-001',
    temporada_id: 'temp-001',
    partida_id: undefined,
    time_id: 't-001',
    tipo: 'video',
    url: '/media/melhores-momentos-apertura25.mp4',
    url_thumbnail: '/media/thumb-melhores-001.jpg',
    legenda: 'Melhores momentos - Apertura 25',
    carregado_por: 'u-001',
    criado_em: '2025-07-01T00:00:00Z',
  },
  {
    id: 'md-003',
    liga_id: 'liga-001',
    temporada_id: 'temp-003',
    partida_id: 'p-003',
    time_id: undefined,
    tipo: 'foto',
    url: '/media/foto-partida-003.jpg',
    url_thumbnail: '/media/thumb-partida-003.jpg',
    legenda: 'Ação da partida - Apertura 26',
    carregado_por: 'u-002',
    criado_em: '2026-03-15T21:30:00Z',
  },
];

// ==========================================
// 12. TABELA: PÓDIOS
// ==========================================
export const podios: Podio[] = [
  {
    id: 'pd-001',
    competicao_id: 'comp-001',
    time_primeiro_id: 't-001',
    time_segundo_id: 't-003',
    time_terceiro_id: 't-004',
    jogador_artilheiro_id: 'j-001',
    jogador_melhor_id: 'j-001',
    criado_em: '2025-07-01T00:00:00Z',
    atualizado_em: '2025-07-01T00:00:00Z',
  },
  {
    id: 'pd-002',
    competicao_id: 'comp-002',
    time_primeiro_id: 't-001',
    time_segundo_id: 't-002',
    time_terceiro_id: 't-003',
    jogador_artilheiro_id: 'j-003',
    jogador_melhor_id: 'j-003',
    criado_em: '2025-06-16T00:00:00Z',
    atualizado_em: '2025-06-16T00:00:00Z',
  },
];

// ==========================================
// 13. TABELA: USUÁRIOS
// ==========================================
export const usuarios: Usuario[] = [
  {
    id: 'u-001',
    nome: 'Administrador do Sistema',
    email: 'admin@laf.com',
    papel: 'admin',
    url_avatar: '/avatars/admin.jpg',
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 'u-002',
    nome: 'Bruno Santos',
    email: 'bruno@laf.com',
    papel: 'jogador',
    url_avatar: '/avatars/bruno-santos.jpg',
    criado_em: '2024-02-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 'u-003',
    nome: 'André Souza',
    email: 'andre@laf.com',
    papel: 'jogador',
    url_avatar: '/avatars/andre-souza.jpg',
    criado_em: '2024-02-15T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 'u-004',
    nome: 'Moderador da Liga',
    email: 'moderador@laf.com',
    papel: 'moderador',
    url_avatar: '/avatars/moderador.jpg',
    criado_em: '2024-03-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
];

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

/**
 * Encontra jogadores de um time em uma temporada específica
 */
export const getJogadoresPorTimeTemporada = (time_id: string, temporada_id: string): Jogador[] => {
  const registros = registros_jogador.filter(
    (r) => r.time_id === time_id && r.temporada_id === temporada_id && r.ativo
  );
  return registros
    .map((r) => jogadores.find((j) => j.id === r.jogador_id))
    .filter((j) => j !== undefined) as Jogador[];
};

/**
 * Encontra partidas de uma competição
 */
export const getPartidas_PorCompeticao = (competicao_id: string): Partida[] => {
  return partidas.filter((p) => p.competicao_id === competicao_id);
};

/**
 * Encontra competições de uma temporada
 */
export const getCompeticoes_PorTemporada = (temporada_id: string): Competicao[] => {
  return competicoes.filter((c) => c.temporada_id === temporada_id);
};

/**
 * Encontra times que participaram de uma temporada
 */
export const getTimes_PorTemporada = (temporada_id: string): Time[] => {
  const timeIds = times_temporada
    .filter((tt) => tt.temporada_id === temporada_id)
    .map((tt) => tt.time_id);
  return times.filter((t) => timeIds.includes(t.id));
};
