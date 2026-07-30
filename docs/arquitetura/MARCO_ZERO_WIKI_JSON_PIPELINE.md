# Marco Zero - Pipeline wiki_lfa -> JSON -> Supabase

## Objetivo
Estabelecer um fluxo de dados versionado e validavel em que:
1. `wiki_lfa` e a fonte recorrente de atualizacao.
2. Os JSONs da aplicacao continuam sendo a camada de dados local e enriquecida.
3. Campos extras existentes nos JSONs (nao presentes na wiki) sao preservados.
4. Existe um caminho deterministico para gravar os dados no Supabase.

## Premissas
1. A wiki muda com frequencia e pode adicionar/alterar informacoes narrativas e tabelas historicas.
2. Os JSONs da aplicacao possuem informacoes adicionais de produto (URLs internas, campos de UI, metadata de app).
3. A sincronizacao nao pode sobrescrever cegamente os JSONs.

## Estrategia de Dados
### Camadas
1. `wiki_lfa` (origem editorial): markdown sem schema rigido.
2. `wiki_enrichment.json` (snapshot estruturado da wiki): resultado de parser.
3. JSONs da aplicacao (`ligas.json`, `temporadas.json`, `competicoes.json`, `times.json`): base operada pelo app.
4. Supabase (fonte de verdade em producao): recebe dados dos JSONs consolidados.

### Regra de Ouro do Merge
- Wiki e **autoritativa para campos compartilhados**.
- JSON da aplicacao e **autoritativo para campos exclusivos do app**.
- Campos exclusivos nunca sao removidos por sincronizacao.

## De-Para (Marco Zero)

### Competicoes
- Wiki: `docs/campeonatos/*.md`
- JSON destino: `fonte/dados/json/competicoes.json`
- Chave de reconciliacao primaria: `slug`
- Campos compartilhados:
  - `name`
  - `slug`
  - `organizer`
  - `type` (via mapeamento)
- Campos preservados do JSON (nao sobrescrever automaticamente):
  - `format`
  - `start_date`
  - `end_date`
  - `logo_url`
  - `banner_url`
  - `order`
  - `created_at`
  - `updated_at`

### Temporadas
- Wiki: `docs/temporadas/<ano>/<apertura|clausura>.md`
- JSON destino: `fonte/dados/json/temporadas.json`
- Chave de reconciliacao: `slug` (ex.: `apertura-25`)
- Campos compartilhados:
  - `name`
  - `slug`
  - `year`
  - `semester`
- Campos preservados do JSON:
  - `status`
  - `start_date`
  - `end_date`
  - `banner_url`
  - `created_at`
  - `updated_at`

### Times
- Wiki: `docs/times/*.md`
- JSON destino: `fonte/dados/json/times.json`
- Chave de reconciliacao: `slug`
- Campos compartilhados:
  - `name`
  - `slug`
  - `founded_year`
  - `description`
- Campos preservados do JSON:
  - `logo_url`
  - `banner_url`
  - `colors`
  - `secondary_color`
  - `abbreviation`
  - `city`
  - `state`
  - `stadium_name`
  - `president_name`
  - `coach_name`

## Pipeline Proposto
1. `snapshot`: ler markdown da wiki e gerar `wiki_enrichment.json` + relatorio de consistencia.
2. `merge`: aplicar merge nao-destrutivo para atualizar JSONs de app.
3. `export-upserts`: gerar SQL de UPSERT a partir dos JSONs consolidados.
4. `db-sync` (marco posterior): executar SQL no Supabase.

## Validacoes (Gate de Qualidade)
1. Cobertura de mapeamento por entidade:
  - competicoes wiki mapeadas por slug em `competicoes.json`
  - temporadas wiki mapeadas por slug em `temporadas.json`
  - times wiki mapeados por slug em `times.json`
2. Integridade de chaves:
  - sem slugs vazios
  - sem duplicidade por slug
3. Relatorio de divergencias:
  - itens apenas na wiki
  - itens apenas no JSON
  - colisao de nome com slug divergente

## Fluxo Operacional Recomendado
1. Atualizar pasta `wiki-lfa/wiki-lfa-main`.
2. Rodar `python scripts/wiki_sync_pipeline.py snapshot`.
3. Revisar `scripts/out/wiki_sync_report.json`.
4. Rodar `python scripts/wiki_sync_pipeline.py merge`.
5. Revisar diff dos JSONs.
6. Rodar `python scripts/wiki_sync_pipeline.py export-upserts`.
7. Executar script SQL no Supabase (marco seguinte).

## Riscos e Mitigacoes
1. Formato markdown mudar na wiki:
- Mitigacao: parser tolerante + relatorio de parse com contagem de falhas.
2. Slug inconsistente entre wiki e JSON:
- Mitigacao: mapa de aliases e normalizacao por transliteracao.
3. Perda de campos extras dos JSONs:
- Mitigacao: merge por patch de campos compartilhados apenas.

## Entregaveis do Marco Zero
1. Documento de arquitetura do pipeline (este arquivo).
2. Script de snapshot/merge/export SQL.
3. Relatorio de de-para automatizado para suportar auditoria da migracao.
