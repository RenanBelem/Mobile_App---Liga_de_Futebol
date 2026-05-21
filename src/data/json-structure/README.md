# 📋 Estrutura JSON - Liga Antifascista de Futebol

## 📌 Visão Geral

Esta pasta contém a estrutura de dados completa da aplicação em formato JSON, pronta para integração com um banco de dados SQL (Supabase, PostgreSQL, MySQL, etc.) ou NoSQL (MongoDB, Firestore).

## 📁 Arquivos Disponíveis

### 1. **leagues.json** - Ligas
Contém as ligas principais onde os torneios e times são organizados.

**Exemplo de campo:**
```json
{
  "id": "l1",
  "name": "Liga Antifascista de Futebol",
  "country": "Brasil",
  "founded_year": 2020,
  "is_active": true
}
```

**Relacionamentos:** 1 Liga → Muitos Torneios e Times

---

### 2. **tournaments.json** - Torneios & Competições
Torneios, Copas e competições especiais dentro das ligas.

**Tipos de competição:**
- `league` - Campeonato regular (todos contra todos)
- `cup` - Copa de mata-mata
- `playoff` - Fase de playoff

**Status possíveis:** `scheduled`, `ongoing`, `finished`, `cancelled`

**Exemplo:**
```json
{
  "id": "t1",
  "league_id": "l1",
  "name": "Campeonato Principal 2026",
  "type": "league",
  "status": "ongoing",
  "start_date": "2026-03-01",
  "total_rounds": 6
}
```

---

### 3. **teams.json** - Times
Times participantes dos torneios.

