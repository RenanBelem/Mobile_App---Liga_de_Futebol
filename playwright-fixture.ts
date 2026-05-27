/**
 * PLAYWRIGHT-FIXTURE.TS
 * ===============================
 * PROPÓSITO: Fixtures para testes Playwright
 * - Fornece setup/teardown de testes E2E
 * - Re-exporta configurações base para reutilização
 * - Permite criar fixtures customizadas se necessário
 * MOTIVO: Fixtures são essenciais para organizar testes repetitivos,
 * preparar ambiente de teste e manter testes limpos e legíveis
 */
// Re-export the base fixture from the package
// Override or extend test/expect here if needed
export { test, expect } from "lovable-agent-playwright-config/fixture";
