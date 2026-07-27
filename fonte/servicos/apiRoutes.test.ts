import { describe, it, expect } from 'vitest';
import { authService, documentationService, overviewService, teamService, tournamentService } from './apiRoutes';

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
    const team = teamService.getById('1');
    const players = teamService.getPlayersByTeam('1');

    expect(team?.name).toContain('Estrela');
    expect(players.length).toBeGreaterThan(0);
    expect(players[0].teamId).toBe('1');
  });

  it('lists tournaments using the same route contract planned for FastAPI', () => {
    const tournaments = tournamentService.list();
    const selected = tournamentService.getById('t1');

    expect(tournaments.length).toBeGreaterThan(0);
    expect(selected?.name).toContain('Campeonato');
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
    const matches = tournamentService.getMatchesByTournament('t1');
    const overview = overviewService.getHomeOverview();

    expect(matches.length).toBeGreaterThan(0);
    expect(overview.finishedTournaments.some((tournament) => tournament.podium?.firstPlaceId === '7')).toBe(true);
  });

  it('validates credentials from the JSON-backed auth dataset', () => {
    expect(authService.validateCredentials('admin', 'senha')).toBe(true);
    expect(authService.validateCredentials('testejog', 'senha')).toBe(true);
    expect(authService.validateCredentials('admin', 'senha123')).toBe(false);
  });
});
