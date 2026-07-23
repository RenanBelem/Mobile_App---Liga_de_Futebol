/**
 * VITEST.CONFIG.TS
 * ===============================
 * PROPÓSITO: Configuração do Vitest (framework de testes)
 * - Ambiente de testes em JSDOM
 * - Globals habilitados para functions de teste (describe, it, expect)
 * - Setup files para inicialização de testes
 * - Alias @ para importações
 * MOTIVO: Vitest executa testes unitários e de integração da aplicação,
 * garantindo qualidade e confiabilidade do código
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./fonte/teste/setup.ts"],
    include: ["fonte/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./fonte") },
  },
});
