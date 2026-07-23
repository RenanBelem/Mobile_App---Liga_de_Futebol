# 📋 Plano de Projeto - Liga Antifascista de Futebol (LFA)

**Versão:** 1.0.0  
**Data:** Maio 2026  
**Status:** Em Desenvolvimento  
**Objetivo:** Documentação completa do projeto, histórico de desenvolvimento e roadmap futuro

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Frontend, Backend e Banco - Evolução](#frontend-backend-e-banco---evolução)
3. [Histórico de Desenvolvimento](#histórico-de-desenvolvimento)
4. [Pilares de Engenharia de Software](#pilares-de-engenharia-de-software)
5. [Arquitetura da Aplicação](#arquitetura-da-aplicação)
6. [Estrutura de Dados](#estrutura-de-dados)
7. [Componentes da Aplicação](#componentes-da-aplicação)
8. [Estado e Persistência](#estado-e-persistência)
9. [Roadmap de Desenvolvimento](#roadmap-de-desenvolvimento)
10. [Checklist de Implementação](#checklist-de-implementação)

---

## 🎯 Visão Geral

### Propósito
A **Liga Antifascista de Futebol (LFA)** é uma aplicação mobile-first que permite o gerenciamento e visualização de competições de futebol comunitário, antifascista e popular no Brasil.

### Escopo
- ✅ Visualização de times, jogadores e campeonatos
- ✅ Registro de usuários e autenticação
- ✅ Cadastro de jogadores e times
- ✅ Visualização de resultados e estatísticas
- 🔄 (Futuro) Integração com backend Supabase
- 🔄 (Futuro) Upload de mídia
- 🔄 (Futuro) Sistema de pontuação em tempo real

### Stakeholders
- **Usuários Finais:** Torcedores, jogadores, moderadores, administradores
- **Equipe de Desenvolvimento:** 1 desenvolvedor full-stack
- **Organizações:** Coletivos e times de futebol antifascista

### Tecnologia Alvo
- **Frontend:** React 18.3 + TypeScript 5.8 com Vite
- **Styling:** TailwindCSS 3.4 com dark theme
- **Forms:** React Hook Form + Zod
- **Backend:** Supabase (PostgreSQL + Auth)
- **Storage:** Supabase Storage
- **Mobile:** Progressive Web App (PWA)

---

## � Frontend, Backend e Banco de Dados - Evolução Completa

### 📱 FRONTEND

#### Passado (Q1 2026)
```
├── Nenhum framework complexo
├── React básico com hooks
├── localStorage apenas
└── Sem otimizações de performance
```

**Problemas Encontrados:**
- Sem SSR/SSG
- Sem PWA
- Sem offline support
- Performance da app limitada
- Sem integração nativa mobile

---

#### Presente (Q2 2026 - ATUAL)
```
✅ React 18.3 + TypeScript 5.8
✅ Vite 5.4 (dev server rápido)
✅ TailwindCSS 3.4 (styling)
✅ shadcn/ui (componentes Radix)
✅ React Router v6 (SPA routing)
✅ React Hook Form + Zod (forms validadas)
✅ Sonner (toasts)
✅ localStorage (persistência local)
```

**Pontos Fortes:**
- ✅ Desenvolvimento rápido
- ✅ Hot reload automático
- ✅ Dark theme nativo
- ✅ Mobile-first design
- ✅ TypeScript type-safe

**Limitações Atuais:**
- ❌ Sem PWA configurada
- ❌ Sem offline support
- ❌ SPA pura (sem SSR)
- ❌ Sem cache inteligente
- ❌ Sem app desktop/mobile nativo

---

#### Futuro (Q3 2026+)

**Cenário 1: Evolução PWA (RECOMENDADO - GRATUITO)** ⭐
```
├── Workbox para caching
├── Web App Manifest
├── Service Workers
├── Offline-first architecture
├── Install como app no celular
└── Sincronização em background
```
- **Custos:** Gratuito
- **Hosted em:** Vercel, Netlify ou Cloudflare Pages
- **Tempo:** 2-3 semanas
- **Vantagens:** 
  - App "nativa" sem App Store
  - Funciona offline
  - Menor uso de dados
  - Cache inteligente

**Cenário 2: Next.js + Static Export (GRATUITO)**
```
├── Next.js 14 (React framework)
├── SSG (Static Site Generation)
├── ISR (Incremental Static Regeneration)
├── Image optimization automática
├── API routes opcionais
└── Vercel deployment
```
- **Custos:** Gratuito na Vercel
- **Tempo:** 3-4 semanas (migração)
- **Vantagens:**
  - SEO otimizado
  - Builds mais rápidos
  - Imagens otimizadas automático
  - Cache em edge servers

**Cenário 3: Tauri (GRATUITO)** - Desktop App
```
├── Rust backend + React frontend
├── Empacotado como app .exe/.dmg/.deb
├── Sem dependências externas
├── Segurança nativa do SO
└── Sizable: ~70MB por plataforma
```
- **Custos:** Gratuito (open-source)
- **Tempo:** 4-5 semanas
- **Vantagens:**
  - App desktop seguro
  - Funciona offline
  - Acessar filesystem/hardware
  - Distribuição fácil

**Cenário 4: React Native com Expo (GRATUITO)**
```
├── React Native + Expo
├── Uma base de código para iOS/Android
├── Managed Expo (build + hosting)
├── Over-the-air updates
└── Publish na Expo App
```
- **Custos:** Gratuito até 30 updates/mês
- **Tempo:** 6-8 semanas
- **Vantagens:**
  - App iOS/Android nativo
  - Mesmo React code
  - Publicação fácil
  - OTA updates

---

### 🔧 BACKEND

#### Passado (Q1 2026)
```
├── Nenhum backend
├── Dados mockados localmente
├── localStorage apenas
└── Zero persistência real
```

---

#### Presente (Q2 2026 - ATUAL)
```
✅ localStorage (persistência local)
✅ Mock data em TypeScript
✅ Estado em memória
```

**Status:** Nenhum backend real ainda

---

#### Futuro (Q3 2026+)

**OPÇÃO 1: Supabase (RECOMENDADO - GRATUITO COM LIMITES)** ⭐
```
├── PostgreSQL gerenciado
├── Autenticação JWT incluída
├── Storage de arquivos
├── Realtime subscriptions
├── Row Level Security (RLS)
└── API REST/GraphQL automática
```
- **Custos:** 
  - Tier gratuito: 500 MB storage, 2GB bandwidth, 50k requests/mês
  - Tier pago: $25/mês (escalável)
- **Setup:** 
  ```bash
  npm install @supabase/supabase-js
  npm install @supabase/auth-helpers-react
  ```
- **Tempo de Setup:** 1-2 semanas
- **Vantagens:**
  - PostgreSQL profissional
  - Auth out-of-the-box
  - RLS para segurança
  - Free tier generoso

---

**OPÇÃO 2: Pocketbase (GRATUITO - SELF-HOSTED)**
```
├── Backend single-file (executável Go)
├── SQLite + PostgreSQL support
├── Auth integrada
├── Admin UI incluída
├── Realtime com WebSockets
└── Dashboard completo
```
- **Custos:** Gratuito (open-source)
- **Hosting:** 
  - Grátis em Railway.app (com créditos)
  - Grátis em Render.com (com limites)
  - Grátis em seu próprio servidor
- **Setup:**
  ```bash
  # Download do binário (8MB)
  # Execute: ./pocketbase serve
  # Acesse: http://localhost:8090/_/
  ```
- **Tempo:** 1 semana
- **Vantagens:**
  - Controle total
  - Sem taxa mensal
  - Admin UI excelente
  - SQLite + PostgreSQL

---

**OPÇÃO 3: Appwrite (GRATUITO - SELF-HOSTED ou GERENCIADO)**
```
├── Platforma open-source Node.js
├── PostgreSQL + MariaDB + MongoDB
├── Auth integrada (10+ providers)
├── Storage com CDN
├── Real-time + WebSockets
├── Functions (serverless)
└── Dashboard web
```
- **Costos:**
  - Self-hosted: Gratuito
  - Cloud gerenciado: Free tier com créditos
- **Hosting:**
  - Docker (Render, Railway, Heroku alternativas)
  - Coolify.io (orquestrador de containers gratuito)
  - Seu próprio servidor
- **Setup:**
  ```bash
  docker run -d --volume /var/run/docker.sock:/var/run/docker.sock \
    -p 80:80 -p 443:443 appwrite/appwrite:latest
  ```
- **Tempo:** 2 semanas
- **Vantagens:**
  - Controle total
  - Functions serverless
  - Multi-database support

---

**OPÇÃO 4: Firebase (GRATUITO COM LIMITES)**
```
├── Cloud Firestore (NoSQL)
├── Firebase Auth (20+ providers)
├── Storage (5GB)
├── Cloud Functions (serverless)
├── Realtime Database
└── Hosting automático
```
- **Custos:**
  - Free tier: 50k reads/dia, 20k writes/dia, 20k deletes/dia
  - Pago: Pay-as-you-go
- **Tempo:** 3-4 dias
- **Vantagens:**
  - Mais rápido setup
  - NoSQL (flexível)
  - Escalável automaticamente
  - Dashboard completo

---

**RECOMENDAÇÃO:** 
- **Início Rápido:** Firebase (1 semana de desenvolvimento)
- **Produção Melhor:** Supabase (mais controle, PostgreSQL)
- **Máximo Controle:** Pocketbase (self-hosted, sem custos)

---

### 💾 BANCO DE DADOS

#### Passado (Q1 2026)
```
├── TypeScript interfaces
├── localStorage browser
├── Zero persistência remota
└── Perda de dados ao limpar cache
```

---

#### Presente (Q2 2026 - ATUAL)
```
✅ localStorage (JSON serializado)
✅ Estrutura normalizada (3NF)
✅ Chaves: lfa_users, lfa_teams, lfa_players
```

**Schema localStorage:**
```typescript
interface StoredData {
  lfa_users: User[];
  lfa_teams: Team[];
  lfa_players: Player[];
}
```

---

#### Futuro (Q3 2026+)

**OPÇÃO 1: PostgreSQL (RECOMENDADO - SUPABASE)** ⭐
```sql
-- Usuários (autenticação)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  role ENUM('fan', 'player', 'moderator', 'admin'),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Times
CREATE TABLE teams (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(4),
  logo_url TEXT,
  foundation_year INT,
  colors JSONB,
  city VARCHAR(255),
  state VARCHAR(2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Jogadores
CREATE TABLE players (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  team_id BIGINT REFERENCES teams(id),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  shirt_number INT,
  position VARCHAR(50),
  photo_url TEXT,
  height INT,
  weight INT,
  birth_date DATE,
  cpf VARCHAR(14),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários veem seus próprios dados"
  ON players FOR SELECT
  USING (auth.uid() = user_id OR true);
```

**Vantagens:**
- ACID compliance
- JOIN queries poderosas
- RLS para segurança
- Backups automáticos
- Escalável profissionalmente

---

**OPÇÃO 2: SQLite com Sincronização (POCKETBASE/APPWRITE)**
```sql
-- Mesmo schema anterior, mas em SQLite
-- Suporta replicação automática
```

**Vantagens:**
- Sem servidor adicional
- Síncrono automático
- Controle total
- Ideal para self-hosted

---

**OPÇÃO 3: MongoDB/Firebase Firestore (NOSQL)**
```javascript
// Collections
db.users.insertOne({
  _id: ObjectId(),
  email: "user@example.com",
  name: "João",
  role: "player",
  createdAt: new Date()
});

db.teams.insertOne({
  _id: ObjectId(),
  name: "Time A",
  players: [], // array de IDs
  stats: {
    wins: 5,
    losses: 2,
    draws: 1
  }
});
```

**Vantagens:**
- Flexível (sem schema rígido)
- Escalável
- JSON nativo
- Ideal para prototipagem

---

### 📊 Comparação Visual

| Aspecto | localStorage | Firebase | Supabase | Pocketbase |
|---------|-------------|----------|----------|-----------|
| **Custo** | Gratuito | Freemium | Freemium | Gratuito |
| **Dados** | 5-10MB | Firestore | PostgreSQL | SQLite/PG |
| **Offline** | ✅ Nativo | ❌ Precisa Realtime | ❌ Precisa Sync | ✅ Nativo |
| **Setup** | Imediato | 1 dia | 2-3 dias | 1-2 dias |
| **Escalabilidade** | ❌ Limitada | ✅ Automática | ✅ Automática | ⚠️ Manual |
| **Self-hosted** | N/A | ❌ Não | ❌ Não | ✅ Sim |
| **Auth Integrada** | ❌ Não | ✅ Sim | ✅ Sim | ✅ Sim |
| **RLS/Segurança** | ❌ Não | ⚠️ Limitada | ✅ Sim | ✅ Sim |

---

### 🎯 ESTRATÉGIA RECOMENDADA

**Fase 1 (Q2 2026 - ATUAL):** ✅ localStorage
- Desenvolvimento rápido
- MVP funcional
- Dados salvos localmente

**Fase 2 (Q3 2026):** Migração para Backend
- **Melhor opção:** Supabase (PostgreSQL + Auth)
- **Alternativa:** Pocketbase (se quiser self-hosted grátis)
- Tempo: 3-4 semanas
- Migração de dados: 1 semana

**Fase 3 (Q4 2026):** PWA + Offline Support
- Service Workers
- Workbox caching
- Sincronização inteligente
- Tempo: 2 semanas

**Fase 4 (Q1 2027):** App Mobile Nativa
- React Native + Expo
- Distribuição via App Store/Play Store
- Tempo: 6-8 semanas

**Fase 5 (Q2 2027+):** Desktop App
- Tauri (desktop seguro)
- Ou Electron (mais simples)
- Distribuição fácil

---

### 💻 HOSTING RECOMENDADO (GRATUITO)

| Serviço | Frontend | Banco/Backend | Custo | Notas |
|---------|----------|---------------|-------|-------|
| **Vercel** | ✅ | ❌ | Gratuito | Melhor para Next.js |
| **Netlify** | ✅ | ❌ | Gratuito | Bom para static |
| **Railway.app** | ✅ | ✅ | Gratuito (créditos) | Banco + Backend |
| **Render.com** | ✅ | ✅ | Gratuito com limites | PostgreSQL included |
| **Fly.io** | ✅ | ✅ | Gratuito com créditos | Docker-ready |
| **Coolify** | ✅ | ✅ | Gratuito (self-hosted) | PaaS open-source |

---

### 🔀 MIGRAÇÃO DE DADOS: localStorage → Backend

```typescript
// 1. Exportar dados do localStorage
const data = JSON.parse(localStorage.getItem('lfa_data') || '{}');

// 2. Transformar para formato backend
const users = data.users.map(u => ({
  email: u.email,
  name: u.name,
  role: u.role,
  created_at: new Date(u.createdAt)
}));

// 3. Importar em batch no backend
await supabase
  .from('users')
  .insert(users);

// 4. Atualizar cliente para usar API
// Antes: localStorage.getItem('lfa_users')
// Depois: await supabase.from('users').select()
```

---

## �📚 Histórico de Desenvolvimento

### Fase 1: Setup Inicial e Estrutura Base (Semana 1)

#### 1.1 Inicialização do Projeto
```bash
# Criação com Vite + React + TypeScript
npm create vite@latest lfa-app -- --template react-ts
cd lfa-app
npm install
```

**Tecnologias Instaladas:**
- React Router v6 (SPA routing)
- TailwindCSS (styling)
- shadcn/ui (componentes Radix UI)
- React Hook Form + Zod (forms)
- React Query (state management)
- Lucide React (ícones)
- Sonner (toasts)
- Framer Motion (animações)

#### 1.2 Estrutura de Pastas Criada
```
src/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # shadcn/ui components
│   ├── BottomNav.tsx   # Navegação inferior mobile
│   ├── CreateUserForm.tsx
│   ├── CreateTeamForm.tsx
│   ├── CreatePlayerForm.tsx
│   ├── MatchCard.tsx
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── Index.tsx       # Home
│   ├── Teams.tsx       # Listagem de times
│   ├── Tournaments.tsx # Listagem de torneios
│   ├── Media.tsx       # Galeria de mídia
│   ├── More.tsx        # Menu de admin
│   ├── Debug.tsx       # Página de debug
│   └── ...
├── data/               # Dados mock e state
│   ├── mock.ts         # Dados estáticos de teste
│   ├── state.ts        # Gerenciamento de estado com localStorage
│   ├── players.ts
│   ├── teams.ts
│   └── seasons/        # Dados por temporada
├── types/              # TypeScript interfaces
│   └── league.ts       # Tipos da aplicação
├── hooks/              # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                # Utilitários
│   └── utils.ts
├── App.tsx             # Componente raiz
└── main.tsx            # Entry point

public/
├── logos/
│   ├── gerais/        # Logo geral da LFA
│   └── times/         # Logos dos times
├── banners/           # Banners promocionais
└── avatars/           # Fotos de usuários
```

#### 1.3 Configuração Inicial
- ✅ Vite config com React plugin
- ✅ TypeScript strict mode
- ✅ TailwindCSS dark theme
- ✅ Path aliases (@/ para src/)
- ✅ ESLint + Prettier

---

### Fase 2: Design System e Componentes Base (Semana 2)

#### 2.1 Dark Theme Glassmorphism
```css
/* Características visuais */
- Fundo: #0f172a (slate-950)
- Primária: #ef4444 (red-500) - Cor revolucionária
- Secundária: #1e293b (slate-800)
- Cards: Glass effect com backdrop blur
- Borders: Transparentes com cores primárias
```

#### 2.2 Componentes Implementados
- ✅ BottomNav (5 abas: Início, Torneios, Times, Mídias, Mais)
- ✅ PageHeader (cabeçalho padrão)
- ✅ MatchCard (exibição de partidas)
- ✅ PodiumCard (pódio de campeões)
- ✅ StandingsTable (tabela de classificação)

#### 2.3 Problema Resolvido: MatchCard
**Erro:** `Cannot read property 'name' of undefined`
**Causa:** Match tinha `homeTeamId` (string) mas código tentava acessar `match.homeTeam.name` (objeto)
**Solução:** Criada função `getTeamById()` que resolve IDs para objetos

---

### Fase 3: Dados Mock e Estrutura de Banco (Semana 3)

#### 3.1 Schema 3NF Normalizado
```typescript
// Relações estruturadas
League (1) ──→ (n) Tournament
Tournament (1) ──→ (n) Match
Team (1) ──→ (n) Player
Team (1) ──→ (n) Match (como homeTeam)
Team (1) ──→ (n) Match (como awayTeam)
Match (1) ──→ (n) MatchEvent
Player (n) ──→ (1) MatchEvent
```

#### 3.2 Dados Mock Criados
- 25 times autênticos da Liga Antifascista Brasileira
- 10 jogadores de exemplo
- 6 partidas (3 finalizadas, 3 agendadas)
- 3 torneios
- 1 liga geral

#### 3.3 Arquivo mock.ts
```typescript
// Estrutura
export const teams: Team[] = [...] // 25 times
export const players: Player[] = [...] // Normalizados com teamId
export const matches: Match[] = [...] // Usando homeTeamId/awayTeamId
export const tournaments: Tournament[] = [...]
export const league: League = {...}

// Funções Utilitárias
export function getTeamById(teamId: string): Team | undefined
export function getPlayersByTeam(teamId: string): Player[]
export function getMatchesByTournament(tournamentId: string): Match[]
```

---

### Fase 4: Formulários e Validação (Semana 4)

#### 4.1 CreateUserForm.tsx
**Campos:**
- Nome (min 3 chars)
- Email (validação)
- Telefone (opcional)
- Função (admin, moderador, jogador, torcedor)
- Senha (min 6 chars)
- Confirmação de senha

**Validação:** Zod schema com React Hook Form

#### 4.2 CreateTeamForm.tsx
**Campos:**
- Nome (min 3 chars)
- Sigla (max 4 chars)
- Ano de fundação (yyyy format)
- Logo (upload de arquivo)

#### 4.3 CreatePlayerForm.tsx
**Campos:**
- Nome (min 3 chars)
- Número da camisa (1-99)
- Posição (enum 7 opções)
- Time (select com 25 times)
- Altura (150-230 cm)
- Peso (40-150 kg)
- Data de nascimento (validação de idade 13-80)
- CPF (opcional)

---

### Fase 5: Persistência em localStorage (Semana 4.5)

#### 5.1 Arquivo state.ts Criado
```typescript
// Gerenciamento de estado com localStorage
export function addUser(user: Omit<User, 'id' | 'createdAt'>): User
export function addPlayer(player: Omit<Player, 'id'>): Player
export function addTeam(team: Omit<Team, 'id'>): Team
export function getUsers(): User[]
export function getPlayers(): Player[]
export function getTeams(): Team[]
export function getAllData(): { users, players, teams }
export function exportToJSON(): string
export function clearAll(): void
```

#### 5.2 Problema Resolvido: Dados não eram Salvos
**Erro:** console.log sem persistência
**Solução:** Integração com localStorage e funções de serialização

#### 5.3 Página Debug Criada
```
/debug - Visualiza todos os dados salvos em localStorage
- Contador de usuários, times, jogadores
- Listagem formatada
- JSON bruto
```

---

## 🏗️ Pilares de Engenharia de Software

### 1. Arquitetura em Camadas

```
┌─────────────────────────────────┐
│     Presentation Layer          │ (React Components, Pages)
├─────────────────────────────────┤
│     Business Logic Layer        │ (Hooks, Utils, State)
├─────────────────────────────────┤
│     Data Access Layer           │ (state.ts, mock.ts, Supabase)
├─────────────────────────────────┤
│     Database/Storage Layer      │ (localStorage → Supabase)
└─────────────────────────────────┘
```

### 2. Padrões de Design Utilizados

| Padrão | Implementação | Benefício |
|--------|---------------|-----------|
| **MVC** | Model (types/), View (components/), Controller (pages/) | Separação de responsabilidades |
| **Singleton** | QueryClient, Router | Uma única instância por app |
| **Factory** | Functions `addUser()`, `addTeam()` | Criação consistente de objetos |
| **Observer** | React hooks, Context API | Reatividade e updates automáticos |
| **Repository** | state.ts | Abstração de acesso a dados |

### 3. SOLID Principles

- **S** (Single): Cada componente tem uma responsabilidade
- **O** (Open/Closed): Extensível através de props e composição
- **L** (Liskov): Componentes substituíveis
- **I** (Interface): Interfaces TypeScript bem definidas
- **D** (Dependency): Injeção de dependências via props

### 4. Qualidade de Código

- ✅ TypeScript strict mode
- ✅ Type safety em 100% da aplicação
- ✅ Validação com Zod
- ✅ ESLint configurado
- ✅ Componentes testáveis (Vitest + Playwright)

### 5. Escalabilidade

- ✅ Structure flat-to-scalable
- ✅ Feature-based organization pronta
- ✅ localStorage → Supabase (upgrade path)
- ✅ Mock data → Real data (migration strategy)

---

## 🏢 Arquitetura da Aplicação

### Arquitetura Atual (V1)

```
Client (Browser)
    ↓
┌─────────────────────┐
│   React App (SPA)   │
├─────────────────────┤
│ Components          │
│ Pages               │
│ Hooks               │
├─────────────────────┤
│ State Management    │
│ - React Hook Form   │
│ - React Query       │
│ - localStorage      │
├─────────────────────┤
│ Data Layer          │
│ - mock.ts (static)  │
│ - state.ts (localStorage) │
└─────────────────────┘
```

### Arquitetura Futura (V2) - Com Backend

```
Client (PWA)
    ↓
┌─────────────────────┐
│   React App (SPA)   │
├─────────────────────┤
│ API Client Layer    │
│ (fetch/axios)       │
└─────────────────────┘
    ↓ HTTP/REST
┌─────────────────────┐
│  Supabase API       │
├─────────────────────┤
│ Authentication      │
│ - Auth.users        │
│ - JWT tokens        │
├─────────────────────┤
│ Database            │
│ - PostgreSQL        │
│ - RLS policies      │
├─────────────────────┤
│ Storage             │
│ - File uploads      │
│ - CDN integration   │
└─────────────────────┘
```

### Fluxo de Dados Atual

```typescript
// 1. Usuário preenche formulário
<CreatePlayerForm />
    ↓
// 2. React Hook Form valida com Zod
const form = useForm<PlayerFormValues>({
  resolver: zodResolver(playerSchema)
})
    ↓
// 3. onSubmit chamado com dados validados
function onSubmit(data: PlayerFormValues) {
    ↓
  // 4. Salvamento em localStorage via state.ts
  addPlayer({ name, number, position, teamId })
    ↓
  // 5. Toast notification de sucesso
  toast({ title: "Sucesso!" })
    ↓
  // 6. Form reset
  form.reset()
}

// 7. Dados persistem em localStorage
localStorage.getItem('lfa_players')

// 8. Debug page visualiza
// http://localhost:8080/debug
```

---

## 💾 Estrutura de Dados

### 1. Estrutura Atual (localStorage)

```typescript
// User
interface User {
  id: string;           // "u1", "u1779397273277"
  name: string;         // "João da Silva"
  email: string;        // "joao@email.com"
  role: UserRole;       // "admin" | "player" | "fan" | "moderator"
  avatarUrl?: string;   // URL do avatar
  createdAt: string;    // ISO 8601 timestamp
}

// Team
interface Team {
  id: string;           // "1", "tm1779397273277"
  name: string;         // "CF Estrela Vermelha"
  shortName?: string;   // "CFEV" (max 4)
  logoUrl?: string;     // URL do logo
  foundationYear?: string; // "1998"
  colors?: string;      // "#dc2626" (hex)
}

// Player
interface Player {
  id: string;           // "p1", "p1779397273277"
  teamId: string;       // Foreign key → Team.id
  userId?: string;      // Optional FK → User.id
  name: string;         // "Neymar Junior"
  number?: number;      // 11
  position?: string;    // "Atacante"
  photoUrl?: string;    // URL da foto
  height?: number;      // 188 (cm)
  weight?: number;      // 78 (kg)
  birthDate?: string;   // ISO 8601
  cpf?: string;         // "123.456.789-00"
}

// Match
interface Match {
  id: string;           // "m1"
  tournamentId: string; // FK → Tournament.id
  homeTeamId: string;   // FK → Team.id
  awayTeamId: string;   // FK → Team.id
  homeScore?: number;   // 3
  awayScore?: number;   // 1
  date: string;         // ISO 8601
  round?: string;       // "Rodada 1", "Semi-final"
  status: MatchStatus;  // "scheduled" | "live" | "finished"
}

// MatchEvent
interface MatchEvent {
  id: string;           // "e1"
  matchId: string;      // FK → Match.id
  playerId: string;     // FK → Player.id
  type: EventType;      // "goal" | "assist" | "yellow_card" | "red_card"
  minute?: number;      // 15, 45, 90
}

// Tournament
interface Tournament {
  id: string;           // "t1"
  leagueId: string;     // FK → League.id
  name: string;         // "Copa Antifascista 2026"
  type: "league" | "cup"; // Tipo de competição
  season: string;       // "2026"
  status: TournamentStatus; // "draft" | "ongoing" | "finished"
}

// League
interface League {
  id: string;           // "lfa1"
  name: string;         // "Liga Antifascista de Futebol"
  season: string;       // "2026"
  logoUrl?: string;     // URL do logo
}

// Podium
interface Podium {
  id: string;           // "pod1"
  tournamentId: string; // FK
  firstPlaceId: string; // FK → Team.id
  secondPlaceId: string;
  thirdPlaceId: string;
}
```

### 2. Estrutura Desejável (Supabase PostgreSQL)

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'fan',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  short_name VARCHAR(4),
  logo_url TEXT,
  foundation_year YEAR,
  colors VARCHAR(7), -- hex color
  city VARCHAR(255),
  state VARCHAR(2), -- "SP", "RJ"
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Players
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  shirt_number INTEGER CHECK (shirt_number BETWEEN 1 AND 99),
  position VARCHAR(50),
  photo_url TEXT,
  height INTEGER CHECK (height BETWEEN 150 AND 230),
  weight DECIMAL(5,2) CHECK (weight BETWEEN 40 AND 150),
  birth_date DATE,
  cpf VARCHAR(14) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX team_id_idx (team_id),
  INDEX user_id_idx (user_id)
);

-- Tournaments
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'league', 'cup'
  season VARCHAR(4) NOT NULL,
  status tournament_status DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id),
  home_team_id UUID NOT NULL REFERENCES teams(id),
  away_team_id UUID NOT NULL REFERENCES teams(id),
  home_score INTEGER,
  away_score INTEGER,
  date_time TIMESTAMP NOT NULL,
  round VARCHAR(255),
  status match_status DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX tournament_id_idx (tournament_id),
  INDEX date_time_idx (date_time),
  CHECK (home_team_id != away_team_id)
);

-- Match Events
CREATE TABLE match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id),
  event_type event_type NOT NULL,
  minute INTEGER CHECK (minute BETWEEN 0 AND 120),
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX match_id_idx (match_id),
  INDEX player_id_idx (player_id)
);

-- Standings (Denormalized for performance)
CREATE TABLE standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tournament_id, team_id)
);

-- Podiums
CREATE TABLE podiums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL UNIQUE REFERENCES tournaments(id),
  first_place_id UUID NOT NULL REFERENCES teams(id),
  second_place_id UUID REFERENCES teams(id),
  third_place_id UUID REFERENCES teams(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_teams_city ON teams(city);
CREATE INDEX idx_teams_state ON teams(state);
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_tournaments_season ON tournaments(season);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read users
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Policy: Only admins can update other users
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id OR 
    EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
```

### 3. Migrações Planejadas

```typescript
// Fase 1: Importar localStorage para Supabase
async function migrateLocalStorageToSupabase() {
  const localData = getAllData(); // do state.ts
  
  // Inserir usuários
  for (const user of localData.users) {
    await supabase.from('users').insert(user);
  }
  
  // Inserir times
  for (const team of localData.teams) {
    await supabase.from('teams').insert(team);
  }
  
  // Inserir jogadores
  for (const player of localData.players) {
    await supabase.from('players').insert(player);
  }
}

// Fase 2: Sincronizar dados em tempo real
subscribeToRealtimeUpdates() {
  supabase
    .from('players')
    .on('*', payload => {
      // Atualizar state local
      updateLocalPlayers(payload);
    })
    .subscribe();
}
```

---

## 🧩 Componentes da Aplicação

### Componentes de Página

| Página | Rota | Função | Status |
|--------|------|--------|--------|
| Index | `/` | Home com matches e torneios | ✅ Completo |
| Teams | `/teams` | Listagem de times | ✅ Completo |
| TeamDetail | `/teams/:id` | Detalhes do time | ✅ Completo |
| Tournaments | `/tournaments` | Listagem de torneios | ✅ Completo |
| TournamentDetail | `/tournaments/:id` | Detalhes do torneio | ✅ Completo |
| Media | `/media` | Galeria de fotos/vídeos | ✅ Completo |
| More | `/more` | Menu admin (cadastros) | ✅ Completo |
| Debug | `/debug` | Visualizar localStorage | ✅ Completo |

### Componentes Reutilizáveis

| Componente | Responsabilidade | Props |
|------------|------------------|-------|
| BottomNav | Navegação principal | - |
| PageHeader | Cabeçalho de página | title, subtitle |
| MatchCard | Exibição de partida | match |
| PodiumCard | Pódio de campeões | teams |
| StandingsTable | Tabela de classificação | teams, stats |
| CreateUserForm | Cadastro de usuário | onSubmit? |
| CreateTeamForm | Cadastro de time | onSubmit? |
| CreatePlayerForm | Cadastro de jogador | onSubmit? |

### Formulários com Validação

```typescript
// Schema Zod para User
const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
  role: z.enum(["player", "fan", "moderator", "admin"]),
  phone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

// Schema Zod para Player
const playerSchema = z.object({
  name: z.string().min(3),
  shirtNumber: z.coerce.number().min(1).max(99),
  position: z.enum([...positions]),
  teamId: z.string().min(1),
  height: z.coerce.number().min(150).max(230),
  weight: z.coerce.number().min(40).max(150),
  birthDate: z.string().refine(date => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 13 && age <= 80;
  }),
  cpf: z.string().optional(),
});
```

---

## 🎯 Estado e Persistência

### Estratégia Atual (localStorage)

```typescript
// src/dados/state.ts
const STORAGE_USERS = 'lfa_users';
const STORAGE_PLAYERS = 'lfa_players';
const STORAGE_TEAMS = 'lfa_teams';

export function addPlayer(player: Omit<Player, 'id'>): Player {
  const players = getPlayers();
  const newPlayer: Player = {
    ...player,
    id: `p${Date.now()}`, // ID único baseado em timestamp
  };
  players.push(newPlayer);
  localStorage.setItem(STORAGE_PLAYERS, JSON.stringify(players));
  console.log('✅ Jogador salvo em localStorage:', newPlayer);
  return newPlayer;
}

export function getPlayers(): Player[] {
  const stored = localStorage.getItem(STORAGE_PLAYERS);
  return stored ? JSON.parse(stored) : [];
}

export function getAllData() {
  return {
    users: getUsers(),
    players: getPlayers(),
    teams: getTeams(),
  };
}
```

### Fluxo de Estado em Componentes

```typescript
// CreatePlayerForm.tsx
export function CreatePlayerForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. Setup form com validação Zod
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: { /* ... */ }
  });

  // 2. Handler do submit
  async function onSubmit(data: PlayerFormValues) {
    try {
      setIsLoading(true);
      
      // 3. Salvar em localStorage
      const newPlayer = addPlayer({
        name: data.name,
        number: data.shirtNumber,
        position: data.position,
        teamId: data.teamId,
      });

      // 4. Notificar sucesso
      toast({
        title: "Sucesso!",
        description: `Jogador ${data.name} cadastrado!`,
      });

      // 5. Limpar form
      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao cadastrar.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Campos do form */}
      </form>
    </Form>
  );
}
```

### Estratégia Futura (Supabase + React Query)

```typescript
// hooks/usePlayer.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/liv/supabase';

