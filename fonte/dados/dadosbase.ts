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
} from '@/tipos/league';

// ==========================================
// 1. TABELA: LIGAS
// ==========================================
export const ligas: Liga[] = [
  {
    id: 'liga-001',
    nome: 'Liga Antifascista de Futebol',
    url_logo: '/logos/gerais/laf-logo.png',
    cidade: 'Curitiba, Paraná',
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
];

// ==========================================
// 2. TABELA: TEMPORADAS
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
    resumo_competicoes: [
      { nome: 'Taça Cecília', campeao_id: 't-007', vice_id: 't-001', terceiro_id: 't-006', quarto_id: 't-008' },
      { nome: 'Copa Eric Cantona', campeao_id: 't-001', vice_id: 't-005', terceiro_id: 't-004', quarto_id: 't-002' },
    ],
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
    resumo_competicoes: [
      { nome: 'Taça Cecília', campeao_id: 't-004', vice_id: 't-001', terceiro_id: 't-003', quarto_id: 't-009' },
      { nome: 'Copa Eric Cantona', campeao_id: 't-001', vice_id: 't-007', terceiro_id: 't-004', quarto_id: 't-003' },
    ],
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
    resumo_competicoes: [
      { nome: 'Taça Cecília', campeao_id: 't-004', vice_id: 't-001', terceiro_id: 't-010', quarto_id: 't-002' },
      { nome: 'Copa Eric Cantona', campeao_id: 't-001', vice_id: 't-005', terceiro_id: 't-004', quarto_id: 't-003' },
    ],
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
    nome: 'Taça Cecília',
    slug: 'taca-cecilia',
    tipo: 'campeonato',
    formato: 'turno_unico',
    data_inicio: '2025-03-01',
    data_fim: '2025-06-30',
    status: 'finalizada',
    ordem: 1,
    descricao: 'Campeonato de primeira divisão da LFA em homenagem à Colônia Cecília.',
    organizador: 'LFA',
    url_logo: '/logos/gerais/taca-cecilia.png',
    url_banner: '/banners/taca-cecilia.jpg',
    criado_em: '2024-12-01T00:00:00Z',
    atualizado_em: '2025-07-01T00:00:00Z',
  },
  {
    id: 'comp-002',
    temporada_id: 'temp-001',
    nome: 'Copa Eric Cantona',
    slug: 'copa-eric-cantona',
    tipo: 'copa',
    formato: 'eliminacao_direta',
    data_inicio: '2025-04-01',
    data_fim: '2025-06-15',
    status: 'finalizada',
    ordem: 2,
    descricao: 'Copa dedicada à memória de Eric Cantona.',
    organizador: 'LFA',
    url_logo: '/logos/gerais/copa-cantona.png',
    url_banner: '/banners/copa-cantona.jpg',
    criado_em: '2024-12-15T00:00:00Z',
    atualizado_em: '2025-06-16T00:00:00Z',
  },
  {
    id: 'comp-003',
    temporada_id: 'temp-002',
    nome: 'Taça Cecília',
    slug: 'taca-cecilia',
    tipo: 'campeonato',
    formato: 'turno_unico',
    data_inicio: '2025-07-01',
    data_fim: '2025-10-31',
    status: 'finalizada',
    ordem: 1,
    descricao: 'Segunda edição da Taça Cecília.',
    organizador: 'LFA',
    url_logo: '/logos/gerais/taca-cecilia.png',
    url_banner: '/banners/taca-cecilia.jpg',
    criado_em: '2025-06-01T00:00:00Z',
    atualizado_em: '2025-11-01T00:00:00Z',
  },
  {
    id: 'comp-004',
    temporada_id: 'temp-003',
    nome: 'Taça Cecília',
    slug: 'taca-cecilia',
    tipo: 'campeonato',
    formato: 'turno_unico',
    data_inicio: '2026-03-01',
    data_fim: '2026-06-30',
    status: 'em_andamento',
    ordem: 1,
    descricao: 'Edição em andamento da Taça Cecília.',
    organizador: 'LFA',
    url_logo: '/logos/gerais/taca-cecilia.png',
    url_banner: '/banners/taca-cecilia.jpg',
    criado_em: '2026-02-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
];

