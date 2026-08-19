/**
 * SRC/APP.TSX
 * ===============================
 * PROPÓSITO: Componente raiz da aplicação
 * - Configura roteamento com React Router
 * - Fornece providers globais (QueryClient, Toaster, Tooltip)
 * - Define estrutura de layout principal com BottomNav
 * - Gerencia todas as rotas da aplicação (home, times, torneios, etc)
 * MOTIVO: App é o componente central que orquestra toda a arquitetura
 * e estrutura da aplicação, conectando providers e rotas
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/componentes/ui/sonner";
import { Toaster } from "@/componentes/ui/toaster";
import { TooltipProvider } from "@/componentes/ui/tooltip";
import BottomNav from "@/componentes/BottomNav";
import { jsonRouteRepository } from "@/servicos/jsonRouteRepository";
import { startPythonApiSyncPolling } from "@/servicos/pythonApiSync";
import Login from "./paginas/Login";
import Index from "./paginas/Index";
import Teams from "./paginas/Teams";
import TeamDetail from "./paginas/TeamDetail";
import Tournaments from "./paginas/Tournaments";
import TournamentDetail from "./paginas/TournamentDetail";
import More from "./paginas/More";
import Debug from "./paginas/Debug";
import NotFound from "./paginas/NotFound";

const queryClient = new QueryClient();
const AUTH_STORAGE_KEY = "lfa_authenticated_user";

const App = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(() =>
    localStorage.getItem(AUTH_STORAGE_KEY),
  );
  const lastDbVersionRef = useRef(jsonRouteRepository.getVersion());

  useEffect(() => {
    const unsubscribe = jsonRouteRepository.subscribe(() => {
      const nextVersion = jsonRouteRepository.getVersion();
      if (nextVersion === lastDbVersionRef.current) {
        return;
      }

      lastDbVersionRef.current = nextVersion;

      // Transitional refresh: keeps route caches aligned with JSON updates
      // while the data layer is migrated to a Supabase-style client.
      window.location.reload();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const stopPolling = startPythonApiSyncPolling(3000);
    return stopPolling;
  }, []);

  const handleLoginSuccess = (login: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, login);
    setAuthenticatedUser(login);
  };

  if (!authenticatedUser) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="max-w-lg mx-auto min-h-screen relative bg-background">
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

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
