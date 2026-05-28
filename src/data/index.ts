/**
 * SRC/DATA/INDEX.TS
 * ===============================
 * Ponto de entrada centralizado para todos os dados
 * Exporta dados mockados em PT-BR conforme schema de banco de dados
 */

// Exportar todos os dados do novo schema
export {
  ligas,
  temporadas,
  competicoes,
  times,
  times_temporada,
  jogadores,
  registros_jogador,
  partidas,
  eventos_partida,
  classificacao,
  midia,
  podios,
  usuarios,
  getJogadoresPorTimeTemporada,
  getPartidas_PorCompeticao,
  getCompeticoes_PorTemporada,
  getTimes_PorTemporada,
} from './database';

// Dados legados (retrocompatibilidade)
export {
  currentUser,
  teams,
  players,
  matches,
  matchEvents,
  podiums,
  tournaments,
  league,
  mediaItems,
  getPlayersByTeam,
  getMatchesByTournament,
  getTeamById,
} from './mock';