// ==========================================
// 4. TABELA: TIMES
// ==========================================
export const times: Time[] = [
  {
    id: 't-001',
    nome: 'CF Estrela Vermelha',
    slug: 'estrela-vermelha',
    nome_curto: 'CER',
    url_logo: '/logos/times/estrela-vermelha.png',
    url_foto_capa: '/banners/estrela-vermelha.jpg',
    url_uniforme_titular: '/midias/uniformes/estrela-vermelha-titular.jpg',
    cor_primaria: '#dc2626',
    cor_secundaria: '#991b1b',
    ano_fundacao: 2011,
    cidade: 'Curitiba',
    alinhamento: 'Esquerda, antifascismo',
    descricao: 'Clube de Futebol Estrela Vermelha, alinhado politicamente à esquerda.',
    historia: 'Idealizado em 2011, o time tem origem em futebol semanal iniciado em 2005 e foi refundado em 2016.',
    origem: 'Curitiba Oriental',
    ativo: true,
    titulos: [
      { competencia: 'Copa Eric Cantona', temporada: '2024-A', posicao: 'campeao' },
      { competencia: 'Copa Eric Cantona', temporada: '2024-C', posicao: 'campeao' },
      { competencia: 'Copa Eric Cantona', temporada: '2025-A', posicao: 'campeao' },
      { competencia: 'Recopa', temporada: '2025-C', posicao: 'campeao' },
    ],
    campanhas_destaque: [
      { competencia: 'Taça Cecília', temporada: '2022-A', posicao: 'vice' },
      { competencia: 'Taça Cecília', temporada: '2025-C', posicao: 'vice' },
    ],
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 't-002',
    nome: 'Guairacá Futebol Ancestral',
    slug: 'guairaca',
    nome_curto: 'GFA',
    url_logo: '/logos/times/guairaca.png',
    url_foto_capa: '/banners/guairaca.jpg',
    cor_primaria: '#84cc16',
    cor_secundaria: '#65a30d',
    ano_fundacao: 2012,
    cidade: 'Curitiba',
    alinhamento: 'Esquerda',
    descricao: 'Time com forte presença em competições da LFA.',
    historia: 'Equipe histórica da liga com destaque em várias edições da Taça Cecília.',
    origem: 'Curitiba',
    ativo: true,
    titulos: [
      { competencia: 'Taça Cecília', temporada: '2023-A', posicao: 'campeao' },
      { competencia: 'Taça Cecília', temporada: '2023-C', posicao: 'campeao' },
      { competencia: 'Taça Cecília', temporada: '2024-A', posicao: 'campeao' },
      { competencia: 'Taça Cecília', temporada: '2024-C', posicao: 'campeao' },
    ],
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 't-003',
    nome: 'Deportivo Oriental',
    slug: 'deportivo-oriental',
    nome_curto: 'DO',
    url_logo: '/logos/times/deportivo-oriental.png',
    url_foto_capa: '/banners/deportivo-oriental.jpg',
    cor_primaria: '#0ea5e9',
    cor_secundaria: '#0369a1',
    ano_fundacao: 2008,
    cidade: 'Curitiba',
    alinhamento: 'Esquerda',
    descricao: 'Time de forte identidade popular e presença histórica na liga.',
    historia: 'Time ligado a tradições esportivas do bairro oriental.',
    origem: 'Curitiba Oriental',
    ativo: true,
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 't-004',
    nome: 'Sankara',
    slug: 'sankara',
    nome_curto: 'SNK',
    url_logo: '/logos/times/sankara.png',
    url_foto_capa: '/banners/sankara.jpg',
    cor_primaria: '#f59e0b',
    cor_secundaria: '#d97706',
    ano_fundacao: 2015,
    cidade: 'Curitiba',
    alinhamento: 'Esquerda',
    descricao: 'Equipe com forte presença na fase final de competições.',
    historia: 'Nome inspirado no legado de Sankara e no pensamento anticolonial.',
    origem: 'Curitiba',
    ativo: true,
    titulos: [
      { competencia: 'Taça Cecília', temporada: '2026-A', posicao: 'campeao' },
    ],
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 't-005',
    nome: 'Primavera',
    slug: 'primavera',
    nome_curto: 'PRI',
    url_logo: '/logos/times/primavera.png',
    url_foto_capa: '/banners/primavera.jpg',
    cor_primaria: '#ec4899',
    cor_secundaria: '#be185d',
    ano_fundacao: 2011,
    cidade: 'Curitiba',
    alinhamento: 'Esquerda',
    descricao: 'Time ligado à cultura popular e ao futebol de bairro.',
    historia: 'Time estreitamente vinculado a movimentos coletivos da cidade.',
    origem: 'Curitiba',
    ativo: true,
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 't-006',
    nome: 'Teto Preto',
    slug: 'teto-preto',
    nome_curto: 'TP',
    url_logo: '/logos/times/teto-preto.png',
    url_foto_capa: '/banners/teto-preto.jpg',
    cor_primaria: '#1f2937',
    cor_secundaria: '#111827',
    ano_fundacao: 2009,
    cidade: 'Curitiba',
    alinhamento: 'Esquerda',
    descricao: 'Time de grande tradição na liga antiga e atual.',
    historia: 'Equipe que se consolidou como referência do futebol alternativo da cidade.',
    origem: 'Curitiba',
    ativo: true,
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 't-007',
    nome: 'Pé de Pano',
    slug: 'pe-de-pano',
    nome_curto: 'PDP',
    url_logo: '/logos/times/pe-de-pano.png',
    url_foto_capa: '/banners/pe-de-pano.jpg',
    cor_primaria: '#6366f1',
    cor_secundaria: '#4f46e5',
    ano_fundacao: 2013,
    cidade: 'Curitiba',
    alinhamento: 'Esquerda',
    descricao: 'Time com três títulos da Taça Cecília e forte raízes populares.',
    historia: 'A equipe representa uma tradição de futebol popular com forte presença na LFA.',
    origem: 'Curitiba',
    ativo: true,
    titulos: [
      { competencia: 'Taça Cecília', temporada: '2022-A', posicao: 'campeao' },
      { competencia: 'Taça Cecília', temporada: '2022-C', posicao: 'campeao' },
      { competencia: 'Taça Cecília', temporada: '2025-A', posicao: 'campeao' },
    ],
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 't-008',
    nome: 'Locomotiva Makhnovista F.S.C.',
    slug: 'locomotiva-makhnovista',
    nome_curto: 'LOKM',
    url_logo: '/logos/times/locomotiva.png',
    url_foto_capa: '/banners/locomotiva.jpg',
    cor_primaria: '#14b8a6',
    cor_secundaria: '#0d9488',
    ano_fundacao: 2014,
    cidade: 'Curitiba',
    alinhamento: 'Anarquismo e esquerda',
    descricao: 'Time histórico da liga, com forte identidade política e esportiva.',
    historia: 'O clube foi uma das referências iniciais da liga e participa de várias edições.',
    origem: 'Curitiba',
    ativo: true,
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 't-009',
    nome: 'Resistência Alviverde',
    slug: 'resistencia-alviverde',
    nome_curto: 'RA',
    url_logo: '/logos/times/resistencia.png',
    url_foto_capa: '/banners/resistencia.jpg',
    cor_primaria: '#10b981',
    cor_secundaria: '#059669',
    ano_fundacao: 2010,
    cidade: 'Curitiba',
    alinhamento: 'Esquerda',
    descricao: 'Equipe que representa o espírito de resistência e construção coletiva.',
    historia: 'Time ligado ao movimento popular e à disputa de copas e taças.',
    origem: 'Curitiba',
    ativo: true,
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
  {
    id: 't-010',
    nome: 'Azulão',
    slug: 'azulao',
    nome_curto: 'AZL',
    url_logo: '/logos/times/azulao.png',
    url_foto_capa: '/banners/azulao.jpg',
    cor_primaria: '#3b82f6',
    cor_secundaria: '#1d4ed8',
    ano_fundacao: 2007,
    cidade: 'Curitiba',
    alinhamento: 'Esquerda',
    descricao: 'Time com presença em campeonatos e copas da LFA.',
    historia: 'Historicamente relevante para a construção da liga.',
    origem: 'Curitiba',
    ativo: true,
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2026-05-28T00:00:00Z',
  },
];

// ==========================================
// 5. TABELA: TIMES_TEMPORADA
// ==========================================
export const times_temporada: TimeTemporada[] = [
  { id: 'tt-001', temporada_id: 'temp-001', time_id: 't-001', inscrito_em: '2025-02-15T00:00:00Z' },
  { id: 'tt-002', temporada_id: 'temp-001', time_id: 't-002', inscrito_em: '2025-02-15T00:00:00Z' },
  { id: 'tt-003', temporada_id: 'temp-001', time_id: 't-003', inscrito_em: '2025-02-15T00:00:00Z' },
  { id: 'tt-004', temporada_id: 'temp-001', time_id: 't-004', inscrito_em: '2025-02-15T00:00:00Z' },
  { id: 'tt-005', temporada_id: 'temp-001', time_id: 't-005', inscrito_em: '2025-02-15T00:00:00Z' },
  { id: 'tt-006', temporada_id: 'temp-002', time_id: 't-001', inscrito_em: '2025-06-15T00:00:00Z' },
  { id: 'tt-007', temporada_id: 'temp-002', time_id: 't-002', inscrito_em: '2025-06-15T00:00:00Z' },
  { id: 'tt-008', temporada_id: 'temp-002', time_id: 't-003', inscrito_em: '2025-06-15T00:00:00Z' },
  { id: 'tt-009', temporada_id: 'temp-002', time_id: 't-006', inscrito_em: '2025-06-15T00:00:00Z' },
  { id: 'tt-010', temporada_id: 'temp-002', time_id: 't-007', inscrito_em: '2025-06-15T00:00:00Z' },
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
  { id: 'j-001', usuario_id: 'u-001', nome: 'Carlos Silva', apelido: 'Carlão', url_foto: '/avatares/carlos-silva.jpg', data_nascimento: '1998-05-15', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-002', usuario_id: 'u-002', nome: 'Bruno Santos', apelido: 'Bruno', url_foto: '/avataros/bruno-santos.jpg', data_nascimento: '1995-03-22', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-003', usuario_id: undefined, nome: 'Marcos Lima', apelido: 'Marcão', url_foto: '/avatares/marcos-lima.jpg', data_nascimento: '1999-08-10', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-004', usuario_id: undefined, nome: 'Rafael Costa', apelido: 'Rafa', url_foto: '/avatares/rafael-costa.jpg', data_nascimento: '1997-11-30', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'j-005', usuario_id: undefined, nome: 'Diego Alves', apelido: 'Diego', url_foto: '/avatares/diego-alves.jpg', data_nascimento: '1996-06-18', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
];

// ==========================================
// 7. TABELA: REGISTROS_JOGADOR
// ==========================================
export const registros_jogador: RegistroJogador[] = [
  { id: 'rj-001', jogador_id: 'j-001', time_id: 't-001', temporada_id: 'temp-001', numero_camisa: 10, posicao: 'Atacante', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  { id: 'rj-002', jogador_id: 'j-002', time_id: 't-001', temporada_id: 'temp-001', numero_camisa: 1, posicao: 'Goleiro', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  { id: 'rj-003', jogador_id: 'j-003', time_id: 't-001', temporada_id: 'temp-001', numero_camisa: 7, posicao: 'Meia', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  { id: 'rj-004', jogador_id: 'j-004', time_id: 't-003', temporada_id: 'temp-001', numero_camisa: 9, posicao: 'Atacante', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  { id: 'rj-005', jogador_id: 'j-005', time_id: 't-003', temporada_id: 'temp-001', numero_camisa: 5, posicao: 'Zagueiro', ativo: true, criado_em: '2025-02-20T00:00:00Z', atualizado_em: '2025-02-20T00:00:00Z' },
  { id: 'rj-006', jogador_id: 'j-001', time_id: 't-001', temporada_id: 'temp-003', numero_camisa: 10, posicao: 'Atacante', ativo: true, criado_em: '2026-02-20T00:00:00Z', atualizado_em: '2026-02-20T00:00:00Z' },
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
    atualizado_em: '2025-03-10T21:30:00Z',
  },
];

// ==========================================
// 9. TABELA: EVENTOS_PARTIDA
// ==========================================
export const eventos_partida: EventoPartida[] = [
  { id: 'ep-001', partida_id: 'p-001', jogador_id: 'j-001', time_id: 't-001', tipo: 'gol', minuto: 15, criado_em: '2025-03-10T19:15:00Z' },
  { id: 'ep-002', partida_id: 'p-002', jogador_id: 'j-004', time_id: 't-003', tipo: 'gol', minuto: 40, criado_em: '2025-03-10T20:40:00Z' },
];

// ==========================================
// 10. TABELA: CLASSIFICAÇÃO
// ==========================================
export const classificacao: Classificacao[] = [
  { id: 'cl-001', competicao_id: 'comp-001', time_id: 't-001', jogos: 10, vitorias: 7, empates: 2, derrotas: 1, gols_pro: 21, gols_contra: 9, pontos: 23, atualizado_em: '2025-06-30T00:00:00Z' },
  { id: 'cl-002', competicao_id: 'comp-001', time_id: 't-002', jogos: 10, vitorias: 6, empates: 1, derrotas: 3, gols_pro: 19, gols_contra: 14, pontos: 19, atualizado_em: '2025-06-30T00:00:00Z' },
  { id: 'cl-003', competicao_id: 'comp-001', time_id: 't-003', jogos: 10, vitorias: 5, empates: 2, derrotas: 3, gols_pro: 17, gols_contra: 16, pontos: 17, atualizado_em: '2025-06-30T00:00:00Z' },
];

// ==========================================
// 11. TABELA: MÍDIA
// ==========================================
export const midia: Midia[] = [
  {
    id: 'm-001',
    liga_id: 'liga-001',
    tipo: 'logo',
    url: '/logos/gerais/laf-logo.png',
    legenda: 'Logo oficial da LFA',
    titulo: 'Logo da Liga',
    categoria: 'identidade',
    escopo: 'liga',
    carregado_por: 'u-001',
    criado_em: '2026-05-20T00:00:00Z',
  },
  {
    id: 'm-002',
    liga_id: 'liga-001',
    time_id: 't-001',
    tipo: 'foto',
    url: '/banners/estrela-vermelha.jpg',
    legenda: 'Foto de capa do CF Estrela Vermelha',
    titulo: 'Capa do Estrela Vermelha',
    categoria: 'time',
    escopo: 'time',
    carregado_por: 'u-001',
    criado_em: '2026-05-20T00:00:00Z',
  },
  {
    id: 'm-003',
    liga_id: 'liga-001',
    temporada_id: 'temp-003',
    tipo: 'banner',
    url: '/banners/apertura-26.jpg',
    legenda: 'Banner da Apertura 26',
    titulo: 'Banner da temporada',
    categoria: 'temporada',
    escopo: 'temporada',
    carregado_por: 'u-001',
    criado_em: '2026-05-20T00:00:00Z',
  },
];

// ==========================================
// 12. TABELA: PÓDIOS
// ==========================================
export const podios: Podio[] = [
  { id: 'pod-001', competicao_id: 'comp-001', time_primeiro_id: 't-007', time_segundo_id: 't-001', time_terceiro_id: 't-006', criado_em: '2025-06-30T00:00:00Z', atualizado_em: '2025-06-30T00:00:00Z' },
  { id: 'pod-002', competicao_id: 'comp-002', time_primeiro_id: 't-001', time_segundo_id: 't-005', time_terceiro_id: 't-004', criado_em: '2025-06-15T00:00:00Z', atualizado_em: '2025-06-15T00:00:00Z' },
];

// ==========================================
// 13. TABELA: USUÁRIOS
// ==========================================
export const usuarios: Usuario[] = [
  { id: 'u-001', nome: 'Administrador', email: 'admin@lfa.com', papel: 'admin', url_avatar: '/avatares/admin.jpg', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
  { id: 'u-002', nome: 'Moderador', email: 'moderador@lfa.com', papel: 'moderador', url_avatar: '/avatares/moderador.jpg', criado_em: '2024-01-01T00:00:00Z', atualizado_em: '2026-05-28T00:00:00Z' },
];

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================
export const getJogadoresPorTimeTemporada = (time_id: string, temporada_id: string) => {
  return registros_jogador
    .filter((registro) => registro.time_id === time_id && registro.temporada_id === temporada_id)
    .map((registro) => ({
      ...registro,
      jogador: jogadores.find((jogador) => jogador.id === registro.jogador_id),
    }));
};

export const getPartidas_PorCompeticao = (competicao_id: string) => {
  return partidas.filter((partida) => partida.competicao_id === competicao_id);
};

export const getCompeticoes_PorTemporada = (temporada_id: string) => {
  return competicoes.filter((competicao) => competicao.temporada_id === temporada_id);
};

export const getTimes_PorTemporada = (temporada_id: string) => {
  return times_temporada
    .filter((registro) => registro.temporada_id === temporada_id)
    .map((registro) => ({
      ...registro,
      time: times.find((time) => time.id === registro.time_id),
    }));
};
