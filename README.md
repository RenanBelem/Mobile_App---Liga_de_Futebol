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
├── src/
│   ├── components/         # Componentes reutilizáveis (MatchCard, PodiumCard, etc.)
│   ├── data/
│   │   └── mock.ts         # Base de dados estática atual (Simulação de DB)
│   ├── hooks/              # Hooks customizados para lógica de estado
│   ├── lib/                # Configurações de bibliotecas externas
│   ├── pages/              # Páginas principais da aplicação
│   │   ├── Index.tsx       # Home / Visão Geral
│   │   ├── Media.tsx       # Galeria de fotos e vídeos
│   │   ├── Teams.tsx       # Listagem de times cadastrados
│   │   ├── TeamDetail.tsx  # Perfil detalhado de um time e seu elenco
│   │   ├── Tournament.tsx  # Lista de campeonatos (Ligas e Copas)
│   │   └── TournamentDetail.tsx # Tabela, jogos e pódio de um torneio específico
│   ├── types/
│   │   └── league.ts       # Definições de Interfaces (Team, Player, Match, Podium)
│   ├── App.tsx             # Arquivo principal com rotas
│   └── main.tsx            # Ponto de entrada do React
├── index.html              # Template principal HTML
└── package.json            # Scripts e dependências do projeto
```

## 🚀 Status do Desenvolvimento (Checklist)

* [x] **Configuração do Ambiente**: Node.js e NPM operacionais.
* [x] **Arquitetura de Dados**: Interfaces definidas em `types/` e dados mockados em `data/`.
* [x] **Navegação**: Rotas básicas configuradas para Mobile.
* [x] **Pódio e Histórico**: Lógica implementada para exibir 1º, 2º e 3º colocados em torneios finalizados.
* [x] **Estatísticas**: Cálculo de artilharia e assistências funcional em `TournamentDetail.tsx`.
* [ ] **Módulo Admin**: Criação de formulários para cadastro via interface (CRUD).
* [ ] **Gestão de Acessos**: Implementação de sistema de Login e Cadastro com controle de acesso baseado em funções (Role-Based Access Control):
    [ ] - Torcedor (Viewer): Acesso restrito apenas à visualização de tabelas, jogos e mídias.
    [ ] - Jogador (Player): Visualização geral, com painel personalizado contendo suas próprias estatísticas e atalhos para o seu time atual.
    [ ] - Moderador (Editor): Permissão para criar e editar informações de times, jogadores e resultados de ligas específicas.
    [ ] - Administrador (Admin): Controle total sobre a aplicação, incluindo gestão de usuários, configurações globais e auditoria.
* [ ] **Integridade e Auditoria**
    [ ] - Logs de Edição: Criação de uma trilha de auditoria para registrar quem alterou um resultado, escalação ou informação histórica, garantindo a veracidade da "documentação viva".
    [ ] - Versionamento de Dados: Mecanismo para evitar conflitos de edição simultânea em súmulas de jogos.
* [ ] **Melhorias Técnicas e Funcionais**
    [ ] - Persistência de Dados Real: Migração do atual mock.ts para um banco de dados relacional (ex: PostgreSQL via Supabase) para suportar o volume histórico de múltiplas temporadas.
    [ ] - Sistema de Upload de Mídia: Integração com serviços de storage (como S3 ou Firebase Storage) para hospedar as fotos e vídeos mencionadas no escopo original.
    [ ] - Modo Offline (PWA): Cache de tabelas e resultados para que os torcedores possam consultar informações mesmo em campos de futebol com sinal de internet instável.
    [ ] - API de Estatísticas: Automatização do cálculo de artilharia e classificação (hoje feito manualmente no front-end) para processamento no servidor.
* [ ] **Fragilidades Identificadas (Pontos de Atenção)**
    [ ] - Dependência de Mock: Atualmente, qualquer alteração no app é perdida ao atualizar a página, pois não há um backend conectado.
    [ ]  Segurança de Rotas: As páginas de "Detail" e "Media" precisam de guardas de rota (Route Guards) para impedir que usuários não autenticados acessem áreas sensíveis.
    [ ] - Performance de Listagem: Com o crescimento da documentação histórica (muitos anos de dados), será necessário implementar paginação ou infinite scroll nas listas de jogos.

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