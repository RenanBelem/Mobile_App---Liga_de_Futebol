/**
 * VITE.CONFIG.TS
 * ===============================
 * PROPÓSITO: Configuração do Vite
 * - Servidor de desenvolvimento na porta 8080
 * - Build otimizado com React SWC
 * - Aliases para importações (@ -> fonte/)
 * - Component Tagging para desenvolvimento
 * MOTIVO: Vite é o bundler e servidor de desenvolvimento da aplicação,
 * essencial para desenvolvimento rápido, HMR (Hot Module Replacement) e builds eficientes
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  publicDir: "publico",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./fonte"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
