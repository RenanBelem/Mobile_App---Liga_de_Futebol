import { describe, it, expect } from 'vitest';
import { authService, documentationService, matchService, overviewService, seasonService, teamService, tournamentService } from './apiRoutes';
import { jsonRouteRepository } from './jsonRouteRepository';

describe('api route services', () => {
  it('lists teams from the JSON-backed route layer', () => {
    const teams = teamService.list();

    expect(teams.length).toBeGreaterThan(0);
    expect(teams[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
    });
  });

  it('finds a team and its players by id', () => {
    const [firstTeam] = teamService.list();
    const team = teamService.getById(firstTeam.id);
    const players = teamService.getPlayersByTeam(firstTeam.id);

    expect(team?.name).toBeTruthy();
    expect(players.length).toBeGreaterThan(0);
    expect(players[0].teamId).toBe(firstTeam.id);
  });

  it('lists tournaments using the same route contract planned for FastAPI', () => {
    const tournaments = tournamentService.list();
    const selected = tournamentService.getById(tournaments[0].id);

    expect(tournaments.length).toBeGreaterThan(0);
    expect(selected?.name).toBeTruthy();
  });

  it('surfaces institutional documentation from the wiki-backed route layer', () => {
    const docs = documentationService.list();

    expect(docs.length).toBeGreaterThan(0);
    expect(docs[0]).toMatchObject({
      title: expect.any(String),
      summary: expect.any(String),
    });
  });

  it('exposes tournaments and podiums through the UI-friendly contract', () => {
    const [firstTournament] = tournamentService.list();
    const matches = tournamentService.getMatchesByTournament(firstTournament.id);
    const overview = overviewService.getHomeOverview();

    expect(matches.length).toBeGreaterThan(0);
    expect(Array.isArray(overview.finishedTournaments)).toBe(true);
    expect(overview.totalTournaments).toBe(tournamentService.list().length);
  });

  it('validates credentials from the JSON-backed auth dataset', () => {
    expect(authService.validateCredentials('admin', 'senha')).toBe(true);
    expect(authService.validateCredentials('testejog', 'senha')).toBe(true);
    expect(authService.validateCredentials('admin', 'senha123')).toBe(false);
  });

  it('keeps season descriptions aligned with JSON source', () => {
    const db = jsonRouteRepository.getDb();
    const seasonsById = new Map(db.seasons.map((season) => [season.id, season]));

    for (const season of seasonService.list()) {
      const source = seasonsById.get(season.seasonId);
      expect(source).toBeTruthy();
      expect(season.description ?? '').toBe(source?.description ?? '');
    }
  });

  it('keeps league header data aligned with JSON source', () => {
    const db = jsonRouteRepository.getDb();
    const overview = overviewService.getHomeOverview();
    const sourceLeague = db.leagues[0];

    expect(sourceLeague).toBeTruthy();
    expect(overview.league.id).toBe(sourceLeague.id);
    expect(overview.league.name).toBe(sourceLeague.name);
  });

  it('keeps matches aligned with JSON source ids', () => {
    const db = jsonRouteRepository.getDb();
    const sourceMatchIds = new Set(db.matches.map((match) => match.id));
    const uiMatchIds = matchService.list().map((match) => match.id);

    expect(uiMatchIds.length).toBe(db.matches.length);
    expect(uiMatchIds.every((id) => sourceMatchIds.has(id))).toBe(true);
  });

  it('keeps season and competition totals aligned with JSON source', () => {
    const db = jsonRouteRepository.getDb();
    const seasons = seasonService.list();
    const tournaments = tournamentService.list();

    expect(seasons.length).toBe(db.seasons.length);
    expect(tournaments.length).toBe(db.competitions.length);
  });

  it('keeps league current season label aligned with JSON in home overview', () => {
    const db = jsonRouteRepository.getDb();
    const overview = overviewService.getHomeOverview();
    const currentSeason = db.seasons.find((season) => season.status === 'em_andamento') ?? db.seasons[0];

    expect(overview.league.season).toBe(currentSeason?.name ?? 'Temporada');
  });
});
