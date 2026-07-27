/**
 * SRC/TYPES/LEAGUE.TS
 * ===============================
 * PROPÓSITO: Definição de tipos/interfaces do projeto
 * - Define entidades conforme schema de banco de dados em PT-BR
 * - Normaliza estrutura de dados para toda a aplicação
 * - Fornece type safety ao utilizar dados em componentes
 * MOTIVO: Arquivo central de tipos que garante type safety,
 * documenta estrutura de dados e facilita manutenção
 */
// src/types/league.ts

// ==========================================
// TIPOS COMPARTILHADOS
// ==========================================
export type TipoPapelUsuario = 'admin' | 'moderador' | 'jogador' | 'torcedor';
export type TipoCompeticao = 'campeonato' | 'copa' | 'playoff';
export type FormatoCompeticao = 'turno_unico' | 'eliminacao_direta' | 'grupos_playoff';
export type StatusTemporada = 'rascunho' | 'em_andamento' | 'finalizada';
export type StatusCompeticao = 'rascunho' | 'em_andamento' | 'finalizada' | 'cancelada';
export type StatusPartida = 'agendada' | 'ao_vivo' | 'finalizada' | 'cancelada';
export type TipoEvento = 'gol' | 'assistencia' | 'cartao_amarelo' | 'cartao_vermelho' | 'gol_contra';
export type TipoMidia = 'foto' | 'video' | 'logo' | 'banner' | 'uniforme';

export interface HistoricoTime {
  competencia: string;
  temporada: string;
  posicao: 'campeao' | 'vice' | 'terceiro' | 'quarto';
}

export interface ResumoCompeticaoTemporada {
  nome: string;
  campeao_id?: string;
  vice_id?: string;
  terceiro_id?: string;
  quarto_id?: string;
  temporada_slug?: string;
}

// ==========================================
// 1. TABELA: USUÁRIOS
// ==========================================
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: TipoPapelUsuario;
  url_avatar?: string;
  criado_em: string;
  atualizado_em: string;
}

// ==========================================
// 2. TABELA: LIGAS (Entidade permanente)
// ==========================================
export interface Liga {
  id: string;
  nome: string;
  url_logo?: string;
  cidade?: string;
  criado_em: string;
  atualizado_em: string;
}

// ==========================================
// 3. TABELA: TEMPORADAS (Edições: Apertura/Clausura)
// ==========================================
export interface Temporada {
  id: string;
  liga_id: string; // FK
  nome: string; // Ex: "Apertura 25"
  slug: string; // Ex: "apertura-25"
  ano: number;
  semestre: 'apertura' | 'clausura';
  data_inicio: string;
  data_fim: string;
  status: StatusTemporada;
  descricao?: string;
  url_banner?: string;
  resumo_competicoes?: ResumoCompeticaoTemporada[];
  criado_em: string;
  atualizado_em: string;
}

// ==========================================
// 4. TABELA: COMPETIÇÕES (Dentro de cada temporada)
// ==========================================
export interface Competicao {
  id: string;
  temporada_id: string; // FK
  nome: string; // Ex: "Campeonato Principal"
  slug: string;
  tipo: TipoCompeticao; // 'campeonato', 'copa', 'playoff'
  formato: FormatoCompeticao;
  data_inicio: string;
  data_fim: string;
  status: StatusCompeticao;
  ordem: number; // Ordenação visual
  descricao?: string;
  organizador?: string;
  url_logo?: string;
  url_banner?: string;
  criado_em: string;
  atualizado_em: string;
}

// ==========================================
// 5. TABELA: TIMES (Entidade permanente)
// ==========================================
export interface Time {
  id: string;
  nome: string;
  slug?: string;
  nome_curto?: string; // Ex: "LOKM"
  url_logo?: string;
  url_foto_capa?: string;
  url_uniforme_titular?: string;
  cor_primaria?: string; // Hex
  cor_secundaria?: string; // Hex
  ano_fundacao?: number;
  cidade?: string;
  alinhamento?: string;
  descricao?: string;
  historia?: string;
  origem?: string;
  ativo: boolean;
  titulos?: HistoricoTime[];
  campanhas_destaque?: HistoricoTime[];
  criado_em: string;
  atualizado_em: string;
}

// ==========================================
// 6. TABELA: TIMES_TEMPORADA (Participação)
// ==========================================
export interface TimeTemporada {
  id: string;
  temporada_id: string; // FK
  time_id: string; // FK
  inscrito_em: string;
}

// ==========================================
// 7. TABELA: JOGADORES (Entidade permanente)
// ==========================================
export interface Jogador {
  id: string;
  usuario_id?: string; // FK opcional
  nome: string;
  apelido?: string;
  url_foto?: string;
  data_nascimento?: string;
  criado_em: string;
  atualizado_em: string;
}

