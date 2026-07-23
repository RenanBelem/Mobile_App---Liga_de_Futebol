/**
 * SRC/ganchosS/USE-MOBILE.TSX
 * ===============================
 * PROPÓSITO: Hook para detectar se dispositivo é mobile
 * - Usa media queries para determinar se tela é menor que 768px
 * - Retorna boolean que atualiza em real-time
 * - Ütil para layouts responsivos e componentes condicionais
 * MOTIVO: Hook essencial para app mobile-first, permitindo
 * renderização condicional e estilos baseados em tamanho de tela
 */
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
