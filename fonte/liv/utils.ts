/**
 * SRC/LIB/UTILS.TS
 * ===============================
 * PROPÓSITO: Funções utilitárias gerais da aplicação
 * - Função 'cn': merge de classes Tailwind sem conflitos
 * - Combina clsx e tailwind-merge para classNames seguros
 * MOTIVO: Arquivo utilitário reutilizável em toda aplicação,
 * oferecendo funções helper comuns de uso geral
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
