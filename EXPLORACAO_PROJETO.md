# 🔍 Exploração do Projeto - Liga Antifascista de Futebol

## 📋 Sumário Executivo

Este é um **Progressive Web App (PWA)** desenvolvido em **React + TypeScript** para gerenciar e documentar uma liga de futebol antifascista. A aplicação é otimizada para mobile e permite:

- Visualizar times, jogadores e torneios
- Consultar estatísticas, resultados e pódios
- Gerenciar mídias (fotos e vídeos)
- Controlar acesso baseado em papéis (RBAC)

---

## 🎯 1. PROPÓSITO GERAL DA APLICAÇÃO

### Visão
Preservar a memória histórica e facilitar a gestão de uma liga de futebol antifascista, funcionando como um repositório centralizado de dados de times, jogadores, torneios e mídias.

### Objetivo Primário
Funcionar como um **aplicativo mobile-first** que permite:
- Consulta de informações sobre times e jogadores (25 times ativos)
- Acompanhamento de torneios e tabelas de posições
- Visualização de estatísticas (artilharia, assistências, podium)
- Upload e gerenciamento de mídias

### Stack Tecnológico
| Camada | Tecnologia |
|--------|-----------|
| **Frontend Framework** | React 18.3 + TypeScript |
| **Build Tool** | Vite 5.4 (HMR em :8080) |
| **Styling** | Tailwind CSS 3.4 + Shadcn/UI |
| **UI Components** | Radix UI (30+ componentes) |
| **Roteamento** | React Router 6.30 |
| **State Management** | TanStack React Query 5.83 + React Hook Form |
| **Animações** | Framer Motion 12.38 |
| **Validação** | Zod 3.25 |
| **Ícones** | Lucide React 0.462 |
| **Notificações** | Sonner 1.7 + Toast |
| **Testing** | Vitest 3.2 + Playwright 1.57 |
| **Package Manager** | Bun |

---

## 🏗️ 2. ESTRUTURA DE COMPONENTES PRINCIPAIS

### 📄 Páginas (`src/pages/`)

| Página | Arquivo | Funcionalidade |
|--------|---------|---|
| **Home** | `Index.tsx` | Visão geral da temporada, próximos jogos, resultados recentes |
| **Times** | `Teams.tsx` | Listagem de todos os 25 times da liga |
| **Detalhe Time** | `TeamDetail.tsx` | Perfil detalhado, elenco de jogadores, estatísticas |
| **Torneios** | `Tournaments.tsx` | Lista de campeonatos (Ligas e Copas) |
| **Detalhe Torneio** | `TournamentDetail.tsx` | Tabela, resultados, pódio, estatísticas (com RBAC) |
| **Mídias** | `Media.tsx` | Galeria de fotos e vídeos da temporada |
| **Mais** | `More.tsx` | Menu adicional (Ajuda, Sobre, Configurações) |
| **Debug** | `Debug.tsx` | Página de desenvolvimento/debugging |
| **Não Encontrado** | `NotFound.tsx` | Página 404 |
| **Admin** | `admin/CreateTeam.tsx` | [Em desenvolvimento] Formulário CRUD para times |

### 🧩 Componentes Reutilizáveis (`src/components/`)

#### Core Components
| Componente | Propósito |
|-----------|----------|
| `BottomNav.tsx` | Navegação inferior fixa (5 abas: Home, Torneios, Times, Mídias, Mais) |
| `PageHeader.tsx` | Cabeçalho padrão com título e breadcrumbs |
| `MatchCard.tsx` | Card compacto exibindo um jogo (times, placar, data, status) |
| `PodiumCard.tsx` | Card do pódio exibindo 1º, 2º, 3º colocados |
| `StandingsTable.tsx` | Tabela de classificação (Pos, Time, PJ, PG, PE, PP, Pts) |
| `NavLink.tsx` | Link de navegação estilizado |
| `CreatePlayerForm.tsx` | [Em desenvolvimento] Formulário de cadastro de jogador |
| `CreateTeamForm.tsx` | [Em desenvolvimento] Formulário de cadastro de time |
| `CreateUserForm.tsx` | [Em desenvolvimento] Formulário de cadastro de usuário |

#### UI Components (`src/components/ui/`)
Componentes Shadcn/UI baseados em Radix UI (30+ componentes):
- Layouts: `accordion`, `sidebar`, `card`, `sheet`, `drawer`
- Inputs: `input`, `button`, `checkbox`, `radio-group`, `select`, `textarea`
- Dialogs: `dialog`, `alert-dialog`, `popover`, `context-menu`, `dropdown-menu`
- Display: `avatar`, `badge`, `table`, `carousel`, `chart`, `progress`
- Navigation: `breadcrumb`, `navigation-menu`, `pagination`, `tabs`
- Feedback: `alert`, `toast`, `hover-card`, `tooltip`

### 🌐 Roteamento (App.tsx)

