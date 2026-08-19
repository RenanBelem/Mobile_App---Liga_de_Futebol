/**
 * SRC/VITE-ENV.D.TS
 * ===============================
 * PROPÓSITO: Tipos do ambiente Vite
 * - Fornece tipos para import.meta.env
 * - Permite autocompletar variáveis de ambiente no TypeScript
 * MOTIVO: Arquivo gerado pelo Vite para tipagem correta de variáveis
 * de ambiente em tempo de desenvolvimento
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_USE_PYTHON_API?: string;
	readonly VITE_PYTHON_API_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
