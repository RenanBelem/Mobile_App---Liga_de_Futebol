/**
 * SRC/paginas/TOURNAMENTS.TSX
 * ===============================
 * PROPÓSITO: Página de listagem das temporadas da liga
 * - Exibe as temporadas em ordem cronológica descendente
 * - Separa as edições por Apertura e Clausura
 * - Mostra as competições disputadas em cada temporada
 */
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Calendar, ArrowLeft } from 'lucide-react';
import PageHeader from '@/componentes/PageHeader';
import { seasonService, tournamentService } from '@/servicos/apiRoutes';

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const tacaPriority = [
  'taca cecilia',
  'taca sissi',
  'taca wladimir rodrigues',
];

const copaPriority = [
  'copa eric cantona',
  'copa carlos caszely',
  'copa foice',
];

const getPriorityIndex = (normalizedName: string, priorities: string[]) => {
  const index = priorities.findIndex((item) => item === normalizedName);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const resolveCompetitionLogo = (name: string, fallback?: string) => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes('copa eric cantona')) {
    return '/logos/gerais/logo_cantona.jpg';
  }

  if (normalizedName.includes('taça cecília') || normalizedName.includes('taca cecilia')) {
    return '/logos/gerais/logo_cecilia.jpg';
  }

  if (normalizedName.includes('copa carlos caszely')) {
    return '/logos/gerais/logo_caszely.jpg';
  }

  if (normalizedName.includes('copa foice')) {
    return '/logos/gerais/logo_foice.jpg';
  }

  if (normalizedName.includes('taça sissi') || normalizedName.includes('taca sissi')) {
    return '/logos/gerais/logo_sissi.jpg';
  }

  if (normalizedName.includes('taça wladimir') || normalizedName.includes('taca wladimir')) {
    return '/logos/gerais/logo_wladimir.jpg';
  }

  if (normalizedName.includes('supertaça') || normalizedName.includes('supertaca')) {
    return '/logos/gerais/escudo_LFA.jpg';
  }

  if (normalizedName.includes('recopa')) {
    return '/logos/gerais/escudo_LFA.jpg';
  }

  return fallback ?? '/logos/gerais/campeonatos_logos.png';
};

const getSeasonYear = (seasonName: string) => {
  const match = seasonName.match(/(\d{2,4})/);
  const rawYear = Number(match?.[1] ?? 0);
  return rawYear < 100 ? rawYear + 2000 : rawYear;
};

const getSemesterPriority = (seasonName: string) => (seasonName.toLowerCase().includes('clausura') ? 0 : 1);

