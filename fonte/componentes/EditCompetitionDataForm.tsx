import { useMemo, useState } from 'react';
import { Building2, CalendarDays, Save, Trophy } from 'lucide-react';
import { jsonRouteRepository } from '@/servicos/jsonRouteRepository';
import { useToast } from '@/ganchos/use-toast';
import { dataGateway } from '@/servicos/dataGateway';

type SeasonStatus = 'rascunho' | 'em_andamento' | 'finalizada';
type CompetitionStatus = 'rascunho' | 'em_andamento' | 'finalizada' | 'cancelada';
type CompetitionType = 'campeonato' | 'copa';
type CompetitionFormat = 'turno_unico' | 'grupos_playoff' | 'eliminacao_direta';

const statusLabelMap: Record<string, string> = {
  rascunho: 'Rascunho',
  em_andamento: 'Em andamento',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
};

const competitionFormatLabelMap: Record<CompetitionFormat, string> = {
  turno_unico: 'Pontos Corridos',
  grupos_playoff: 'Pontos corridos + Eliminatórias',
  eliminacao_direta: 'Eliminatórias',
};

const createSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

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
  const [competitionType, setCompetitionType] = useState<CompetitionType>((selectedCompetition?.type as CompetitionType) ?? 'campeonato');
  const [competitionFormat, setCompetitionFormat] = useState<CompetitionFormat>((selectedCompetition?.format as CompetitionFormat) ?? 'turno_unico');
  const [competitionLogoUrl, setCompetitionLogoUrl] = useState(selectedCompetition?.logo_url ?? '');
  const [competitionBannerUrl, setCompetitionBannerUrl] = useState(selectedCompetition?.banner_url ?? '');

  const [newCompetitionName, setNewCompetitionName] = useState('');
  const [newCompetitionDescription, setNewCompetitionDescription] = useState('');
  const [newCompetitionType, setNewCompetitionType] = useState<CompetitionType>('campeonato');
  const [newCompetitionFormat, setNewCompetitionFormat] = useState<CompetitionFormat>('turno_unico');
  const [newCompetitionOrder, setNewCompetitionOrder] = useState<number>(1);
  const [seasonCompetitionToDeleteId, setSeasonCompetitionToDeleteId] = useState('');

  const seasonCompetitions = useMemo(() => {
    if (!selectedSeasonId) {
      return [];
    }

    return competitions
      .filter((competition) => competition.season_id === selectedSeasonId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [competitions, selectedSeasonId]);

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

    const linkedCompetitions = competitions
      .filter((competition) => competition.season_id === seasonId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const firstCompetition = linkedCompetitions[0];
    setSelectedCompetitionId(firstCompetition?.id ?? '');
    setSeasonCompetitionToDeleteId(firstCompetition?.id ?? '');
    setNewCompetitionOrder(linkedCompetitions.length + 1);

    setCompetitionName(firstCompetition?.name ?? '');
    setCompetitionDescription(firstCompetition?.description ?? '');
    setCompetitionStatus((firstCompetition?.status as CompetitionStatus) ?? 'rascunho');
    setCompetitionType((firstCompetition?.type as CompetitionType) ?? 'campeonato');
    setCompetitionFormat((firstCompetition?.format as CompetitionFormat) ?? 'turno_unico');
    setCompetitionLogoUrl(firstCompetition?.logo_url ?? '');
    setCompetitionBannerUrl(firstCompetition?.banner_url ?? '');
  };

  const handleCompetitionChange = (competitionId: string) => {
    setSelectedCompetitionId(competitionId);
    const competition = competitions.find((item) => item.id === competitionId);
    setCompetitionName(competition?.name ?? '');
    setCompetitionDescription(competition?.description ?? '');
    setCompetitionStatus((competition?.status as CompetitionStatus) ?? 'rascunho');
    setCompetitionType((competition?.type as CompetitionType) ?? 'campeonato');
    setCompetitionFormat((competition?.format as CompetitionFormat) ?? 'turno_unico');
    setCompetitionLogoUrl(competition?.logo_url ?? '');
    setCompetitionBannerUrl(competition?.banner_url ?? '');
  };

  const addCompetitionToSeason = async () => {
    if (!selectedSeasonId || !selectedSeason) {
      return;
    }

    if (!newCompetitionName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Informe o nome da nova competição antes de adicionar.',
        variant: 'destructive',
      });
      return;
    }

    const nowIso = new Date().toISOString();
    const slug = createSlug(newCompetitionName);
    const yearToken = String(selectedSeason.year ?? new Date().getFullYear());
    const newId = `comp-${yearToken}-${Date.now()}`;

    const createdCompetition = await dataGateway.insert('competitions', {
      id: newId,
      season_id: selectedSeasonId,
      name: newCompetitionName.trim(),
      slug,
      type: newCompetitionType,
      format: newCompetitionFormat,
      start_date: selectedSeason.start_date,
      end_date: selectedSeason.end_date,
      status: 'rascunho',
      order: Number(newCompetitionOrder) || seasonCompetitions.length + 1,
      description: newCompetitionDescription.trim(),
      organizer: 'LFA',
      logo_url: '',
      banner_url: '',
      created_at: nowIso,
      updated_at: nowIso,
    });

    toast({
      title: 'Competição adicionada',
      description: `A competição ${createdCompetition.name} foi vinculada à temporada selecionada.`,
    });

    window.location.reload();
  };

  const removeCompetitionFromSeason = async () => {
    if (!seasonCompetitionToDeleteId) {
      return;
    }

    const competition = competitions.find((item) => item.id === seasonCompetitionToDeleteId);
    const confirmed = window.confirm(`Deseja realmente excluir a competição ${competition?.name ?? 'selecionada'}?`);

    if (!confirmed) {
      return;
    }

    const removed = await dataGateway.remove('competitions', seasonCompetitionToDeleteId);

    if (!removed) {
      toast({
        title: 'Não foi possível excluir',
        description: 'A competição não foi encontrada para remoção.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Competição excluída',
      description: 'A competição foi removida da temporada.',
    });

    window.location.reload();
  };

  const saveLeague = async () => {
    if (!selectedLeagueId) return;

    await dataGateway.patch('leagues', selectedLeagueId, {
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

  const saveSeason = async () => {
    if (!selectedSeasonId) return;

    await dataGateway.patch('seasons', selectedSeasonId, {
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

  const saveCompetition = async () => {
    if (!selectedCompetitionId) return;

    await dataGateway.patch('competitions', selectedCompetitionId, {
      name: competitionName.trim(),
      description: competitionDescription.trim(),
      status: competitionStatus,
      type: competitionType,
      format: competitionFormat,
      slug: createSlug(competitionName),
      logo_url: competitionLogoUrl.trim(),
      banner_url: competitionBannerUrl.trim(),
      updated_at: new Date().toISOString(),
    });

    toast({
      title: 'Competição atualizada',
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

        <div className="space-y-3 rounded-lg border border-border/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Adicionar competição na temporada</p>

          <input
            value={newCompetitionName}
            onChange={(event) => setNewCompetitionName(event.target.value)}
            className="w-full p-2.5 bg-background/40 border border-border rounded-md"
            placeholder="Nome da competição"
          />

          <textarea
            value={newCompetitionDescription}
            onChange={(event) => setNewCompetitionDescription(event.target.value)}
            className="w-full min-h-16 p-2.5 bg-background/40 border border-border rounded-md"
            placeholder="Descrição da competição"
          />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <select
              value={newCompetitionType}
              onChange={(event) => setNewCompetitionType(event.target.value as CompetitionType)}
              className="w-full p-2.5 bg-background/40 border border-border rounded-md"
            >
              <option value="campeonato">Campeonato</option>
              <option value="copa">Copa</option>
            </select>

            <select
              value={newCompetitionFormat}
              onChange={(event) => setNewCompetitionFormat(event.target.value as CompetitionFormat)}
              className="w-full p-2.5 bg-background/40 border border-border rounded-md"
            >
              {Object.entries(competitionFormatLabelMap).map(([formatValue, label]) => (
                <option key={formatValue} value={formatValue}>{label}</option>
              ))}
            </select>

            <input
              value={newCompetitionOrder}
              onChange={(event) => setNewCompetitionOrder(Number(event.target.value) || 1)}
              type="number"
              min={1}
              className="w-full p-2.5 bg-background/40 border border-border rounded-md"
              placeholder="Ordem"
            />
          </div>

          <button
            type="button"
            onClick={addCompetitionToSeason}
            className="w-full rounded-md bg-primary py-2.5 font-semibold text-primary-foreground"
          >
            Adicionar competição
          </button>
        </div>

        <div className="space-y-3 rounded-lg border border-border/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Excluir competição da temporada</p>

          <select
            value={seasonCompetitionToDeleteId}
            onChange={(event) => setSeasonCompetitionToDeleteId(event.target.value)}
            className="w-full p-2.5 bg-background/40 border border-border rounded-md"
          >
            <option value="">Selecione a competição</option>
            {seasonCompetitions.map((competition) => (
              <option key={competition.id} value={competition.id}>
                {competition.name} ({competitionFormatLabelMap[(competition.format as CompetitionFormat) ?? 'turno_unico'] ?? 'Formato indefinido'})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={removeCompetitionFromSeason}
            disabled={!seasonCompetitionToDeleteId}
            className="w-full rounded-md border border-destructive/40 py-2.5 font-semibold text-destructive disabled:opacity-50"
          >
            Excluir competição
          </button>
        </div>
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

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            value={competitionType}
            onChange={(event) => setCompetitionType(event.target.value as CompetitionType)}
            className="w-full p-2.5 bg-background/40 border border-border rounded-md"
          >
            <option value="campeonato">Campeonato</option>
            <option value="copa">Copa</option>
          </select>

          <select
            value={competitionFormat}
            onChange={(event) => setCompetitionFormat(event.target.value as CompetitionFormat)}
            className="w-full p-2.5 bg-background/40 border border-border rounded-md"
          >
            {Object.entries(competitionFormatLabelMap).map(([formatValue, label]) => (
              <option key={formatValue} value={formatValue}>{label}</option>
            ))}
          </select>
        </div>

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
          Atualizar competição
        </button>
      </div>
    </div>
  );
};

export default EditCompetitionDataForm;
