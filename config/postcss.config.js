/**
 * POSTCSS.CONFIG.JS
 * ===============================
 * PROPÓSITO: Configuração do PostCSS
 * - Integra Tailwind CSS
 * - Autoprefixer adiciona prefixos CSS para compatibilidade com navegadores
 * MOTIVO: PostCSS processa CSS de forma programática, transformando
 * e otimizando estilos antes da entrega ao navegador
 */
export default {
  plugins: {
    tailwindcss: { config: "./config/tailwind.config.ts" },
    autoprefixer: {},
  },
};