const Tournaments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const seasons = useMemo(() => seasonService.list(), []);
  const tournaments = useMemo(() => tournamentService.list(), []);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>((location.state as { selectedSeasonId?: string } | null)?.selectedSeasonId ?? null);

  const orderedSeasons = useMemo(() => {
    return [...seasons].sort((a, b) => {
      const yearDifference = getSeasonYear(b.seasonName) - getSeasonYear(a.seasonName);
      if (yearDifference !== 0) {
        return yearDifference;
      }
      return getSemesterPriority(a.seasonName) - getSemesterPriority(b.seasonName);
    });
  }, [seasons]);

  const selectedSeason = useMemo(() => orderedSeasons.find((season) => season.seasonId === selectedSeasonId), [orderedSeasons, selectedSeasonId]);

  const linkedSeasonCompetitions = useMemo(() => {
    if (!selectedSeason) {
      return [];
    }

    return [...selectedSeason.competitions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [selectedSeason]);

  const tacas = useMemo(() => {
    return [...linkedSeasonCompetitions]
      .filter((competition) => normalizeText(competition.name).startsWith('taca'))
      .sort((a, b) => {
        const normalizedA = normalizeText(a.name);
        const normalizedB = normalizeText(b.name);
        const priorityDifference = getPriorityIndex(normalizedA, tacaPriority) - getPriorityIndex(normalizedB, tacaPriority);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        const orderDifference = (a.order ?? 0) - (b.order ?? 0);
        if (orderDifference !== 0) {
          return orderDifference;
        }

        return normalizedA.localeCompare(normalizedB);
      });
  }, [linkedSeasonCompetitions]);

  const copas = useMemo(() => {
    return [...linkedSeasonCompetitions]
      .filter((competition) => normalizeText(competition.name).startsWith('copa'))
      .sort((a, b) => {
        const normalizedA = normalizeText(a.name);
        const normalizedB = normalizeText(b.name);
        const priorityDifference = getPriorityIndex(normalizedA, copaPriority) - getPriorityIndex(normalizedB, copaPriority);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        const orderDifference = (a.order ?? 0) - (b.order ?? 0);
        if (orderDifference !== 0) {
          return orderDifference;
        }

        return normalizedA.localeCompare(normalizedB);
      });
  }, [linkedSeasonCompetitions]);

  const competitionRows = useMemo(() => {
    const rows: Array<[typeof tacas[number] | undefined, typeof copas[number] | undefined]> = [];

    const maxRows = Math.max(tacas.length, copas.length);

    for (let index = 0; index < maxRows; index += 1) {
      rows.push([tacas[index], copas[index]]);
    }

    return rows;
  }, [copas, tacas]);

  const getTournamentByCompetition = (competitionName: string) => {
    return tournaments.find((tournament) => {
      const normalizedTournamentName = tournament.name.replace(/^Campeonato\s+/i, '');
      return normalizeText(normalizedTournamentName) === normalizeText(competitionName);
    });
  };

  return (
    <div className="pb-24">
      <PageHeader title="Temporadas" subtitle="Apertura e Clausura" />
      <div className="px-4 pt-4 space-y-4">
        {selectedSeason ? (
          <>
            <button
              onClick={() => setSelectedSeasonId(null)}
              className="flex items-center gap-2 text-sm font-medium text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para as temporadas
            </button>

            <motion.section
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass-card rounded-xl border border-border/60 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">{selectedSeason.seasonName}</h2>
                  {selectedSeason.description ? <p className="mt-1 text-[11px] text-muted-foreground">{selectedSeason.description}</p> : null}
                </div>
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {tacas.length || copas.length ? (
                  competitionRows.length ? (
                    <div className="grid gap-3">
                      {competitionRows.map(([leftCompetition, rightCompetition]) => {
                        const renderCompetitionCard = (entry: (typeof tacas)[number] | (typeof copas)[number]) => {
                          const matchingTournament = getTournamentByCompetition(entry.name);

                          return (
                            <button
                              key={entry.id}
                              onClick={() => {
                                if (matchingTournament) {
                                  navigate(`/tournaments/${matchingTournament.id}`, { state: { selectedSeasonId: selectedSeason?.seasonId } });
                                  return;
                                }
                                navigate('/tournaments');
                              }}
                              className="flex min-h-24 w-full items-center gap-3 rounded-lg border border-border/50 bg-background/70 p-3 text-left transition-colors hover:border-primary/40"
                            >
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background/70">
                                <img
                                  src={entry.logoUrl ?? resolveCompetitionLogo(entry.name)}
                                  alt={entry.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">{entry.name}</p>
                                <p className="mt-0.5 text-[11px] text-muted-foreground">{entry.description || 'Competição da liga'}</p>
                              </div>
                            </button>
                          );
                        };

                        return (
                          <div key={`${leftCompetition?.id ?? 'empty'}-${rightCompetition?.id ?? 'empty'}`} className="grid grid-cols-2 gap-3">
                            {leftCompetition ? renderCompetitionCard(leftCompetition) : <div />}
                            {rightCompetition ? renderCompetitionCard(rightCompetition) : <div />}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-dashed border-border/60 p-3 text-sm text-muted-foreground">
                      Nenhuma competição cadastrada para este período ainda.
                    </p>
                  )
                ) : (
                  <p className="rounded-lg border border-dashed border-border/60 p-3 text-sm text-muted-foreground">
                    Nenhuma competição cadastrada para este período ainda.
                  </p>
                )}
              </div>
            </motion.section>
          </>
        ) : (
          <div className="space-y-3">
            {orderedSeasons.map((season, index) => (
              <motion.button
                key={season.seasonId}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedSeasonId(season.seasonId)}
                className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-background/70 p-3 text-left transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{season.seasonName}</p>
                    {season.description ? <p className="mt-0.5 text-[11px] text-muted-foreground">{season.description}</p> : null}
                  </div>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
