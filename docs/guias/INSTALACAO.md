# 🚀 Instalação e Setup Local

**Data:** Maio 2026  
**Status:** Finalizado  
**Versão:** 1.0  
**Para:** Novo desenvolvedor

---

## 🎯 Propósito

Guia passo-a-passo para rodar o projeto LFA na sua máquina local em menos de 15 minutos.

---

## 📋 Pré-requisitos

Certifique-se que você tem instalado:

- ✅ [Node.js 18+](https://nodejs.org) (verificar: `node --version`)
- ✅ [Git](https://git-scm.com) (verificar: `git --version`)
- ✅ Editor de código (VS Code recomendado)
- ✅ Terminal (PowerShell, Git Bash ou similar)

---

## 🚀 Instalação Rápida (5 minutos)

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/[seu-usuario]/Mobile_App---Liga_Antifascista_de_Futebol.git
cd Mobile_App---Liga_Antifascista_de_Futebol
```

### 2️⃣ Instalar Dependências

```bash
npm install
```

> ⏱️ Isso pode levar 2-5 minutos dependendo da conexão

### 3️⃣ Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

### 4️⃣ Abrir no Navegador

A aplicação abrirá automaticamente em:

```
http://localhost:8080
```

Se não abrir, acesse manualmente no seu navegador.

---

## ✅ Verificar Instalação

### Página Inicial
Você deve ver:
- ✅ Tela com dark theme (fundo escuro)
- ✅ Logo da LFA no topo
- ✅ BottomNav com 5 abas na base
- ✅ Card de apresentação

### Navegação Básica

1. **Clique em cada aba:**
   - 🏠 Início
   - 🏆 Torneios
   - ⚽ Times
   - 📸 Mídia
   - ➕ Mais

2. **Teste cadastro (abra Mais):**
   - Clique em "Cadastrar Jogador"
   - Preencha os campos
   - Clique em "Cadastrar"
   - Veja mensagem de sucesso

### Verificar Dados Salvos

Vá para: `http://localhost:8080/debug`

Você deve ver:
- 📊 Visualização de usuários cadastrados
- ⚽ Visualização de times cadastrados
- 🏃 Visualização de jogadores cadastrados

---

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
# Iniciar servidor dev (hot reload)
npm run dev

# Rodar testes unitários
npm run test

# Rodar testes E2E
npm run test:e2e

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Linting

```bash
# Verificar erros de lint
npm run lint

# Corrigir automaticamente
npm run lint:fix
```

---

## 📁 Estrutura de Pastas

Após clonar, sua pasta ficará assim:

```
projeto/
├── src/                      # Código-fonte
│   ├── components/           # Componentes React
│   ├── pages/                # Páginas da aplicação
│   ├── data/                 # Dados mock e state
│   ├── types/                # TypeScript interfaces
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilitários
│   ├── App.tsx               # App raiz
│   └── main.tsx              # Entry point
│
├── public/                   # Arquivos estáticos
│   └── logos/                # Imagens
│
├── docs/                     # 📚 DOCUMENTAÇÃO
│   ├── README.md
│   ├── projeto/
│   ├── decisoes/
│   └── ...
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔧 Configurações Importantes

### Variáveis de Ambiente (Futuro)

Quando integrar backend, crie `.env.local`:

```bash
# Supabase (quando implementar)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

> ⚠️ NUNCA commite `.env.local` no Git!

### VSCode Extensions Recomendadas

Instale para melhor experiência:

- [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

---

## ❓ Problemas Comuns

### Porta 8080 Já em Uso

```bash
# Erro: Error: listen EADDRINUSE: address already in use :::8080

# Solução 1: Mudar porta
npm run dev -- --port 3000

# Solução 2: Matar processo na porta
# Windows PowerShell:
netstat -ano | findstr :8080
taskkill /PID [PID_DO_PROCESSO] /F

# Mac/Linux:
lsof -i :8080
kill -9 [PID]
```

### npm install Falha

```bash
# Limpar cache do npm
npm cache clean --force

# Deletar pasta node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### Tela Branca (Blank Screen)

```bash
# Solução 1: Hard refresh (Ctrl+Shift+R)
# Solução 2: Limpar cache do navegador
# Solução 3: npm run dev novamente
```

### TypeScript Errors

```bash
# Reconstruir TypeScript
npm run build

# Se persistir:
rm -rf dist
npm run build
```

---

## 📚 Próximos Passos

### Depois de Instalar ✅

1. **Explorar o código:**
   - Abra `src/App.tsx`
   - Veja a estrutura de rotas
   - Explore um componente

2. **Entender a documentação:**
   - Leia [docs/README.md](../README.md)
   - Consulte [docs/PLANO_DE_PROJETO.md](../projeto/PLANO_DE_PROJETO.md)

3. **Testar um cadastro:**
   - Vá para `/more` (Mais)
   - Cadastre um jogador
   - Veja dados em `/debug`

4. **Contribuir:**
   - Leia [docs/GUIA_CONTRIBUICAO.md](../GUIA_CONTRIBUICAO.md)
   - Faça sua primeira mudança
   - Faça PR

---

## 🆘 Precisa de Ajuda?

Se tiver problemas:

1. Verifique se Node.js está instalado: `node --version`
2. Verifique se npm está atualizado: `npm --version`
3. Consulte [FAQ.md](./FAQ.md)
4. Abra uma issue no GitHub

---

## 📝 Histórico

| Data | Versão | Mudança |
|------|--------|---------|
| Mai/2026 | 1.0 | Documento criado |

---

**Feliz desenvolvimento! 🚀**