```
/                      → Index (Home)
/teams                 → Teams (Lista)
/teams/:id             → TeamDetail (Detalhe)
/tournaments           → Tournaments (Lista)
/tournaments/:id       → TournamentDetail (Detalhe)
/media                 → Media (Galeria)
/more                  → More (Menu)
/debug                 → Debug (Dev)
*                      → NotFound (404)
```

---

## 📊 3. ORGANIZAÇÃO DE DADOS E TIPOS

### 📁 Estrutura de Dados (`src/data/`)

| Arquivo | Conteúdo | Linhas |
|---------|----------|--------|
| `index.ts` | (vazio - reservado para exports) | 0 |
| `mock.ts` | 25 times, 10 jogadores, 5+ partidas, campeonatos mockados | ~200+ |
| `state.ts` | [Arquivo presente] |  |
| `teams.ts` | [Arquivo presente] |  |
| `players.ts` | [Arquivo presente] |  |
| `seasons/` | [Pasta com dados de temporadas] |  |
| `json-structure/` | [Pasta com estruturas JSON de referência] |  |

### 🔤 Tipos TypeScript (`src/types/league.ts`)

#### 1. **Usuários e Acessos**
```typescript
type UserRole = 'admin' | 'moderator' | 'player' | 'fan'

interface User {
  id: string                  // Reflete auth.users.id do Supabase
  name: string
  email: string
  role: UserRole              // Controla acesso
  avatarUrl?: string
  createdAt: string
}
```

#### 2. **Entidades Principais (Normalizadas)**
```typescript
interface Team {
  id: string
  name: string
  shortName?: string          // Max 4 chars (ex: PALM)
  logoUrl?: string
  foundationYear?: string
  colors?: string             // Cor para UI (#22c55e)
}

interface Player {
  id: string
  teamId: string              // Chave estrangeira
  userId?: string             // Vincula jogador a usuário do app
  name: string
  number?: number
  position?: string           // Ex: "Atacante", "Goleiro"
  photoUrl?: string
}
```

#### 3. **Competições**
```typescript
interface League {
  id: string
  name: string
  season: string
  logoUrl?: string
}

interface Tournament {
  id: string
  leagueId: string            // Chave estrangeira
  name: string
  type: 'league' | 'cup'
  season: string
  status: 'draft' | 'ongoing' | 'finished'
}

interface Match {
  id: string
  tournamentId: string
  homeTeamId: string          // Chave estrangeira
  awayTeamId: string          // Chave estrangeira
  homeScore?: number
  awayScore?: number
  date: string
  round?: string
  status: 'scheduled' | 'live' | 'finished'
}
```

#### 4. **Eventos e Estatísticas (Modelo Relacional)**
```typescript
type EventType = 'goal' | 'assist' | 'yellow_card' | 'red_card'

interface MatchEvent {
  id: string
  matchId: string             // Chave estrangeira
  playerId: string            // Chave estrangeira
  type: EventType
  minute?: number
}

interface Podium {
  id: string
  tournamentId: string
  firstPlaceId: string        // ID do time campeão
  secondPlaceId: string
  thirdPlaceId: string
}
```

#### 5. **Mídia e Auditoria**
```typescript
interface MediaItem {
  id: string
  tournamentId?: string
  type: 'photo' | 'video'
  url: string
  caption?: string
  date: string
}

interface AuditLog {
  id: string
  userId: string              // Chave estrangeira
  action: 'create' | 'update' | 'delete'
  entity: 'team' | 'player' | 'match' | 'tournament'
  entityId: string
  description: string
  timestamp: string
}
```

### 📊 Dados Mockados Atualmente

**25 Times** (com cores e nomes únicos):
- CF Estrela Vermelha, Guairacá Futebol Ancestral, Deportivo Oriental, Sankara, Primavera...

