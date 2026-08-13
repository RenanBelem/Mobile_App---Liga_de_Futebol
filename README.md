# Liga de Futebol

Aplicacao web mobile-first para consultar e administrar times, jogadores, temporadas, competicoes, partidas e estatisticas da Liga Antifascista de Futebol.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- Vitest
- Dados locais em JSON com persistencia em `localStorage`

## Executar localmente

Requisitos: Node.js 18+ e npm.

```bash
npm install
npm run dev
```

Abra `http://localhost:8080`.

Comandos de verificacao:

```bash
npm run test
npm run lint
npm run build
```

## Estrutura essencial

```text
fonte/       Codigo React, dados, servicos e testes
publico/     Imagens e arquivos estaticos
config/      Configuracoes do Vite, TypeScript, Tailwind, PostCSS, ESLint e Vitest
scripts/     Sincronizacao wiki -> JSON e importacao de dados
docs/        Documentacao operacional e tecnica
wiki-lfa/    Fonte editorial da wiki; mantida separada do aplicativo
```

## Dados e sincronizacao

Os JSONs em `fonte/dados/json/` alimentam a aplicacao. A wiki em `wiki-lfa/wiki-lfa-main/` e a fonte editorial do pipeline. Para atualizar os dados:

```bash
python scripts/wiki_sync_pipeline.py snapshot
python scripts/wiki_sync_pipeline.py merge
python scripts/wiki_sync_pipeline.py export-upserts
```

Revise os relatorios em `scripts/out/` antes de aplicar qualquer SQL. O fluxo completo esta documentado em [`docs/arquitetura/MARCO_ZERO_WIKI_JSON_PIPELINE.md`](docs/arquitetura/MARCO_ZERO_WIKI_JSON_PIPELINE.md).

## Documentacao

- [`docs/README.md`](docs/README.md): indice curto e ordem de leitura
- [`docs/guias/INSTALACAO.md`](docs/guias/INSTALACAO.md): setup e comandos locais
- [`docs/guias/FAQ.md`](docs/guias/FAQ.md): problemas comuns
- [`docs/GUIA_CONTRIBUICAO.md`](docs/GUIA_CONTRIBUICAO.md): fluxo de contribuicao
- [`docs/SCHEMA_DATABASE_PTBR.md`](docs/SCHEMA_DATABASE_PTBR.md): modelo de dados
- [`docs/arquitetura/MARCO_ZERO_WIKI_JSON_PIPELINE.md`](docs/arquitetura/MARCO_ZERO_WIKI_JSON_PIPELINE.md): pipeline de dados
