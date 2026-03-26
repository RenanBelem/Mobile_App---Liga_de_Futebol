# 🏆 Liga de Futebol - Documentação Histórica e Viva

Este projeto é um aplicativo mobile (Progressive Web App - PWA) focado na preservação da memória e gestão de uma liga de futebol. O objetivo é permitir o cadastro de times, jogadores, copas internas e a exibição de estatísticas, pódios históricos e mídias da temporada.

## 🛠️ Tecnologias Utilizadas

* **Vite + React**: Core do desenvolvimento e build.
* **TypeScript**: Tipagem estática para maior segurança no desenvolvimento.
* **Tailwind CSS + Shadcn/UI**: Estilização e componentes de interface modernos.
* **React Router**: Sistema de navegação entre páginas.

## 📂 Estrutura de Pastas e Arquivos

```text
raiz/
├── public/                 # Arquivos estáticos (ícones, svgs, logos)
│   ├── flavicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/         # Componentes reutilizáveis (MatchCard, PodiumCard, etc.)
│   │   ├── ui/
│   │   ├── BottomNav.tsx
│   │   ├── MatchCard.tsx
│   │   ├── NavLinks.tsx
│   │   ├── PageHeader.tsx
│   │   ├── PodiumCard.tsx
│   │   └── StandingsTable.tsx
│   ├── data/
│   │   ├── seasons/
│   │   ├── index.ts
│   │   ├── mock.ts         # Base de dados estática e Usuário Simulado (currentUser)
│   │   ├── player.ts
│   │   └── teams.ts
│   ├── hooks/              # Hooks customizados para lógica de estado
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                # Configurações de bibliotecas externas
│   │   └── utils.ts
│   ├── pages/              # Páginas principais da aplicação
│   │   ├── Index.tsx       # Home / Visão Geral
│   │   ├── Media.tsx       # Galeria de fotos e vídeos
│   │   ├── More.tsx
│   │   ├── NotFound.tsx
│   │   ├── TeamDetail.tsx  # Perfil detalhado de um time e seu elenco
│   │   ├── Teams.tsx       # Listagem de times cadastrados
│   │   ├── TournamentDetail.tsx # Tabela, jogos, pódio e travas de acesso por Role
│   │   └── Tournament.tsx  # Lista de campeonatos (Ligas e Copas)
│   ├── test/
│   │   ├── example.test.ts
│   │   └── setup.ts
│   ├── types/
│   │   └── league.ts       # Definições de Interfaces (Team, Player, User, AuditLog)
│   ├── App.css
│   ├── App.tsx             # Arquivo principal com rotas
│   ├── index.css
│   ├── main.tsx            # Ponto de entrada do React
│   └── vite-env.d.ts
├── .gitignore
├── bun.lock
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html              # Template principal HTML
├── package-lock.json
├── package.json            # Scripts e dependências do projeto
├── playwirght-fixture.ts
├── playwirght.config.ts
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

## 🚀 Status do Desenvolvimento (Checklist)

* [x] **Configuração do Ambiente**: Node.js e NPM operacionais.
* [x] **Arquitetura de Dados**: Interfaces definidas em `types/` e dados mockados em `data/`.
* [x] **Navegação**: Rotas básicas configuradas para Mobile.
* [x] **Pódio e Histórico**: Lógica implementada para exibir 1º, 2º e 3º colocados em torneios finalizados.
* [x] **Estatísticas**: Cálculo de artilharia e assistências funcional em `TournamentDetail.tsx`.
* [x] **Sistema de Roles (RBAC)**: Implementação da lógica de níveis de acesso (Admin, Moderador, Jogador, Torcedor).
* [ ] **Módulo Admin**: Criação de formulários para cadastro via interface (CRUD).
* [ ] **Integridade e Auditoria**:
    * [x] - Definição da Interface `AuditLog` para trilha de registros.
    * [ ] - Implementação da persistência dos logs de edição.
* [ ] **Melhorias Técnicas e Funcionais**:
    * [ ] - Persistência de Dados Real (Supabase/PostgreSQL).
    * [ ] - Sistema de Upload de Mídia Real.
    * [ ] - Modo Offline (PWA).

## 🔐 Controle de Acesso (Roles)

O sistema utiliza quatro níveis de permissão definidos em `src/types/league.ts`:

1.  **Administrador (Admin)**: Acesso irrestrito a todas as configurações e auditoria do sistema.
2.  **Moderador (Editor)**: Permissão para gerenciar jogos, resultados e mídias.
3.  **Jogador (Player)**: Visualização geral com destaque personalizado para suas próprias estatísticas.
4.  **Torcedor (Fan)**: Experiência puramente de leitura (Read-only).

---

## 💻 Como Executar

1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
3.  Acesse o IP da rede local no navegador do seu smartphone para testar a experiência mobile.

---