**Campos importantes:**
- `colors` - Cor principal em hex (#22c55e)
- `league_id` - Liga a qual pertence
- `coach_name` - Técnico responsável

**Exemplo:**
```json
{
  "id": "1",
  "league_id": "l1",
  "name": "Trovão FC",
  "colors": "#22c55e",
  "city": "São Paulo",
  "coach_name": "João Santos"
}
```

---

### 4. **players.json** - Jogadores
Elenco completo dos times.

**Posições suportadas:** Goleiro, Zagueiro, Lateral, Volante, Meia, Atacante, Ponta

**Exemplo:**
```json
{
  "id": "p1",
  "team_id": "1",
  "name": "Carlos Silva",
  "number": 10,
  "position": "Atacante",
  "birth_date": "1998-05-15",
  "height_cm": 182
}
```

---

### 5. **phases.json** - Fases/Turnos
Organiza as rodadas e fases dos torneios.

**Tipos de fase:**
- `round-robin` - Todos contra todos
- `knockout` - Mata-mata
- `group` - Fase de grupos
- `playoff` - Playoff

**Exemplo:**
```json
{
  "id": "ph1",
  "tournament_id": "t1",
  "name": "Rodada 1",
  "type": "round-robin",
  "phase_number": 1,
  "start_date": "2026-03-10"
}
```

---

### 6. **matches.json** - Partidas/Jogos
Todos os jogos com placar, data, local e status.

**Status possíveis:** `scheduled`, `live`, `finished`, `postponed`, `cancelled`

**Exemplo:**
```json
{
  "id": "m1",
  "tournament_id": "t1",
  "home_team_id": "1",
  "away_team_id": "2",
  "home_score": 3,
  "away_score": 1,
  "date": "2026-03-10",
  "status": "finished",
  "stadium": "Campo da Esperança"
}
```

**Importante:** Se `status` é `scheduled`, os campos `home_score` e `away_score` são `null`.

---

### 7. **match_events.json** - Eventos de Partida
Gols, assistências, cartões e eventos específicos de cada partida.

**Tipos de evento:**
- `goal` - Gol
- `assist` - Assistência
- `yellow_card` - Cartão amarelo
- `red_card` - Cartão vermelho
- `own_goal` - Gol contra
- `substitution` - Substituição

**Exemplo:**
```json
{
  "id": "e1",
  "match_id": "m1",
  "player_id": "p1",
  "type": "goal",
  "minute": 15,
  "is_penalty": false,
  "assist_by_player_id": "p3"
}
```

---

### 8. **standings.json** - Classificações
Tabela de classificação de cada torneio.

**Campos calculados:**
- `points` - Total de pontos (Vitória=3, Empate=1, Derrota=0)
- `goals_difference` - Saldo de gols
- `position` - Colocação na tabela

**Exemplo:**
```json
{
  "id": "st1",
  "tournament_id": "t1",
  "team_id": "1",
  "position": 1,
  "matches_played": 4,
  "wins": 3,
  "points": 9,
  "goals_for": 11,
  "goals_against": 3
}
```

---

### 9. **podiums.json** - Pódios/Campeões
Campeões (ouro, prata, bronze) de cada torneio finalizado.

**Exemplo:**
```json
{
  "id": "pod1",
  "tournament_id": "t2",
  "first_place": {
    "position": 1,
    "team_id": "1",
    "team_name": "Trovão FC",
    "medal": "gold",
    "prize": "Troféu + R$ 2000"
  }
}
```

---

### 10. **media.json** - Mídia (Fotos & Vídeos)
Galeria de fotos e vídeos de torneios e partidas.

**Tipos:** `photo`, `video`

**Exemplo:**
```json
{
  "id": "md1",
  "tournament_id": "t2",
  "type": "photo",
  "title": "Final do Campeonato 2025",
  "url": "/media/photos/final-2025-01.jpg",
  "date": "2025-12-15",
  "photographer": "Ana Silva",
  "tags": ["final", "2025", "copa-amizade"]
}
```

---

### 11. **users.json** - Usuários
Usuários do sistema com diferentes papéis.

**Roles (papéis):**
- `admin` - Acesso total ao sistema
- `moderator` - Pode registrar resultados e mídia
- `player` - Jogador com acesso limitado
- `fan` - Apenas visualização

**Exemplo:**
```json
{
  "id": "u1",
  "email": "admin@liga.com",
  "name": "Administrador",
  "role": "admin",
  "email_verified": true,
  "two_factor_enabled": true
}
```

---

### 12. **SCHEMA.json** - Documentação do Schema
Referência completa de todas as entidades, campos, relacionamentos e índices para criar tabelas no banco de dados.

---

## 🔗 Relacionamentos Entre Entidades

```
Leagues
  ├─→ Tournaments
  │    ├─→ Matches
  │    │    ├─→ Match Events
  │    │    └─→ Media
  │    ├─→ Phases
  │    │    └─→ Matches
  │    ├─→ Standings
  │    └─→ Podiums
  └─→ Teams
       ├─→ Players
       │    └─→ Match Events
       └─→ Users

Users
  └─→ Teams (opcional)
```

---

## 🗄️ Integração com Banco de Dados

### Para Supabase/PostgreSQL

1. Use `SCHEMA.json` como referência para criar as tabelas
2. Defina os campos com os tipos especificados
3. Configure os FOREIGN KEYs conforme documentado
4. Crie os índices sugeridos para otimizar queries
5. Use uma ferramenta como pgAdmin ou Supabase Console

### Para MongoDB/Firebase

1. Cada arquivo JSON pode ser uma collection
2. Use os `id` como campo `_id` para referência
3. Armazene os relacionamentos como referências (IDs) ou documentos embutidos
4. Crie índices nos campos com marcação de "indexes"

---

## 📊 Estatísticas de Dados

- **Ligas:** 2
- **Torneios:** 4
- **Times:** 6
- **Jogadores:** 10
- **Partidas:** 11
- **Eventos de Partida:** 18
- **Usuários:** 8
- **Itens de Mídia:** 8

---

## 🎯 Como Usar

### 1. **Carregar dados do JSON**

**JavaScript/TypeScript:**
```javascript
import leagues from './leagues.json';
import tournaments from './tournaments.json';
import teams from './teams.json';
// ... importar outros arquivos
```

### 2. **Importar no Banco de Dados**

**Supabase:**
```sql
-- Criar tabelas primeiro
-- Depois inserir dados do JSON usando dashboard ou API
```

**MongoDB:**
```javascript
db.leagues.insertMany(require('./leagues.json').leagues);
db.tournaments.insertMany(require('./tournaments.json').tournaments);
// ... etc
```

### 3. **Usar no Backend**

Recuperar dados e servir via API:
```javascript
app.get('/api/tournaments/:id', (req, res) => {
  const tournament = tournaments.find(t => t.id === req.params.id);
  const teams_data = standings
    .filter(s => s.tournament_id === tournament.id)
    .map(s => ({ ...s, team: teams.find(t => t.id === s.team_id) }));
  res.json({ tournament, standings: teams_data });
});
```

---

## 🔐 Considerações de Segurança

- **Senhas:** Usar hash bcrypt (não armazenar em JSON)
- **Tokens:** Gerar JWT no backend após autenticação
- **Permissões:** Validar role do usuário antes de operações
- **CORS:** Configurar CORS apropriado na API

---

## 📝 Notas Importantes

1. **IDs:** Use UUIDs na produção, não strings simples
2. **Timestamps:** Use ISO 8601 (2026-05-21T00:00:00Z)
3. **Cores:** Sempre em formato hex com #
4. **URLs:** Usar URLs relativas ou CDN para mídia
5. **Validação:** Implementar validação de dados no backend

---

## 🚀 Próximos Passos

1. Escolher banco de dados (Supabase, Firebase, MongoDB, etc.)
2. Criar schema com base em `SCHEMA.json`
3. Implementar APIs REST para CRUD operations
4. Integrar com frontend React da aplicação
5. Adicionar autenticação (JWT)
6. Implementar autorização por role

---

**Versão:** 1.0.0  
**Última atualização:** 2026-05-21  
**Mantido por:** Equipe de Desenvolvimento
