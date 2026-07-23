/**
 * SRC/PAGES/DEBUG.TSX
 * ===============================
 * PROPÓSITO: Página de debug para desenvolvimento
 * - Exibe todos os dados salvos no localStorage
 * - Mostra usuários, times e jogadores cadastrados
 * - Facilita visualização rápida do estado da aplicação
 * MOTIVO: Página útil para desenvolvimento e testes,
 * permitindo devs inspecionarem dados em tempo real
 */
import { getAllData } from '@/data/state';
import PageHeader from '@/components/PageHeader';

const Debug = () => {
  const data = getAllData();

  return (
    <div className="pb-20">
      <PageHeader title="Debug" subtitle="Dados salvos em localStorage" />
      
      <div className="px-4 pt-4 space-y-6">
        {/* Usuários */}
        <div className="glass-card rounded-lg p-4 border border-border">
          <h2 className="text-lg font-bold mb-3">👤 Usuários ({data.users.length})</h2>
          {data.users.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum usuário cadastrado</p>
          ) : (
            <div className="space-y-2">
              {data.users.map((user) => (
                <div key={user.id} className="bg-background/50 p-2 rounded text-sm">
                  <p><strong>{user.name}</strong> ({user.role})</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Times */}
        <div className="glass-card rounded-lg p-4 border border-border">
          <h2 className="text-lg font-bold mb-3">⚽ Times ({data.teams.length})</h2>
          {data.teams.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum time cadastrado</p>
          ) : (
            <div className="space-y-2">
              {data.teams.map((team) => (
                <div key={team.id} className="bg-background/50 p-2 rounded text-sm">
                  <p><strong>{team.name}</strong> ({team.shortName})</p>
                  <p className="text-xs text-muted-foreground">{team.foundationYear}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Jogadores */}
        <div className="glass-card rounded-lg p-4 border border-border">
          <h2 className="text-lg font-bold mb-3">🏃 Jogadores ({data.players.length})</h2>
          {data.players.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum jogador cadastrado</p>
          ) : (
            <div className="space-y-2">
              {data.players.map((player) => (
                <div key={player.id} className="bg-background/50 p-2 rounded text-sm">
                  <p><strong>#{player.number} - {player.name}</strong></p>
                  <p className="text-xs text-muted-foreground">{player.position} • Time ID: {player.teamId}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Torneios */}
        <div className="glass-card rounded-lg p-4 border border-border">
          <h2 className="text-lg font-bold mb-3">🏆 Torneios ({data.tournaments.length})</h2>
          {data.tournaments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum torneio cadastrado</p>
          ) : (
            <div className="space-y-2">
              {data.tournaments.map((tournament) => (
                <div key={tournament.id} className="bg-background/50 p-2 rounded text-sm">
                  <p><strong>{tournament.name}</strong> ({tournament.season})</p>
                  <p className="text-xs text-muted-foreground">{tournament.type} • {tournament.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* JSON */}
        <div className="glass-card rounded-lg p-4 border border-border">
          <h2 className="text-lg font-bold mb-3">📋 JSON Bruto</h2>
          <pre className="bg-background/50 p-3 rounded text-xs overflow-auto max-h-64">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Debug;
