/**
 * SRC/APP.TSX
 * ===============================
 * PROPÓSITO: Componente raiz da aplicação
 * - Configura roteamento com React Router
 * - Fornece providers globais (QueryClient, Toaster, Tooltip)
 * - Define estrutura de layout principal com BottomNav
 * - Gerencia todas as rotas da aplicação (home, times, torneios, mídias, etc)
 * MOTIVO: App é o componente central que orquestra toda a arquitetura
 * e estrutura da aplicação, conectando providers e rotas
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import Media from "./pages/Media";
import More from "./pages/More";
import Debug from "./pages/Debug";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="max-w-lg mx-auto min-h-screen relative bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/tournaments/:id" element={<TournamentDetail />} />
              <Route path="/media" element={<Media />} />
              <Route path="/more" element={<More />} />
              <Route path="/debug" element={<Debug />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
