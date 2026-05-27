/**
 * PLAYWRIGHT.CONFIG.TS
 * ===============================
 * PROPÓSITO: Configuração do Playwright (testes E2E - End-to-End)
 * - Define testes de interface do usuário
 * - Simula comportamento real do usuário no navegador
 * - Valida fluxos críticos da aplicação
 * MOTIVO: Testes E2E garantem que a aplicação funciona corretamente
 * da perspectiva do usuário final, cobrindo cenários de ponta a ponta
 */
import { createLovableConfig } from "lovable-agent-playwright-config/config";

export default createLovableConfig({
  // Add your custom playwright configuration overrides here
  // Example:
  // timeout: 60000,
  // use: {
  //   baseURL: 'http://localhost:3000',
  // },
});
