# Schema de Banco de Dados - Liga de Futebol

## 📋 Resumo das Tabelas Implementadas

Todos os tipos estão em PT-BR em `src/types/league.ts` com campos **`criado_em`** e **`atualizado_em`** em todas as tabelas.

Dados mockados em `src/data/database.ts` com 3 temporadas completas (Apertura 25, Clausura 25, Apertura 26).

---

## 🏛️ Hierarquia de Dados

```
Liga (permanente)
 ├── Temporada (Apertura 25, Clausura 25, Apertura 26...)
 │    ├── Competição (Campeonato Principal, Copa Interna)
 │    │    ├── Partida
 │    │    │    └── EventoPartida (gols, cartões)
 │    │    ├── Classificação
 │    │    └── Pódio
 │    ├── TimeTemporada (times que participam)
 │    └── Mídia (com temporada_id)
 │
 ├── Time (permanente, múltiplas temporadas)
 │    └── RegistroJogador (vínculo time×jogador×temporada)
 │
 ├── Jogador (permanente)
 └── Mídia global (liga_id sempre preenchido)
```

---

## 📊 Detalhamento das Tabelas

### 1. `Liga`
- **id**, **nome**, **url_logo**, **cidade**
- **criado_em**, **atualizado_em**

### 2. `Temporada` ⭐ CORE
- **id**, **liga_id** (FK)
- **nome** (ex: "Apertura 25"), **slug** (ex: "apertura-25")
- **ano**, **semestre** (`apertura` | `clausura`)
- **data_inicio**, **data_fim** (durações personalizadas!)
- **status** (`rascunho` | `em_andamento` | `finalizada`)
- **descricao**, **url_banner**
- **criado_em**, **atualizado_em**

### 3. `Competição`
- **id**, **temporada_id** (FK)
- **nome** (ex: "Campeonato Principal", "Copa Interna")
- **tipo** (`campeonato` | `copa` | `playoff`)
- **formato** (`turno_unico` | `eliminacao_direta` | `grupos_playoff`)
- **data_inicio**, **data_fim**, **status**, **ordem**
- **criado_em**, **atualizado_em**

### 4. `Time` (Permanente)
- **id**, **nome**, **nome_curto** (ex: "LOKM")
- **url_logo**, **cor_primaria**, **cor_secundaria**
- **ano_fundacao**, **ativo**
- **criado_em**, **atualizado_em**

### 5. `TimeTemporada` (Junção)
- **id**, **temporada_id** (FK), **time_id** (FK)
- **inscrito_em**
- Permite times entrarem e saírem em cada edição

### 6. `Jogador` (Permanente)
- **id**, **usuario_id** (FK, opcional)
- **nome**, **apelido**, **url_foto**, **data_nascimento**
- **criado_em**, **atualizado_em**

### 7. `RegistroJogador` ⭐ CORE (Vínculo)
- **id**, **jogador_id**, **time_id**, **temporada_id**
- **numero_camisa**, **posicao**, **ativo**
- **criado_em**, **atualizado_em**
- ✅ Um jogador ∈ um time por temporada (não duplica)
- ✅ Histórico de transferências por edição

### 8. `Partida`
- **id**, **competicao_id** (FK)
- **time_casa_id**, **time_visitante_id**
- **placar_casa**, **placar_visitante**
- **data_hora**, **rodada**, **local**, **status**
- **criado_em**, **atualizado_em**

### 9. `EventoPartida`
- **id**, **partida_id**, **jogador_id**, **time_id**
- **tipo** (`gol` | `assistencia` | `cartao_amarelo` | `cartao_vermelho` | `gol_contra`)
- **minuto**
- **criado_em**

### 10. `Classificação` (Standings)
- **id**, **competicao_id**, **time_id**
- **jogos**, **vitorias**, **empates**, **derrotas**
- **gols_pro**, **gols_contra**, **pontos**
- **atualizado_em** (cacheada/recalculada)

### 11. `Mídia` ⭐ DESIGN MULTI-ESCOPO
- **id**, **liga_id** (FK, sempre preenchido)
- **temporada_id** (FK, optional) — Se for de uma edição
- **partida_id** (FK, optional) — Se for de uma partida
- **time_id** (FK, optional) — Se for de um time
- **tipo** (`foto` | `video`)
- **url**, **url_thumbnail**, **legenda**
- **carregado_por** (usuario_id)
- **criado_em**

**Query por escopo:**
- Global: `WHERE liga_id = ?` → Aba "Mídias"
- Edição: `WHERE liga_id = ? AND temporada_id = ?` → Aba "Mídias da Apertura 25"
- Partida: `WHERE partida_id = ?` → Fotos do jogo específico

### 12. `Pódio`
- **id**, **competicao_id** (FK, UNIQUE)
- **time_primeiro_id**, **time_segundo_id**, **time_terceiro_id**
- **jogador_artilheiro_id** (optional), **jogador_melhor_id** (optional)
- **criado_em**, **atualizado_em**

### 13. `Usuário`
- **id**, **nome**, **email**, **papel** (`admin` | `moderador` | `jogador` | `torcedor`)
- **url_avatar**
- **criado_em**, **atualizado_em**

---

## 🎯 Decisões de Design

### ✅ Durações Personalizadas
Campo `data_inicio` e `data_fim` em `Temporada` são totalmente livres — não há cálculo automático de "6 meses". Pode ser 5 meses, 7 meses, etc.

### ✅ Copas Internas
São `Competição` com `tipo = 'copa'` dentro da mesma `Temporada`. Exemplo:
- Temporada "Apertura 25"
  - Competição "Campeonato Principal"
  - Competição "Copa Interna"

### ✅ Dados por Edição vs. Globais
- **Por edição:** `registros_jogador`, `times_temporada`, eventos, partidas (tudo com FK para `temporada_id`)
- **Globais:** `times`, `jogadores`, `usuarios` (permanentes, reutilizáveis)
- **Mídias:** Multi-escopo com `liga_id` (sempre) + `temporada_id/partida_id/time_id` (optional)

### ✅ Vínculo Jogador × Time × Temporada
Resolvido via `RegistroJogador`:
- Jogador "Carlos Silva" em 2025 → Time 001, camisa 10, atacante
- Mesmo jogador em 2026 → Time 003, camisa 9, meia
- Sem duplicação, histórico limpo

---

## 📁 Arquivos

| Arquivo | Conteúdo |
|---------|----------|
| `src/types/league.ts` | Interfaces TypeScript (13 tabelas + tipos legados) |
| `src/data/database.ts` | Dados mockados completos em PT-BR |
| `src/data/index.ts` | Índice de exportação |
| `src/data/mock.ts` | Dados legados (retrocompatibilidade) |

---

## 🔗 Importação

```typescript
// Novo Schema (PT-BR)
import {
  ligas,
  temporadas,
  competicoes,
  times,
  times_temporada,
  jogadores,
  registros_jogador,
  partidas,
  eventos_partida,
  classificacao,
  midia,
  podios,
  usuarios,
} from '@/data';

// Ou específico
import { getJogadoresPorTimeTemporada, getTimes_PorTemporada } from '@/data/database';
```

---

## 🚀 Próximos Passos

1. ✅ Tipos e dados mockados implementados
2. ⏳ Integração com Supabase (migrations SQL)
3. ⏳ Atualizar componentes para usar novo schema
4. ⏳ State management (TanStack Query com dados reais)
5. ⏳ Remover dados legados
