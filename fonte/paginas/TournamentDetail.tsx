/**
 * SRC/PAGES/TOURNAMENTDETAIL.TSX
 * ===============================
 * PROPÓSITO: Página de detalhes de um torneio específico
 * - Exibe informações do torneio (nome, datas, status)
 * - Mostra abas para: Partidas, Classificação, Estatísticas, Mídias
 * - Exibe pódio se torneio está encerrado
 * MOTIVO: Página crucial para visualizar todos os dados de um torneio,
 * incluindo partidas, standings e resultados finais
 */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { tournaments, teams, currentUser } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Plus, Edit2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import MatchCard from '@/components/MatchCard';
import StandingsTable from '@/components/StandingsTable';
import PodiumCard from '@/components/PodiumCard';
import { Player } from '@/types/league';


type Tab = 'matches' | 'standings' | 'stats' | 'media';

const TournamentDetail = () => {
  const { id } = useParams();
  const tournament = tournaments.find(t => t.id === id);
  const [activeTab, setActiveTab] = useState<Tab>('matches');
  // Lógica de permissão simplificada
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'moderator';
  const isAdmin = currentUser.role === 'admin';
  const isModerator = currentUser.role === 'moderator' || isAdmin;
  const isPlayer = currentUser.role === 'player';
  const isFan = currentUser.role === 'fan';

  if (!tournament) return <div className="p-4 text-muted-foreground">Torneio não encontrado.</div>;

  const allPlayers: Player[] = teams.flatMap(t => t.players);
  const topScorers = [...allPlayers]
    .filter(p => p.stats)
    .sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0))
    .slice(0, 5);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'matches', label: 'Jogos' },
    { key: 'standings', label: 'Classificação' },
    { key: 'stats', label: 'Estatísticas' },
    { key: 'media', label: 'Mídias' },
  ];

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center pr-4">
        
        {/* 1. ACESSO DE ADMINISTRADOR: Edição Geral */}
        {isAdmin && (
          <div className="bg-red-100 p-2 text-red-700 text-xs font-bold text-center">
            Modo Administrador: Controle total da aplicação ativado.
          </div>
        )}
        
        <PageHeader title={tournament.name} subtitle={`${tournament.season} · ${tournament.type === 'cup' ? 'Copa' : 'Liga'}`} showBack />
        
        {/* 2. ACESSO DE MODERADOR/ADMIN: Gestão de Jogos e Mídia */}
        {activeTab === 'matches' && isModerator && (
          <Button className="w-full mb-4">Cadastrar Resultado de Jogo</Button>
        )}

        {/* 3. ACESSO DE JOGADOR: Ver destaque nas estatísticas */}
        {activeTab === 'stats' && (
          <div>
            {isPlayer && (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-sm">
                Olá, <strong>{currentUser.name}</strong>! Confira seu desempenho nesta copa.
              </div>
            )}
            {/* ... renderização da artilharia ... */}
          </div>
        )}

        {/* 4. ACESSO DE TORCEDOR: Apenas visualização */}
        {activeTab === 'media' && (
          <div className="text-center">
            {!isModerator && <p>Galeria de fotos oficial da temporada.</p>}
            {isModerator && <Button>Fazer Upload de Nova Foto</Button>}
          </div>
        )}

        <div className="m-4 p-2 bg-yellow-500 text-black font-bold rounded shadow-lg">
          DEBUG: Usuário [{currentUser.name}] | Nível de Acesso: [{currentUser.role}]
        </div>

        {/* BOTÃO GLOBAL DE EDIÇÃO: Só aparece para Admin/Moderador */}
        {canEdit && (
          <Button variant="outline" size="sm" className="gap-2">
            <Edit2 className="w-4 h-4" /> Editar Torneio
          </Button>
        )}
      </div>

      {tournament.podium && (
        <div className="px-4 pt-2">
          <PodiumCard podium={tournament.podium} />
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-1 bg-secondary/50 rounded-lg p-1 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'matches' && (
          <div className="space-y-2">
            {/* BOTÃO DE ADICIONAR JOGO: Restrito */}
            {canEdit && (
              <Button className="w-full mb-4 gap-2" variant="secondary">
                <Plus className="w-4 h-4" /> Novo Jogo
              </Button>
            )}
            
            {tournament.matches.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum jogo cadastrado.</p>
            ) : (
              tournament.matches.map(m => (
                <div key={m.id} className="relative group">
                   <MatchCard match={m} />
                   {/* Botão de edição rápida no card do jogo */}
                   {canEdit && (
                     <button className="absolute top-2 right-2 p-1 bg-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                       <Edit2 className="w-3 h-3" />
                     </button>
                   )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'standings' && (
          tournament.standings.length > 0 ? (
            <StandingsTable standings={tournament.standings} />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Sem classificação disponível.</p>
          )
        )}

        {activeTab === 'stats' && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-muted-foreground">Artilharia</h3>
            <div className="space-y-2">
              {topScorers.map((player, i) => {
                const team = teams.find(t => t.id === player.teamId);
                return (
                  <div key={player.id} className="glass-card rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-champion-gold text-background' :
                        i === 1 ? 'bg-champion-silver text-background' :
                        i === 2 ? 'bg-champion-bronze text-background' :
                        'bg-secondary text-secondary-foreground'
                      }`}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{player.name}</p>
                        <p className="text-[10px] text-muted-foreground">{team?.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div>
                        <p className="text-sm font-bold text-primary">{player.stats?.goals}</p>
                        <p className="text-[10px] text-muted-foreground">Gols</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold">{player.stats?.assists}</p>
                        <p className="text-[10px] text-muted-foreground">Ass.</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="text-center py-8">
            {/* BOTÃO DE ADICIONAR MÍDIA: Restrito conforme seu prompt */}
            {canEdit ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Nenhuma mídia cadastrada.</p>
                <Button variant="outline" className="gap-2">
                   <Plus className="w-4 h-4" /> Upload de Foto/Vídeo
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Galeria de mídias vazia.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentDetail;