// ==========================================
// 8. TABELA: REGISTROS_JOGADOR (Vínculo jogador × time × temporada)
// ==========================================
export interface RegistroJogador {
  id: string;
  jogador_id: string; // FK
  time_id: string; // FK
  temporada_id: string; // FK
  numero_camisa: number;
  posicao: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

// ==========================================
// 9. TABELA: PARTIDAS
// ==========================================
export interface Partida {
  id: string;
  competicao_id: string; // FK
  time_casa_id: string; // FK
  time_visitante_id: string; // FK
  placar_casa?: number;
  placar_visitante?: number;
  data_hora: string;
  rodada: string; // Ex: "Rodada 5", "Semifinal"
  local?: string;
  status: StatusPartida;
  criado_em: string;
  atualizado_em: string;
}

// ==========================================
// 10. TABELA: EVENTOS_PARTIDA
// ==========================================
export interface EventoPartida {
  id: string;
  partida_id: string; // FK
  jogador_id: string; // FK
  time_id: string; // FK
  tipo: TipoEvento;
  minuto: number;
  criado_em: string;
}

// ==========================================
// 11. TABELA: CLASSIFICAÇÃO (Cacheada/Calculada)
// ==========================================
export interface Classificacao {
  id: string;
  competicao_id: string; // FK
  time_id: string; // FK
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  gols_pro: number;
  gols_contra: number;
  pontos: number;
  atualizado_em: string;
}

// ==========================================
// 12. TABELA: MÍDIA
// ==========================================
export interface Midia {
  id: string;
  liga_id: string; // FK (sempre preenchido)
  temporada_id?: string; // FK opcional
  partida_id?: string; // FK opcional
  time_id?: string; // FK opcional
  tipo: TipoMidia;
  url: string;
  url_thumbnail?: string;
  legenda?: string;
  titulo?: string;
  categoria?: string;
  escopo?: 'liga' | 'temporada' | 'time' | 'competicao' | 'partida';
  carregado_por: string; // FK usuario_id
  criado_em: string;
}

// ==========================================
// 13. TABELA: PÓDIOS
// ==========================================
export interface Podio {
  id: string;
  competicao_id: string; // FK UNIQUE
  time_primeiro_id: string; // FK
  time_segundo_id: string; // FK
  time_terceiro_id: string; // FK
  jogador_artilheiro_id?: string; // FK
  jogador_melhor_id?: string; // FK
  criado_em: string;
  atualizado_em: string;
}

// ==========================================
// TIPOS LEGADOS (Retrocompatibilidade)
// ==========================================
export type UserRole = 'admin' | 'moderator' | 'player' | 'fan';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logoUrl?: string;
  foundationYear?: string;
  colors?: string;
  description?: string;
  biography?: string;
  history?: string;
  coverImageUrl?: string;
  uniformUrl?: string;
  slug?: string;
  titles?: Array<{ competition: string; season: string; position: 'campeao' | 'vice' | 'terceiro' | 'quarto' }>;
  highlights?: Array<{ competition: string; season: string; position: 'campeao' | 'vice' | 'terceiro' | 'quarto' }>;
  photos?: Array<{ url: string; caption?: string }>;
}

export interface Player {
  id: string;
  teamId: string;
  userId?: string;
  name: string;
  number?: number;
  position?: string;
  photoUrl?: string;
}

export interface League {
  id: string;
  name: string;
  season: string;
  logoUrl?: string;
}

export interface Tournament {
  id: string;
  leagueId: string;
  name: string;
  type: 'league' | 'cup';
  season: string;
  status: 'draft' | 'ongoing' | 'finished';
  description?: string;
  format?: string;
  history?: string;
  logoUrl?: string;
  bannerUrl?: string;
  editions?: Array<{ season: string; result: string; champion?: string }>;
  resultsSummary?: string[];
}

export interface Match {
  id: string;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  round?: string;
  status: 'scheduled' | 'live' | 'finished';
}

export type EventType = 'goal' | 'assist' | 'yellow_card' | 'red_card';

export interface MatchEvent {
  id: string;
  matchId: string;
  playerId: string;
  type: EventType;
  minute?: number;
}

export interface Podium {
  id: string;
  tournamentId: string;
  firstPlaceId: string;
  secondPlaceId: string;
  thirdPlaceId: string;
}

export interface MediaItem {
  id: string;
  tournamentId?: string;
  type: 'photo' | 'video';
  url: string;
  caption?: string;
  date: string;
}

export interface DocumentationItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  content: string;
}

export interface SeasonCompetitionSummary {
  id: string;
  name: string;
  status: string;
  type?: TipoCompeticao;
  description?: string;
  logoUrl?: string;
  order?: number;
}

export interface SeasonSummary {
  seasonId: string;
  seasonName: string;
  description?: string;
  competitions: SeasonCompetitionSummary[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: 'create' | 'update' | 'delete';
  entity: 'team' | 'player' | 'match' | 'tournament';
  entityId: string;
  description: string;
  timestamp: string;
}