**10 Jogadores** (amostra com posições e times):
- Carlos Silva (Atacante, #10), Bruno Santos (Goleiro, #1), etc.

**5+ Partidas** (com resultados e status):
- Rodada 1-2 com resultados finalizados
- Rodadas futuras em status "scheduled"

---

## ⚙️ 4. CONFIGURAÇÕES DO PROJETO

### 🔧 Vite Configuration (`vite.config.ts`)

```typescript
server:
  host: '::'              // IPv6
  port: 8080
  hmr:
    overlay: false        // Sem overlay de erro HMR

plugins:
  - react() com @vitejs/plugin-react-swc
  - componentTagger()     // Lovable tagger (dev only)

resolve:
  alias: '@' → './src/'   // Importações com @
  dedupe: react, react-dom
```

### 🎨 Tailwind Configuration (`tailwind.config.ts`)

```typescript
darkMode: class          // Dark mode com classe CSS
content: src/**/*.tsx    // Scan de componentes

theme:
  fontFamily:
    display: Outfit      // Títulos
    body: Space Grotesk  // Corpo
  
  extend.colors:
    champion:
      gold, silver, bronze  // Cores do pódio
    + Sistema de cores hsl (CSS variables)

prefix: ''               // Sem prefixo
```

### 📝 TypeScript Configuration (`tsconfig.json`)

```typescript
compilerOptions:
  allowJs: true
  noImplicitAny: false
  noUnusedLocals: false
  noUnusedParameters: false
  skipLibCheck: true
  strictNullChecks: false  // Flexível para mockups
  
paths:
  '@/*': './src/*'       // Alias para imports
```

### 📦 Configurações Adicionais

| Arquivo | Propósito |
|---------|----------|
| `postcss.config.js` | Tailwind CSS + Autoprefixer |
| `components.json` | Configuração do Shadcn/UI |
| `playwright.config.ts` | E2E testing com Playwright |
| `playwright-fixture.ts` | Fixtures para testes |
| `vitest.config.ts` | Unit testing com Vitest |
| `eslint.config.js` | Linting com ESLint 9.32 |

---

## 🔐 5. SISTEMA DE CONTROLE DE ACESSO (RBAC)

**Quatro Níveis de Permissão:**

| Role | Acesso |
|------|--------|
| **Admin** | Acesso irrestrito + auditoria completa |
| **Moderator** | Gerenciar jogos, resultados, mídias |
| **Player** | Visualização com destaque em suas próprias estatísticas |
| **Fan** | Read-only (visualização apenas) |

---

## 📋 6. CHECKLIST DE DESENVOLVIMENTO

| Status | Funcionalidade |
|--------|---|
| ✅ | Configuração do Ambiente |
| ✅ | Arquitetura de Dados (Types) |
| ✅ | Navegação e Rotas |
| ✅ | Pódio e Histórico |
| ✅ | Estatísticas (Artilharia, Assistências) |
| ✅ | Sistema de Roles (RBAC) |
| ❌ | Módulo Admin (CRUD via interface) |
| ✅ | Interface AuditLog definida |
| ❌ | Persistência de Auditoria |
| ❌ | Persistência de Dados Real (Supabase/PostgreSQL) |
| ❌ | Upload de Mídia Real |
| ❌ | Modo Offline (PWA) |

---

## 📂 7. TIPOS DE ARQUIVOS POR SEÇÃO

### **src/pages/** - Páginas Completas
- Componentes de página toda
- Lógica específica de rota
- Integração com estado global

### **src/components/** - Componentes Reutilizáveis
- Componentes funcionais (`.tsx`)
- Componentes UI do Shadcn em pasta `ui/`
- Componentes compostos (MatchCard, PodiumCard, etc.)

### **src/data/** - Dados e Mock
- Tipagens e dados estáticos
- Mockups de BD (sem persistência real)
- Simulação de usuário autenticado

### **src/types/** - Definições TypeScript
- Interfaces de domínio
- Tipos de usuário e acesso
- Schemas de dados normalizados

### **src/hooks/** - Hooks Customizados
- `use-mobile.tsx`: Detectar viewport mobile
- `use-toast.ts`: Gerenciar notificações

### **src/lib/** - Utilitários
- `utils.ts`: Funções auxiliares (classNames, etc.)

### **root/** - Configurações
- `vite.config.ts`: Build e server
- `tailwind.config.ts`: Estilos globais
- `tsconfig.json`: Compilação TypeScript
- `package.json`: Dependências e scripts
- `eslint.config.js`: Linting
- `index.html`: Template HTML

---

## 🚀 8. SCRIPTS DISPONÍVEIS

```bash
npm run dev              # Inicia servidor dev (Vite)
npm run build           # Build para produção
npm run build:dev       # Build modo desenvolvimento
npm run lint            # ESLint check
npm run preview         # Preview do build
npm run test            # Vitest (run)
npm run test:watch      # Vitest (watch mode)
```

---

## 📊 9. RESUMO DE DEPENDÊNCIAS

### Principais
- `react@18.3.1` + `react-dom@18.3.1`
- `react-router-dom@6.30.1` (Roteamento)
- `@tanstack/react-query@5.83.0` (State Management)
- `react-hook-form@7.72.0` (Formulários)
- `tailwindcss@3.4.17` (Styling)
- `zod@3.25.76` (Validação)
- `framer-motion@12.38.0` (Animações)

### UI/Components (Radix)
- 30+ packages `@radix-ui/*`
- `shadcn/ui` (wrapper dos componentes Radix)

### Dev Dependencies
- `vitest@3.2.4` (Testing)
- `@playwright/test@1.57.0` (E2E)
- `eslint@9.32.0` (Linting)
- `typescript@5.8.3` (TS Compiler)
- `vite@5.4.19` (Build)

---

## 🎯 10. PRÓXIMAS ETAPAS RECOMENDADAS

1. **Implementar persistência real** (Supabase/PostgreSQL)
2. **Completar módulo Admin** (Formulários CRUD)
3. **Sistema de upload de mídia** (Cloudinary/S3)
4. **Modo Offline** (Service Workers/PWA)
5. **Implementar auditoria** (Registrar todas as alterações)

---

**Documento gerado em:** 27 de maio de 2026  
**Projeto:** Liga Antifascista de Futebol - Mobile App
