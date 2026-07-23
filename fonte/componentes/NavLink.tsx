/**
 * SRC/componentes/NAVLINK.TSX
 * ===============================
 * PROPÓSITO: Wrapper customizado do React Router NavLink
 * - Fornece compatibilidade com estilos activeClassName e pendingClassName
 * - Integra com utilitários CSS (cn) para melhor gerenciamento de classes
 * MOTIVO: Componente reutilizável que padroniza links de navegação,
 * oferecendo estilos consistentes para links ativos/pendentes
 */
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/liv/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
