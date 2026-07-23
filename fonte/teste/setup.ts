/**
 * SRC/TEST/SETUP.TS
 * ===============================
 * PROPÓSITO: Setup/configuração de testes do Vitest
 * - Importa tipos do Testing Library (jest-dom)
 * - Fornece mock para window.matchMedia (media queries)
 * - Prepara ambiente para testes rodar com DOM simulado
 * MOTIVO: Arquivo de configuração essencial para suite de testes,
 * oferecendo polyfills e setup necessário para JSDOM
 */
import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
