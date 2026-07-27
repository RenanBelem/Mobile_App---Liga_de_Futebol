import { useMemo, useState } from 'react';
import { Building2, CalendarDays, Save, Trophy } from 'lucide-react';
import { jsonRouteRepository } from '@/servicos/jsonRouteRepository';
import { useToast } from '@/ganchos/use-toast';

type SeasonStatus = 'rascunho' | 'em_andamento' | 'finalizada';
type CompetitionStatus = 'rascunho' | 'em_andamento' | 'finalizada' | 'cancelada';

const statusLabelMap: Record<string, string> = {
  rascunho: 'Rascunho',
  em_andamento: 'Em andamento',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
};

const EditCompetitionDataForm = () => {
  const { toast } = useToast();

  const leagues = useMemo(() => {
    return jsonRouteRepository.get('leagues');
  }, []);

  const seasons = useMemo(() => {
    return jsonRouteRepository.get('seasons');
  }, []);

  const competitions = useMemo(() => {
    return jsonRouteRepository.get('competitions');
  }, []);

  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(leagues[0]?.id ?? '');
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(seasons[0]?.id ?? '');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string>(competitions[0]?.id ?? '');

  const selectedLeague = useMemo(
    () => leagues.find((league) => league.id === selectedLeagueId),
    [leagues, selectedLeagueId]
  );

  const selectedSeason = useMemo(
    () => seasons.find((season) => season.id === selectedSeasonId),
    [seasons, selectedSeasonId]
  );

  const selectedCompetition = useMemo(
    () => competitions.find((competition) => competition.id === selectedCompetitionId),
    [competitions, selectedCompetitionId]
  );

  const [leagueName, setLeagueName] = useState(selectedLeague?.name ?? '');
  const [leagueDescription, setLeagueDescription] = useState(selectedLeague?.description ?? '');
  const [leagueLogoUrl, setLeagueLogoUrl] = useState(selectedLeague?.logo_url ?? '');

  const [seasonName, setSeasonName] = useState(selectedSeason?.name ?? '');
  const [seasonDescription, setSeasonDescription] = useState(selectedSeason?.description ?? '');
  const [seasonStatus, setSeasonStatus] = useState<SeasonStatus>((selectedSeason?.status as SeasonStatus) ?? 'rascunho');
  const [seasonBannerUrl, setSeasonBannerUrl] = useState(selectedSeason?.banner_url ?? '');

  const [competitionName, setCompetitionName] = useState(selectedCompetition?.name ?? '');
  const [competitionDescription, setCompetitionDescription] = useState(selectedCompetition?.description ?? '');
  const [competitionStatus, setCompetitionStatus] = useState<CompetitionStatus>((selectedCompetition?.status as CompetitionStatus) ?? 'rascunho');
  const [competitionLogoUrl, setCompetitionLogoUrl] = useState(selectedCompetition?.logo_url ?? '');
  const [competitionBannerUrl, setCompetitionBannerUrl] = useState(selectedCompetition?.banner_url ?? '');

  const handleLeagueChange = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    const league = leagues.find((item) => item.id === leagueId);
    setLeagueName(league?.name ?? '');
    setLeagueDescription(league?.description ?? '');
    setLeagueLogoUrl(league?.logo_url ?? '');
  };

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
    const season = seasons.find((item) => item.id === seasonId);
    setSeasonName(season?.name ?? '');
    setSeasonDescription(season?.description ?? '');
    setSeasonStatus((season?.status as SeasonStatus) ?? 'rascunho');
    setSeasonBannerUrl(season?.banner_url ?? '');
  };

  const handleCompetitionChange = (competitionId: string) => {
    setSelectedCompetitionId(competitionId);
    const competition = competitions.find((item) => item.id === competitionId);
    setCompetitionName(competition?.name ?? '');
    setCompetitionDescription(competition?.description ?? '');
    setCompetitionStatus((competition?.status as CompetitionStatus) ?? 'rascunho');
    setCompetitionLogoUrl(competition?.logo_url ?? '');
    setCompetitionBannerUrl(competition?.banner_url ?? '');
  };

  const saveLeague = () => {
    if (!selectedLeagueId) return;

    jsonRouteRepository.patch('leagues', selectedLeagueId, {
      name: leagueName.trim(),
      description: leagueDescription.trim(),
      logo_url: leagueLogoUrl.trim(),
    });

    toast({
      title: 'Liga atualizada',
      description: 'As alterações da liga foram salvas. Recarregando os dados...',
    });

    window.location.reload();
  };

  const saveSeason = () => {
    if (!selectedSeasonId) return;

    jsonRouteRepository.patch('seasons', selectedSeasonId, {
      name: seasonName.trim(),
      description: seasonDescription.trim(),
      status: seasonStatus,
      banner_url: seasonBannerUrl.trim(),
    });

    toast({
      title: 'Temporada atualizada',
      description: 'As alterações da temporada foram salvas. Recarregando os dados...',
    });

    window.location.reload();
  };

  const saveCompetition = () => {
    if (!selectedCompetitionId) return;

    jsonRouteRepository.patch('competitions', selectedCompetitionId, {
      name: competitionName.trim(),
      description: competitionDescription.trim(),
      status: competitionStatus,
      logo_url: competitionLogoUrl.trim(),
      banner_url: competitionBannerUrl.trim(),
    });

    toast({
      title: 'Campeonato atualizado',
      description: 'As alterações da competição foram salvas. Recarregando os dados...',
    });

    window.location.reload();
  };

  return (
    <div className="glass-card rounded-lg p-5 border border-border/50 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Save className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Editar Liga, Temporada e Campeonato</h2>
      </div>

      <div className="space-y-4 rounded-lg border border-border/50 p-4">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Building2 className="w-3 h-3" /> Liga
        </label>
        <select
          value={selectedLeagueId}
          onChange={(event) => handleLeagueChange(event.target.value)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
        >
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>{league.name}</option>
          ))}
        </select>

        <input
          value={leagueName}
          onChange={(event) => setLeagueName(event.target.value)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
          placeholder="Nome da liga"
        />

        <input
          value={leagueLogoUrl}
          onChange={(event) => setLeagueLogoUrl(event.target.value)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
          placeholder="URL do logo"
        />

        <textarea
          value={leagueDescription}
          onChange={(event) => setLeagueDescription(event.target.value)}
          className="w-full min-h-20 p-2.5 bg-background/40 border border-border rounded-md"
          placeholder="Descrição da liga"
        />

        <button
          type="button"
          onClick={saveLeague}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-semibold"
        >
          Salvar Liga
        </button>
      </div>

      <div className="space-y-4 rounded-lg border border-border/50 p-4">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <CalendarDays className="w-3 h-3" /> Temporada
        </label>
        <select
          value={selectedSeasonId}
          onChange={(event) => handleSeasonChange(event.target.value)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>{season.name}</option>
          ))}
        </select>

        <input
          value={seasonName}
          onChange={(event) => setSeasonName(event.target.value)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
          placeholder="Nome da temporada"
        />

        <select
          value={seasonStatus}
          onChange={(event) => setSeasonStatus(event.target.value as SeasonStatus)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
        >
          <option value="rascunho">Rascunho</option>
          <option value="em_andamento">Em andamento</option>
          <option value="finalizada">Finalizada</option>
        </select>

        <input
          value={seasonBannerUrl}
          onChange={(event) => setSeasonBannerUrl(event.target.value)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
          placeholder="URL do banner"
        />

        <textarea
          value={seasonDescription}
          onChange={(event) => setSeasonDescription(event.target.value)}
          className="w-full min-h-20 p-2.5 bg-background/40 border border-border rounded-md"
          placeholder="Descrição da temporada"
        />

        <button
          type="button"
          onClick={saveSeason}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-semibold"
        >
          Salvar Temporada
        </button>
      </div>

      <div className="space-y-4 rounded-lg border border-border/50 p-4">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-3 h-3" /> Campeonato
        </label>
        <select
          value={selectedCompetitionId}
          onChange={(event) => handleCompetitionChange(event.target.value)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
        >
          {competitions.map((competition) => (
            <option key={competition.id} value={competition.id}>{competition.name}</option>
          ))}
        </select>

        <input
          value={competitionName}
          onChange={(event) => setCompetitionName(event.target.value)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
          placeholder="Nome do campeonato"
        />

        <select
          value={competitionStatus}
          onChange={(event) => setCompetitionStatus(event.target.value as CompetitionStatus)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
        >
          {Object.entries(statusLabelMap).map(([statusValue, label]) => (
            <option key={statusValue} value={statusValue}>{label}</option>
          ))}
        </select>

        <input
          value={competitionLogoUrl}
          onChange={(event) => setCompetitionLogoUrl(event.target.value)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
          placeholder="URL do logo"
        />

        <input
          value={competitionBannerUrl}
          onChange={(event) => setCompetitionBannerUrl(event.target.value)}
          className="w-full p-2.5 bg-background/40 border border-border rounded-md"
          placeholder="URL do banner"
        />

        <textarea
          value={competitionDescription}
          onChange={(event) => setCompetitionDescription(event.target.value)}
          className="w-full min-h-20 p-2.5 bg-background/40 border border-border rounded-md"
          placeholder="Descrição do campeonato"
        />

        <button
          type="button"
          onClick={saveCompetition}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-semibold"
        >
          Salvar Campeonato
        </button>
      </div>
    </div>
  );
};

export default EditCompetitionDataForm;
