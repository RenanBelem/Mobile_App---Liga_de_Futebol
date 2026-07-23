/**
 * SRC/paginas/MORE.TSX
 * ===============================
 * PROPÓSITO: Página de administração e configurações
 * - Oferece acessos a formulários CRUD (criar usuários, times, jogadores)
 * - Menu de configurações e opções adicionais
 * - Restrita a usuários com permissão (admin/moderador)
 * MOTIVO: Página central para gerão de dados da aplicação,
 * permitindo admins gerenciar times, usuários e jogadores
 */
import { Settings, UserPlus, ShieldPlus, Trophy, Info, Users, LogOut } from 'lucide-react';
import PageHeader from '@/componentes/PageHeader';
import CreateUserForm from '@/componentes/CreateUserForm';
import CreateTeamForm from '@/componentes/CreateTeamForm';
import CreatePlayerForm from '@/componentes/CreatePlayerForm';
import CreateTournamentForm from '@/componentes/CreateTournamentForm';
import { Dialog, DialogContent, DialogTrigger } from '@/componentes/ui/dialog';
import { useToast } from '@/ganchoss/use-toast';

const More = () => {
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('lfa_authenticated_user');
    toast({
      title: "Desconectado",
      description: "Você foi desconectado da aplicação.",
    });
    window.location.href = '/';
  };
  return (
    <div className="pb-20">
      <PageHeader title="Mais" subtitle="Administração e configurações" />
      <div className="px-4 pt-4 space-y-2">

        {/* Cadastrar Usuário */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full glass-card rounded-lg p-4 flex items-center gap-4 text-left hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-[rgb(0,0,0)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Cadastrar Usuário</p>
                <p className="text-xs text-muted-foreground">Adicionar novo membro</p>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-background border-border p-0 overflow-hidden">
            <CreateUserForm />
          </DialogContent>
        </Dialog>

        {/* Cadastrar Time */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full glass-card rounded-lg p-4 flex items-center gap-4 text-left hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <ShieldPlus className="w-5 h-5 text-[rgb(0,0,0)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Cadastrar Time</p>
                <p className="text-xs text-muted-foreground">Criar novo time</p>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-background border-border p-0 overflow-hidden">
            <CreateTeamForm />
          </DialogContent>
        </Dialog>

        {/* Cadastrar Jogador */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full glass-card rounded-lg p-4 flex items-center gap-4 text-left hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Users className="w-5 h-5 text-[rgb(0,0,0)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Cadastrar Jogador</p>
                <p className="text-xs text-muted-foreground">Adicionar novo jogador</p>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-background border-border p-0 overflow-hidden">
            <CreatePlayerForm />
          </DialogContent>
        </Dialog>

        {/* Cadastrar Torneio */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full glass-card rounded-lg p-4 flex items-center gap-4 text-left hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[rgb(0,0,0)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Cadastrar Torneio</p>
                <p className="text-xs text-muted-foreground">Criar novo torneio</p>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-background border-border p-0 overflow-hidden">
            <CreateTournamentForm />
          </DialogContent>
        </Dialog>

        {/* Configurações — em breve */}
        <button
          disabled
          className="w-full glass-card rounded-lg p-4 flex items-center gap-4 text-left opacity-50 cursor-not-allowed"
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Settings className="w-5 h-5 text-[rgb(0,0,0)]" />
          </div>
          <div>
            <p className="text-sm font-semibold">Configurações</p>
            <p className="text-xs text-muted-foreground">Em breve</p>
          </div>
        </button>

        {/* Sobre */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full glass-card rounded-lg p-4 flex items-center gap-4 text-left hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Info className="w-5 h-5 text-[rgb(0,0,0)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Sobre</p>
                <p className="text-xs text-muted-foreground">Informações da liga</p>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-background border-border">
            <div className="p-5 space-y-3">
              <h2 className="text-lg font-bold">Liga Antifascista de Futebol</h2>
              <p className="text-sm text-muted-foreground">
                Organização dedicada ao futebol comunitário, antifascista e popular. Reunindo times de Curitiba e Região Metropolitana que acreditam no esporte para além do lazer, como ferramenta de transformação social.
              </p>
              {/* <p className="text-xs text-muted-foreground">Versão 1.0.0</p> */}
            </div>
          </DialogContent>
        </Dialog>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full glass-card rounded-lg p-4 flex items-center gap-4 text-left hover:border-destructive/30 hover:bg-destructive/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-semibold">Sair</p>
            <p className="text-xs text-muted-foreground">Desconectar da aplicação</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default More;
