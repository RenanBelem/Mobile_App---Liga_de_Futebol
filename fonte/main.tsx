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
import { syncJsonDbFromPythonApi } from "@/servicos/pythonApiSync";

const startApp = async () => {
	try {
		await syncJsonDbFromPythonApi();
	} catch (error) {
		console.warn("Falha ao sincronizar dados iniciais da API Python. Seguindo com dados locais.", error);
	}

	createRoot(document.getElementById("root")!).render(<App />);
};

void startApp();
