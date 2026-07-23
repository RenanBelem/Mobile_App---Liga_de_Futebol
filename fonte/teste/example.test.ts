/**
 * SRC/TEST/EXAMPLE.TEST.TS
 * ===============================
 * PROPÓSITO: Arquivo de teste de exemplo
 * - Demonstra padrão básico de teste com Vitest
 * - Utiliza jest-like API com describe/it/expect
 * - Serve como template para novos testes
 * MOTIVO: Exemplo de referência para estrutura de testes,
 * facilitando escrita de novos testes por outros desenvolvedores
 */
import { describe, it, expect } from "vitest";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});