export function usePlayers(teamId?: string) {
  return useQuery({
    queryKey: ['players', teamId],
    queryFn: async () => {
      let query = supabase.from('players').select('*');
      if (teamId) query = query.eq('team_id', teamId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePlayer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPlayer: Omit<Player, 'id'>) => {
      const { data, error } = await supabase
        .from('players')
        .insert([newPlayer])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}

// Uso em componente
const { mutate: createPlayer } = useCreatePlayer();
await createPlayer(playerData);
```

---

## 🚀 Roadmap de Desenvolvimento

### Timeline Sugerida

```
Q2 2026 (Atual - Maio)
├─ ✅ Setup inicial
├─ ✅ Mock data (25 times)
├─ ✅ Componentes base
├─ ✅ Formulários com validação
├─ ✅ localStorage persistence
└─ 🔄 Testes e debugging

Q3 2026 (Junho-Agosto)
├─ 🔄 Setup Supabase
├─ 🔄 Migração de dados
├─ 🔄 Autenticação com Supabase Auth
├─ 🔄 Upload de logos/fotos
├─ 🔄 Página de login
└─ 🔄 Testes E2E com Playwright

Q4 2026 (Setembro-Outubro)
├─ 🔄 API REST com Supabase
├─ 🔄 Real-time updates
├─ 🔄 PWA setup
├─ 🔄 Performance optimization
└─ 🔄 Deploy em produção

Q1 2027 (Novembro+)
├─ 📅 Sistema de pontuação automático
├─ 📅 Notificações push
├─ 📅 Relatórios e estatísticas
├─ 📅 Admin dashboard avançado
└─ 📅 App native (React Native)
```

### Funcionalidades por Fase

#### Fase 1: Core (ATUAL) ✅
- [x] Visualização de times
- [x] Visualização de jogadores
- [x] Cadastro básico de usuários/times/jogadores
- [x] Mock data com 25 times
- [x] localStorage persistence
- [x] UI/UX dark theme
- [x] Página de debug

#### Fase 2: Backend Integration (3 sprints)
- [ ] Setup Supabase project
- [ ] Tabelas PostgreSQL criadas
- [ ] RLS policies configuradas
- [ ] Supabase Auth integrado
- [ ] Migração de dados
- [ ] API client setup
- [ ] Testes básicos

#### Fase 3: User Experience (4 sprints)
- [ ] Login/Logout
- [ ] Refresh tokens
- [ ] Role-based access control
- [ ] Upload de fotos/logos
- [ ] Real-time updates
- [ ] Offline support (PWA)
- [ ] Push notifications

#### Fase 4: Advanced Features (5+ sprints)
- [ ] Sistema de pontuação automático
- [ ] Estatísticas avançadas
- [ ] Relatórios em PDF
- [ ] Admin dashboard
- [ ] Integração com redes sociais
- [ ] API pública para terceiros
- [ ] App mobile nativa

---

## ✅ Checklist de Implementação

### V1.0.0 (Current - May 2026)

#### Core Features
- [x] React 18 + TypeScript setup
- [x] Vite builder configuration
- [x] TailwindCSS dark theme
- [x] Routing com React Router v6
- [x] 25 teams mock data
- [x] 10 players mock data
- [x] 6 matches mock data
- [x] 3 tournaments mock data

#### UI/UX
- [x] BottomNav (5 tabs)
- [x] PageHeader component
- [x] MatchCard component
- [x] PodiumCard component
- [x] StandingsTable component
- [x] Dark theme glassmorphism
- [x] Mobile-first responsive

#### Forms & Validation
- [x] CreateUserForm (react-hook-form + zod)
- [x] CreateTeamForm (react-hook-form + zod)
- [x] CreatePlayerForm (react-hook-form + zod)
- [x] Form error handling
- [x] Toast notifications

#### State Management
- [x] localStorage persistence (state.ts)
- [x] addUser() function
- [x] addTeam() function
- [x] addPlayer() function
- [x] getUsers/Teams/Players functions
- [x] Debug page (/debug)

#### Pages
- [x] Index.tsx (/)
- [x] Teams.tsx (/teams)
- [x] Tournaments.tsx (/tournaments)
- [x] Media.tsx (/media)
- [x] More.tsx (/more)
- [x] Debug.tsx (/debug)

### V1.1.0 (Improvements - June 2026)

#### Code Quality
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] Component storybook
- [ ] TypeScript strict mode (100%)
- [ ] ESLint full config
- [ ] Prettier auto-format

#### Data Management
- [ ] Export to CSV
- [ ] Import from CSV
- [ ] Data validation rules
- [ ] Backup/restore functionality
- [ ] Data versioning

#### Performance
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Bundle size analysis
- [ ] Lighthouse 90+

### V2.0.0 (Backend Integration - Q3 2026)

#### Supabase Setup
- [ ] Project criado em Supabase
- [ ] PostgreSQL database
- [ ] Tabelas criadas
- [ ] Indexes criados
- [ ] RLS policies configuradas
- [ ] Realtime enabled

#### Authentication
- [ ] Supabase Auth configurado
- [ ] Login page
- [ ] Register page
- [ ] Password reset
- [ ] Email verification
- [ ] JWT token management

#### API Integration
- [ ] Fetch client setup
- [ ] Error handling
- [ ] Retry logic
- [ ] Request interceptors
- [ ] Response transformers

#### File Storage
- [ ] Supabase Storage bucket
- [ ] Logo upload
- [ ] Photo upload
- [ ] Avatar upload
- [ ] CDN integration
- [ ] Image optimization

### V2.1.0 (Real-time & PWA - Q3 2026)

#### Real-time Features
- [ ] Supabase realtime subscriptions
- [ ] Live match updates
- [ ] Live scoring
- [ ] Push notifications
- [ ] WebSocket handling

#### PWA
- [ ] Service worker
- [ ] Offline support
- [ ] Cache strategy
- [ ] Install prompt
- [ ] App manifest
- [ ] Icons & splashscreens

#### Admin Features
- [ ] Admin dashboard
- [ ] User management
- [ ] Team management
- [ ] Player management
- [ ] Tournament management
- [ ] Scoring system

### V3.0.0 (Advanced - Q4 2026+)

#### Analytics
- [ ] User analytics
- [ ] Match statistics
- [ ] Player performance metrics
- [ ] Team rankings
- [ ] Trend analysis

#### Integrations
- [ ] Instagram integration
- [ ] Twitter integration
- [ ] WhatsApp integration
- [ ] Telegram bot
- [ ] Email notifications

#### Mobile Native
- [ ] React Native app
- [ ] iOS build
- [ ] Android build
- [ ] App Store publish
- [ ] Play Store publish

---

## 📚 Tecnologias Chave

### Frontend Stack
```json
{
  "runtime": "Node.js 18+",
  "package_manager": "npm 9+",
  "bundler": "Vite 5.4",
  "framework": "React 18.3",
  "language": "TypeScript 5.8",
  "styling": "TailwindCSS 3.4",
  "components": "shadcn/ui (Radix UI)",
  "forms": "React Hook Form 7.48 + Zod 3.22",
  "routing": "React Router 6.30",
  "state": "React Query 5.83 (planned)",
  "animation": "Framer Motion 12.38",
  "icons": "Lucide React 0.292",
  "notifications": "Sonner 1.2",
  "testing": {
    "unit": "Vitest 3.2",
    "e2e": "Playwright 1.57"
  }
}
```

### Backend Stack (Planned)
```json
{
  "database": "PostgreSQL (Supabase)",
  "auth": "Supabase Auth (JWT)",
  "storage": "Supabase Storage",
  "realtime": "Supabase Realtime",
  "api": "Supabase REST API",
  "orm": "Supabase Client (TypeScript)",
  "messaging": "Supabase Edge Functions"
}
```

### DevOps & Deployment
```json
{
  "version_control": "Git + GitHub",
  "ci_cd": "GitHub Actions",
  "hosting_frontend": "Vercel / Netlify",
  "hosting_backend": "Supabase Cloud",
  "domain": "Custom domain (TBD)",
  "ssl": "Let's Encrypt / Cloudflare",
  "cdn": "Cloudflare / Supabase CDN",
  "monitoring": "Sentry / LogRocket"
}
```

---

## 🔐 Considerações de Segurança

### Autenticação & Autorização
```typescript
// JWT workflow
1. User faz login
2. Supabase retorna JWT token
3. Frontend armazena em httpOnly cookie
4. RLS policies no banco validam acesso

// Role-based access
- admin: Acesso total
- moderator: Gerenciar times/jogadores
- player: Ver dados, editar próprio perfil
- fan: Ver-only
```

### Data Protection
```typescript
// Sensitive data
- Senhas: Hash com bcrypt (Supabase Auth)
- CPF: Criptografado no DB
- Dados pessoais: Protegidos por RLS
- Uploads: Scanned for malware

// Audit logging
- Track user actions
- Log API calls
- Monitor unauthorized access
```

### Input Validation
```typescript
// Frontend validation
- Zod schemas
- HTML5 input types
- Length/format checks

// Backend validation
- SQL parameterized queries
- Type checking
- Business rule validation
```

---

## 📊 Métricas de Sucesso

### User Engagement
- Usuários cadastrados: Objetivo 1.000+ (Q1 2027)
- Daily active users (DAU): 100+
- Session duration: 10+ minutos
- Return rate: 40%+

### Technical Metrics
- Lighthouse score: 90+
- Page load time: <2s
- API response time: <500ms
- Uptime: 99.5%+
- Error rate: <0.1%

### Business Metrics
- Número de times: 25+ (objetivo nacional)
- Número de torneios: 10+ por ano
- Partidas registradas: 500+
- Média de visualizações: 1.000+

---

## 📞 Próximos Passos

### Imediato (Semana 1)
1. [ ] Review deste documento com stakeholders
2. [ ] Refinar estrutura de dados Supabase
3. [ ] Setup credenciais Supabase
4. [ ] Criar issues no GitHub

### Curto Prazo (2-4 semanas)
1. [ ] Setup Supabase project
2. [ ] Criar tabelas PostgreSQL
3. [ ] Implementar Supabase Auth
4. [ ] Migrar dados localStorage

### Médio Prazo (1-2 meses)
1. [ ] Upload de arquivos
2. [ ] Real-time updates
3. [ ] PWA setup
4. [ ] Testes E2E

### Longo Prazo (3+ meses)
1. [ ] Admin dashboard
2. [ ] Sistema de pontuação
3. [ ] API pública
4. [ ] App mobile nativa

---

## 📖 Referências & Recursos

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Testing Library](https://testing-library.com/)
- [Playwright Docs](https://playwright.dev)

---

## 📝 Notas Finais

Este documento serve como referência completa para:
- ✅ Entendimento da arquitetura
- ✅ Onboarding de novos desenvolvedores
- ✅ Planejamento de sprints
- ✅ Decisões técnicas
- ✅ Documentação de requirements

**Última atualização:** Maio 21, 2026  
**Versão do Documento:** 1.0.0  
**Status:** ✅ Pronto para desenvolvimento Q2 2026
