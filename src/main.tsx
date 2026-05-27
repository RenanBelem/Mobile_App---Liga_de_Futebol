/**
 * SRC/MAIN.TSX
 * ===============================
 * PROPÓSITO: Ponto de entrada da aplicação React
 * - Renderiza o componente App
 * - Inicializa o DOM React no elemento #root
 * - Importa estilos globais
 * MOTIVO: Arquivo essencial que bootstrap a aplicação React,
 * criando a interface do usuário no DOM
 */
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
