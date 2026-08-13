from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import argparse
import json
import re
import unicodedata
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / 'fonte' / 'dados' / 'json'
DEFAULT_OUT_DIR = ROOT / 'scripts' / 'out' / 'marco2'
ALIASES_PATH = ROOT / 'scripts' / 'marco2_id_aliases.json'

DEFAULT_COMPETITION_ALIASES = {
    'comp-001': 'comp-2025-a-04',
    'comp-002': 'comp-2025-a-03',
    'comp-003': 'comp-2025-c-04',
    'comp-011': 'comp-2022-a-01',
    'comp-012': 'comp-2022-c-03',
    'comp-013': 'comp-2023-a-01',
    'comp-014': 'comp-2023-c-01',
    'comp-015': 'comp-2024-a-03',
    'comp-016': 'comp-2024-c-03',
}


@dataclass
class ValidationError:
    entity: str
    line: int
    source_id: str | None
    message: str


class ImportContext:
    def __init__(self) -> None:
        self.errors: list[ValidationError] = []
        self.depara: dict[str, list[dict[str, Any]]] = {}
        self.source_counts: dict[str, int] = {}
        self.valid_counts: dict[str, int] = {}

    def add_error(self, entity: str, line: int, source_id: str | None, message: str) -> None:
        self.errors.append(ValidationError(entity=entity, line=line, source_id=source_id, message=message))

    def add_depara(self, entity: str, payload: dict[str, Any]) -> None:
        self.depara.setdefault(entity, []).append(payload)

    def set_source_count(self, entity: str, count: int) -> None:
        self.source_counts[entity] = count

    def set_valid_count(self, entity: str, count: int) -> None:
        self.valid_counts[entity] = count


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding='utf-8'))


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def slugify(value: str) -> str:
    normalized = unicodedata.normalize('NFKD', value)
    ascii_text = ''.join(ch for ch in normalized if not unicodedata.combining(ch))
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r'[^a-z0-9]+', '-', ascii_text)
    return ascii_text.strip('-')


def normalize_text_id(value: Any) -> str:
    return str(value or '').strip()


def normalize_slug(raw_slug: Any, fallback_name: Any) -> str:
    slug = normalize_text_id(raw_slug)
    if slug:
        return slugify(slug)
    return slugify(str(fallback_name or ''))


def escape_sql(value: Any) -> str:
    if value is None:
        return 'NULL'
    if isinstance(value, bool):
        return 'TRUE' if value else 'FALSE'
    if isinstance(value, (int, float)):
        return str(value)
    text = str(value).replace("'", "''")
    return f"'{text}'"


def is_uuid(value: str) -> bool:
    return bool(re.fullmatch(r'[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}', value))


def parse_date(value: Any) -> datetime | None:
    text = normalize_text_id(value)
    if not text:
        return None
    for fmt in ('%Y-%m-%d', '%Y-%m-%dT%H:%M:%SZ'):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


def load_aliases() -> dict[str, str]:
    aliases = dict(DEFAULT_COMPETITION_ALIASES)
    if not ALIASES_PATH.exists():
        return aliases

    payload = read_json(ALIASES_PATH)
    custom = payload.get('competition_ids', {}) if isinstance(payload, dict) else {}
    if isinstance(custom, dict):
        for old_id, new_id in custom.items():
            old_key = normalize_text_id(old_id)
            new_value = normalize_text_id(new_id)
            if old_key and new_value:
                aliases[old_key] = new_value
    return aliases


def resolve_competicao_id(source_id: str, competicao_ids: set[str], aliases: dict[str, str]) -> tuple[str | None, bool]:
    if source_id in competicao_ids:
        return source_id, False
    alias = aliases.get(source_id)
    if alias and alias in competicao_ids:
        return alias, True
    return None, False


def map_status_partida(value: Any) -> str:
    text = normalize_text_id(value).lower()
    if text in ('finished', 'finalizada'):
        return 'finalizada'
    if text in ('live', 'ao_vivo'):
        return 'ao_vivo'
    if text in ('cancelled', 'cancelada'):
        return 'cancelada'
    return 'agendada'


def map_tipo_midia(value: Any) -> str:
    text = normalize_text_id(value).lower()
    if text in ('video',):
        return 'video'
    return 'foto'


def map_papel_usuario(value: Any) -> str:
    text = normalize_text_id(value).lower()
    mapping = {
        'admin': 'admin',
        'moderator': 'moderador',
        'moderador': 'moderador',
        'player': 'jogador',
        'jogador': 'jogador',
        'fan': 'torcedor',
        'torcedor': 'torcedor',
    }
    return mapping.get(text, 'torcedor')


def normalize_ligas(ctx: ImportContext) -> list[dict[str, Any]]:
    data = read_json(DATA_DIR / 'ligas.json').get('leagues', [])
    ctx.set_source_count('ligas', len(data))
    rows: list[dict[str, Any]] = []

    for idx, item in enumerate(data, start=1):
        source_id = normalize_text_id(item.get('id'))
        if not source_id:
            ctx.add_error('ligas', idx, None, 'id ausente')
            continue

        row = {
            'id': source_id,
            'nome': normalize_text_id(item.get('name')),
            'url_logo': normalize_text_id(item.get('logo_url')) or None,
            'cidade': None,
            'criado_em': normalize_text_id(item.get('created_at')) or now_iso(),
            'atualizado_em': normalize_text_id(item.get('updated_at')) or now_iso(),
        }

        if not row['nome']:
            ctx.add_error('ligas', idx, source_id, 'name ausente')
            continue

        rows.append(row)
        ctx.add_depara('ligas', {
            'line': idx,
            'source_id': source_id,
            'target_id': row['id'],
            'source_slug': item.get('slug'),
            'target_slug': normalize_slug(item.get('slug'), item.get('name')),
        })

    ctx.set_valid_count('ligas', len(rows))
    return rows


def normalize_temporadas(ctx: ImportContext, liga_ids: set[str]) -> list[dict[str, Any]]:
    data = read_json(DATA_DIR / 'temporadas.json').get('seasons', [])
    ctx.set_source_count('temporadas', len(data))
    rows: list[dict[str, Any]] = []

    for idx, item in enumerate(data, start=1):
        source_id = normalize_text_id(item.get('id'))
        league_id = normalize_text_id(item.get('league_id'))

        if not source_id:
            ctx.add_error('temporadas', idx, None, 'id ausente')
            continue
        if league_id not in liga_ids:
            ctx.add_error('temporadas', idx, source_id, f'league_id inexistente: {league_id}')
            continue

        slug = normalize_slug(item.get('slug'), item.get('name'))
        row = {
            'id': source_id,
            'liga_id': league_id,
            'nome': normalize_text_id(item.get('name')),
            'slug': slug,
            'ano': int(item.get('year') or 0),
            'semestre': normalize_text_id(item.get('semester')),
            'data_inicio': normalize_text_id(item.get('start_date')),
            'data_fim': normalize_text_id(item.get('end_date')),
            'status': normalize_text_id(item.get('status')) or 'rascunho',
            'descricao': normalize_text_id(item.get('description')) or None,
            'url_banner': normalize_text_id(item.get('banner_url')) or None,
            'criado_em': normalize_text_id(item.get('created_at')) or now_iso(),
            'atualizado_em': normalize_text_id(item.get('updated_at')) or now_iso(),
        }

        if not row['nome']:
            ctx.add_error('temporadas', idx, source_id, 'name ausente')
            continue
        if row['ano'] <= 0:
            ctx.add_error('temporadas', idx, source_id, 'year invalido')
            continue
        if row['semestre'] not in ('apertura', 'clausura'):
            ctx.add_error('temporadas', idx, source_id, f"semester invalido: {row['semestre']}")
            continue

        rows.append(row)
        ctx.add_depara('temporadas', {
            'line': idx,
            'source_id': source_id,
            'target_id': row['id'],
            'source_slug': item.get('slug'),
            'target_slug': slug,
        })

    ctx.set_valid_count('temporadas', len(rows))
    return rows


def normalize_competicoes(ctx: ImportContext, temporada_ids: set[str]) -> list[dict[str, Any]]:
    data = read_json(DATA_DIR / 'competicoes.json').get('competitions', [])
    ctx.set_source_count('competicoes', len(data))
    rows: list[dict[str, Any]] = []

    for idx, item in enumerate(data, start=1):
        source_id = normalize_text_id(item.get('id'))
        season_id = normalize_text_id(item.get('season_id'))

        if not source_id:
            ctx.add_error('competicoes', idx, None, 'id ausente')
            continue
        if season_id not in temporada_ids:
            ctx.add_error('competicoes', idx, source_id, f'season_id inexistente: {season_id}')
            continue

        row = {
            'id': source_id,
            'temporada_id': season_id,
            'nome': normalize_text_id(item.get('name')),
            'slug': normalize_slug(item.get('slug'), item.get('name')),
            'tipo': normalize_text_id(item.get('type')) or 'copa',
            'formato': normalize_text_id(item.get('format')) or 'turno_unico',
            'data_inicio': normalize_text_id(item.get('start_date')) or None,
            'data_fim': normalize_text_id(item.get('end_date')) or None,
            'status': normalize_text_id(item.get('status')) or 'rascunho',
            'ordem': int(item.get('order') or 0),
            'descricao': normalize_text_id(item.get('description')) or None,
            'organizador': normalize_text_id(item.get('organizer')) or None,
            'url_logo': normalize_text_id(item.get('logo_url')) or None,
            'url_banner': normalize_text_id(item.get('banner_url')) or None,
            'criado_em': normalize_text_id(item.get('created_at')) or now_iso(),
            'atualizado_em': normalize_text_id(item.get('updated_at')) or now_iso(),
        }

        if row['tipo'] not in ('campeonato', 'copa', 'playoff'):
            ctx.add_error('competicoes', idx, source_id, f"type invalido: {row['tipo']}")
            continue
        if row['formato'] not in ('turno_unico', 'eliminacao_direta', 'grupos_playoff'):
            ctx.add_error('competicoes', idx, source_id, f"format invalido: {row['formato']}")
            continue

        rows.append(row)
        ctx.add_depara('competicoes', {
            'line': idx,
            'source_id': source_id,
            'target_id': row['id'],
            'source_slug': item.get('slug'),
            'target_slug': row['slug'],
        })

    ctx.set_valid_count('competicoes', len(rows))
    return rows


def normalize_times(ctx: ImportContext) -> list[dict[str, Any]]:
    data = read_json(DATA_DIR / 'times.json').get('teams', [])
    ctx.set_source_count('times', len(data))
    rows: list[dict[str, Any]] = []

    for idx, item in enumerate(data, start=1):
        source_id = normalize_text_id(item.get('id'))
        if not source_id:
            ctx.add_error('times', idx, None, 'id ausente')
            continue

        row = {
            'id': source_id,
            'nome': normalize_text_id(item.get('name')),
            'slug': normalize_slug(item.get('slug'), item.get('name')),
            'nome_curto': normalize_text_id(item.get('abbreviation')) or None,
            'url_logo': normalize_text_id(item.get('logo_url')) or None,
            'url_foto_capa': normalize_text_id(item.get('banner_url')) or None,
            'url_uniforme_titular': normalize_text_id(item.get('logo_url')) or None,
            'cor_primaria': normalize_text_id(item.get('colors')) or None,
            'cor_secundaria': normalize_text_id(item.get('secondary_color')) or None,
            'ano_fundacao': item.get('founded_year'),
            'cidade': normalize_text_id(item.get('city')) or None,
            'alinhamento': None,
            'descricao': normalize_text_id(item.get('description')) or None,
            'historia': normalize_text_id(item.get('description')) or None,
            'origem': normalize_text_id(item.get('state')) or None,
            'ativo': bool(item.get('is_active', True)),
            'criado_em': normalize_text_id(item.get('created_at')) or now_iso(),
            'atualizado_em': normalize_text_id(item.get('updated_at')) or now_iso(),
        }

        if not row['nome']:
            ctx.add_error('times', idx, source_id, 'name ausente')
            continue

        rows.append(row)
        ctx.add_depara('times', {
            'line': idx,
            'source_id': source_id,
            'target_id': row['id'],
            'source_slug': item.get('slug'),
            'target_slug': row['slug'],
        })

    ctx.set_valid_count('times', len(rows))
    return rows


def normalize_jogadores(ctx: ImportContext, time_ids: set[str]) -> list[dict[str, Any]]:
    data = read_json(DATA_DIR / 'jogadores.json').get('players', [])
    ctx.set_source_count('jogadores', len(data))
    rows: list[dict[str, Any]] = []

    for idx, item in enumerate(data, start=1):
        source_id = normalize_text_id(item.get('id'))
        team_id = normalize_text_id(item.get('team_id'))
        if not source_id:
            ctx.add_error('jogadores', idx, None, 'id ausente')
            continue
        if team_id not in time_ids:
            ctx.add_error('jogadores', idx, source_id, f'team_id inexistente: {team_id}')
            continue

        row = {
            'id': source_id,
            'usuario_id': None,
            'nome': normalize_text_id(item.get('name')),
            'apelido': normalize_text_id(item.get('name')) or None,
            'url_foto': normalize_text_id(item.get('avatar_url')) or None,
            'data_nascimento': normalize_text_id(item.get('birth_date')) or None,
            'criado_em': normalize_text_id(item.get('created_at')) or now_iso(),
            'atualizado_em': normalize_text_id(item.get('updated_at')) or now_iso(),
            '_source_team_id': team_id,
            '_source_number': item.get('number'),
            '_source_position': normalize_text_id(item.get('position')) or None,
            '_source_status': normalize_text_id(item.get('status')) or 'active',
            '_source_joined_date': normalize_text_id(item.get('joined_date')) or None,
        }

        if not row['nome']:
            ctx.add_error('jogadores', idx, source_id, 'name ausente')
            continue

        rows.append(row)
        ctx.add_depara('jogadores', {
            'line': idx,
            'source_id': source_id,
            'target_id': row['id'],
            'source_team_id': team_id,
            'target_team_id': team_id,
        })

    ctx.set_valid_count('jogadores', len(rows))
    return rows


def choose_default_season_id(temporadas: list[dict[str, Any]]) -> str | None:
    if not temporadas:
        return None

    by_status = [s for s in temporadas if s.get('status') == 'em_andamento']
    candidates = by_status if by_status else temporadas
    candidates = sorted(candidates, key=lambda s: (s.get('ano', 0), 1 if s.get('semestre') == 'clausura' else 0), reverse=True)
    return candidates[0]['id']


def infer_season_for_player(joined_date: str | None, temporadas: list[dict[str, Any]], fallback_season_id: str | None) -> tuple[str | None, str]:
    date = parse_date(joined_date)
    if date is None:
        return fallback_season_id, 'fallback_sem_data'

    for season in temporadas:
        start = parse_date(season.get('data_inicio'))
        end = parse_date(season.get('data_fim'))
        if start and end and start <= date <= end:
            return season['id'], 'match_por_intervalo'

    return fallback_season_id, 'fallback_fora_intervalo'


def build_registros_jogador(
    ctx: ImportContext,
    jogadores: list[dict[str, Any]],
    temporadas: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    ctx.set_source_count('registros_jogador', len(jogadores))
    rows: list[dict[str, Any]] = []
    fallback = choose_default_season_id(temporadas)

    sorted_temporadas = sorted(temporadas, key=lambda s: (s.get('ano', 0), s.get('semestre', 'apertura')))

    for idx, jogador in enumerate(jogadores, start=1):
        inferred_season_id, rule = infer_season_for_player(jogador.get('_source_joined_date'), sorted_temporadas, fallback)
        if not inferred_season_id:
            ctx.add_error('registros_jogador', idx, jogador['id'], 'nao foi possivel inferir temporada')
            continue

        row = {
            'id': f"reg-{jogador['id']}-{inferred_season_id}",
            'jogador_id': jogador['id'],
            'time_id': jogador['_source_team_id'],
            'temporada_id': inferred_season_id,
            'numero_camisa': int(jogador.get('_source_number') or 0) or None,
            'posicao': jogador.get('_source_position'),
            'ativo': jogador.get('_source_status') != 'inactive',
            'criado_em': jogador['criado_em'],
            'atualizado_em': jogador['atualizado_em'],
        }
        rows.append(row)
        ctx.add_depara('registros_jogador', {
            'line': idx,
            'source_id': jogador['id'],
            'target_id': row['id'],
            'rule': rule,
            'target_temporada_id': inferred_season_id,
        })

    ctx.set_valid_count('registros_jogador', len(rows))
    return rows


def normalize_partidas(
    ctx: ImportContext,
    competicao_ids: set[str],
    time_ids: set[str],
    aliases: dict[str, str],
) -> list[dict[str, Any]]:
    data = read_json(DATA_DIR / 'partidas.json').get('matches', [])
    ctx.set_source_count('partidas', len(data))
    rows: list[dict[str, Any]] = []

    for idx, item in enumerate(data, start=1):
        source_id = normalize_text_id(item.get('id'))
        source_competicao_id = normalize_text_id(item.get('tournament_id'))
        time_casa = normalize_text_id(item.get('home_team_id'))
        time_visitante = normalize_text_id(item.get('away_team_id'))

        if not source_id:
            ctx.add_error('partidas', idx, None, 'id ausente')
            continue
        resolved_competicao_id, used_alias = resolve_competicao_id(source_competicao_id, competicao_ids, aliases)
        if not resolved_competicao_id:
            ctx.add_error('partidas', idx, source_id, f'tournament_id inexistente: {source_competicao_id}')
            continue
        if time_casa not in time_ids or time_visitante not in time_ids:
            ctx.add_error('partidas', idx, source_id, 'time_id inexistente para casa ou visitante')
            continue

        row = {
            'id': source_id,
            'competicao_id': resolved_competicao_id,
            'time_casa_id': time_casa,
            'time_visitante_id': time_visitante,
            'placar_casa': item.get('score_home'),
            'placar_visitante': item.get('score_away'),
            'data_hora': normalize_text_id(item.get('date')),
            'rodada': normalize_text_id(item.get('round')) or 'Rodada',
            'local': normalize_text_id(item.get('location')) or None,
            'status': map_status_partida(item.get('status')),
            'criado_em': normalize_text_id(item.get('created_at')) or now_iso(),
            'atualizado_em': normalize_text_id(item.get('updated_at')) or now_iso(),
        }

        if not row['data_hora']:
            ctx.add_error('partidas', idx, source_id, 'date ausente')
            continue

        rows.append(row)
        ctx.add_depara('partidas', {
            'line': idx,
            'source_id': source_id,
            'target_id': row['id'],
            'source_tournament_id': source_competicao_id,
            'target_competicao_id': resolved_competicao_id,
            'alias_aplicado': used_alias,
        })

    ctx.set_valid_count('partidas', len(rows))
    return rows


def normalize_classificacao(
    ctx: ImportContext,
    competicao_ids: set[str],
    time_ids: set[str],
    aliases: dict[str, str],
) -> list[dict[str, Any]]:
    data = read_json(DATA_DIR / 'standings.json').get('standings', [])
    ctx.set_source_count('classificacao', len(data))
    rows: list[dict[str, Any]] = []

    for idx, item in enumerate(data, start=1):
        source_id = normalize_text_id(item.get('id'))
        source_competicao_id = normalize_text_id(item.get('tournament_id'))
        time_id = normalize_text_id(item.get('team_id'))

        if not source_id:
            ctx.add_error('classificacao', idx, None, 'id ausente')
            continue
        resolved_competicao_id, used_alias = resolve_competicao_id(source_competicao_id, competicao_ids, aliases)
        if not resolved_competicao_id:
            ctx.add_error('classificacao', idx, source_id, f'tournament_id inexistente: {source_competicao_id}')
            continue
        if time_id not in time_ids:
            ctx.add_error('classificacao', idx, source_id, f'team_id inexistente: {time_id}')
            continue

        row = {
            'id': source_id,
            'competicao_id': resolved_competicao_id,
            'time_id': time_id,
            'jogos': int((item.get('wins') or 0) + (item.get('draws') or 0) + (item.get('losses') or 0)),
            'vitorias': int(item.get('wins') or 0),
            'empates': int(item.get('draws') or 0),
            'derrotas': int(item.get('losses') or 0),
            'gols_pro': int(item.get('goals_for') or 0),
            'gols_contra': int(item.get('goals_against') or 0),
            'pontos': int(item.get('points') or 0),
            'atualizado_em': now_iso(),
        }

        rows.append(row)
        ctx.add_depara('classificacao', {
            'line': idx,
            'source_id': source_id,
            'target_id': row['id'],
            'source_tournament_id': source_competicao_id,
            'target_competicao_id': resolved_competicao_id,
            'alias_aplicado': used_alias,
        })

    ctx.set_valid_count('classificacao', len(rows))
    return rows


def normalize_podios(
    ctx: ImportContext,
    competicao_ids: set[str],
    time_ids: set[str],
    aliases: dict[str, str],
) -> list[dict[str, Any]]:
    data = read_json(DATA_DIR / 'podios.json').get('podiums', [])
    ctx.set_source_count('podios', len(data))
    rows: list[dict[str, Any]] = []

    for idx, item in enumerate(data, start=1):
        source_id = normalize_text_id(item.get('id'))
        source_competicao_id = normalize_text_id(item.get('tournament_id'))

        first_id = normalize_text_id((item.get('first_place') or {}).get('team_id')) or None
        second_id = normalize_text_id((item.get('second_place') or {}).get('team_id')) or None
        third_id = normalize_text_id((item.get('third_place') or {}).get('team_id')) or None

        if not source_id:
            ctx.add_error('podios', idx, None, 'id ausente')
            continue
        resolved_competicao_id, used_alias = resolve_competicao_id(source_competicao_id, competicao_ids, aliases)
        if not resolved_competicao_id:
            ctx.add_error('podios', idx, source_id, f'tournament_id inexistente: {source_competicao_id}')
            continue

        invalid_team_refs = [tid for tid in (first_id, second_id, third_id) if tid and tid not in time_ids]
        if invalid_team_refs:
            ctx.add_error('podios', idx, source_id, f'team_id inexistente: {invalid_team_refs}')
            continue

        row = {
            'id': source_id,
            'competicao_id': resolved_competicao_id,
            'time_primeiro_id': first_id,
            'time_segundo_id': second_id,
            'time_terceiro_id': third_id,
            'jogador_artilheiro_id': None,
            'jogador_melhor_id': None,
            'criado_em': now_iso(),
            'atualizado_em': now_iso(),
        }

        rows.append(row)
        ctx.add_depara('podios', {
            'line': idx,
            'source_id': source_id,
            'target_id': row['id'],
            'source_tournament_id': source_competicao_id,
            'target_competicao_id': resolved_competicao_id,
            'alias_aplicado': used_alias,
        })

    ctx.set_valid_count('podios', len(rows))
    return rows


def build_times_temporada(
    ctx: ImportContext,
    competicoes: list[dict[str, Any]],
    partidas: list[dict[str, Any]],
    classificacao: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    comp_to_season = {c['id']: c['temporada_id'] for c in competicoes}
    pairs: set[tuple[str, str]] = set()

    for match in partidas:
        season_id = comp_to_season.get(match['competicao_id'])
        if not season_id:
            continue
        pairs.add((season_id, match['time_casa_id']))
        pairs.add((season_id, match['time_visitante_id']))

    for row in classificacao:
        season_id = comp_to_season.get(row['competicao_id'])
        if not season_id:
            continue
        pairs.add((season_id, row['time_id']))

    rows: list[dict[str, Any]] = []
    for idx, (season_id, team_id) in enumerate(sorted(pairs), start=1):
        row_id = f'tt-{season_id}-{team_id}'
        rows.append({
            'id': row_id,
            'temporada_id': season_id,
            'time_id': team_id,
            'inscrito_em': now_iso(),
        })
        ctx.add_depara('times_temporada', {
            'line': idx,
            'source_id': f'{season_id}:{team_id}',
            'target_id': row_id,
        })

    ctx.set_source_count('times_temporada', len(rows))
    ctx.set_valid_count('times_temporada', len(rows))
    return rows


def normalize_midia(
    ctx: ImportContext,
    ligas: list[dict[str, Any]],
    competicoes: list[dict[str, Any]],
    partidas: list[dict[str, Any]],
    time_ids: set[str],
    aliases: dict[str, str],
) -> list[dict[str, Any]]:
    data = read_json(DATA_DIR / 'midias.json').get('media', [])
    ctx.set_source_count('midia', len(data))
    rows: list[dict[str, Any]] = []

    default_league_id = ligas[0]['id'] if ligas else None
    comp_to_season = {c['id']: c['temporada_id'] for c in competicoes}

    for idx, item in enumerate(data, start=1):
        source_id = normalize_text_id(item.get('id'))
        source_tournament_id = normalize_text_id(item.get('tournament_id')) or None
        team_id = normalize_text_id(item.get('team_id')) or None

        if not source_id:
            ctx.add_error('midia', idx, None, 'id ausente')
            continue
        resolved_tournament_id = None
        used_alias = False
        if source_tournament_id:
            resolved_tournament_id, used_alias = resolve_competicao_id(source_tournament_id, set(comp_to_season.keys()), aliases)
            if not resolved_tournament_id:
                ctx.add_error('midia', idx, source_id, f'tournament_id inexistente: {source_tournament_id}')
                continue
        if team_id and team_id not in time_ids:
            ctx.add_error('midia', idx, source_id, f'team_id inexistente: {team_id}')
            continue
        if not default_league_id:
            ctx.add_error('midia', idx, source_id, 'liga padrao nao encontrada')
            continue

        row = {
            'id': source_id,
            'liga_id': default_league_id,
            'temporada_id': comp_to_season.get(resolved_tournament_id) if resolved_tournament_id else None,
            'partida_id': None,
            'time_id': team_id,
            'tipo': map_tipo_midia(item.get('type')),
            'url': normalize_text_id(item.get('url')),
            'url_thumbnail': normalize_text_id(item.get('thumbnail_url')) or None,
            'legenda': normalize_text_id(item.get('description')) or None,
            'titulo': normalize_text_id(item.get('title')) or None,
            'categoria': 'json',
            'escopo': 'liga',
            'carregado_por': None,
            'criado_em': normalize_text_id(item.get('created_at')) or now_iso(),
        }

        if not row['url']:
            ctx.add_error('midia', idx, source_id, 'url ausente')
            continue

        rows.append(row)
        ctx.add_depara('midia', {
            'line': idx,
            'source_id': source_id,
            'target_id': row['id'],
            'source_tournament_id': source_tournament_id,
            'target_competicao_id': resolved_tournament_id,
            'target_temporada_id': row['temporada_id'],
            'alias_aplicado': used_alias,
        })

    ctx.set_valid_count('midia', len(rows))
    return rows


def normalize_usuarios(ctx: ImportContext) -> list[dict[str, Any]]:
    data = read_json(DATA_DIR / 'usuarios.json').get('users', [])
    ctx.set_source_count('usuarios', len(data))
    rows: list[dict[str, Any]] = []

    for idx, item in enumerate(data, start=1):
        source_id = normalize_text_id(item.get('id'))
        if not is_uuid(source_id):
            ctx.add_error('usuarios', idx, source_id or None, 'id nao e UUID valido para auth.users')
            continue

        row = {
            'id': source_id,
            'nome': normalize_text_id(item.get('name')),
            'email': normalize_text_id(item.get('email')),
            'papel': map_papel_usuario(item.get('role')),
            'url_avatar': normalize_text_id(item.get('avatar_url')) or None,
            'criado_em': normalize_text_id(item.get('created_at')) or now_iso(),
            'atualizado_em': normalize_text_id(item.get('updated_at')) or now_iso(),
        }
        if not row['nome'] or not row['email']:
            ctx.add_error('usuarios', idx, source_id, 'nome ou email ausente')
            continue

        rows.append(row)
        ctx.add_depara('usuarios', {
            'line': idx,
            'source_id': source_id,
            'target_id': source_id,
            'source_role': item.get('role'),
            'target_role': row['papel'],
        })

    ctx.set_valid_count('usuarios', len(rows))
    return rows


def render_upsert_sql(table: str, rows: list[dict[str, Any]], conflict_cols: list[str], columns: list[str]) -> str:
    if not rows:
        return ''

    insert_cols = ', '.join(columns)
    conflict = ', '.join(conflict_cols)
    update_cols = [c for c in columns if c not in conflict_cols]
    set_clause = ', '.join(f'{col} = excluded.{col}' for col in update_cols)

    values_chunks = []
    for row in rows:
        values = ', '.join(escape_sql(row.get(col)) for col in columns)
        values_chunks.append(f'({values})')

    return (
        f'insert into public.{table} ({insert_cols})\n'
        f'values\n  ' + ',\n  '.join(values_chunks) + '\n'
        f'on conflict ({conflict}) do update set\n  {set_clause};\n\n'
    )


def build_sql_script(payload: dict[str, list[dict[str, Any]]]) -> str:
    parts = [
        '-- Marco 2 - Importacao inicial idempotente\n',
        '-- Gerado automaticamente por scripts/import_supabase_marco2.py\n',
        f'-- generated_at: {now_iso()}\n\n',
        'begin;\n\n',
    ]

    parts.append(render_upsert_sql('ligas', payload['ligas'], ['id'], [
        'id', 'nome', 'url_logo', 'cidade', 'criado_em', 'atualizado_em'
    ]))
    parts.append(render_upsert_sql('temporadas', payload['temporadas'], ['id'], [
        'id', 'liga_id', 'nome', 'slug', 'ano', 'semestre', 'data_inicio', 'data_fim', 'status',
        'descricao', 'url_banner', 'criado_em', 'atualizado_em'
    ]))
    parts.append(render_upsert_sql('competicoes', payload['competicoes'], ['id'], [
        'id', 'temporada_id', 'nome', 'slug', 'tipo', 'formato', 'data_inicio', 'data_fim', 'status',
        'ordem', 'descricao', 'organizador', 'url_logo', 'url_banner', 'criado_em', 'atualizado_em'
    ]))
    parts.append(render_upsert_sql('times', payload['times'], ['id'], [
        'id', 'nome', 'slug', 'nome_curto', 'url_logo', 'url_foto_capa', 'url_uniforme_titular',
        'cor_primaria', 'cor_secundaria', 'ano_fundacao', 'cidade', 'alinhamento', 'descricao',
        'historia', 'origem', 'ativo', 'criado_em', 'atualizado_em'
    ]))
    parts.append(render_upsert_sql('times_temporada', payload['times_temporada'], ['id'], [
        'id', 'temporada_id', 'time_id', 'inscrito_em'
    ]))
    parts.append(render_upsert_sql('jogadores', payload['jogadores'], ['id'], [
        'id', 'usuario_id', 'nome', 'apelido', 'url_foto', 'data_nascimento', 'criado_em', 'atualizado_em'
    ]))
    parts.append(render_upsert_sql('registros_jogador', payload['registros_jogador'], ['id'], [
        'id', 'jogador_id', 'time_id', 'temporada_id', 'numero_camisa', 'posicao', 'ativo', 'criado_em', 'atualizado_em'
    ]))
    parts.append(render_upsert_sql('partidas', payload['partidas'], ['id'], [
        'id', 'competicao_id', 'time_casa_id', 'time_visitante_id', 'placar_casa', 'placar_visitante',
        'data_hora', 'rodada', 'local', 'status', 'criado_em', 'atualizado_em'
    ]))
    parts.append(render_upsert_sql('classificacao', payload['classificacao'], ['id'], [
        'id', 'competicao_id', 'time_id', 'jogos', 'vitorias', 'empates', 'derrotas', 'gols_pro',
        'gols_contra', 'pontos', 'atualizado_em'
    ]))
    parts.append(render_upsert_sql('podios', payload['podios'], ['id'], [
        'id', 'competicao_id', 'time_primeiro_id', 'time_segundo_id', 'time_terceiro_id',
        'jogador_artilheiro_id', 'jogador_melhor_id', 'criado_em', 'atualizado_em'
    ]))
    parts.append(render_upsert_sql('midia', payload['midia'], ['id'], [
        'id', 'liga_id', 'temporada_id', 'partida_id', 'time_id', 'tipo', 'url', 'url_thumbnail',
        'legenda', 'titulo', 'categoria', 'escopo', 'carregado_por', 'criado_em'
    ]))

    parts.append('commit;\n')
    return ''.join(parts)


def build_summary(ctx: ImportContext, payload: dict[str, list[dict[str, Any]]]) -> dict[str, Any]:
    entities = sorted(set(ctx.source_counts.keys()) | set(ctx.valid_counts.keys()))
    by_entity: dict[str, Any] = {}

    for entity in entities:
        source = ctx.source_counts.get(entity, 0)
        valid = ctx.valid_counts.get(entity, 0)
        invalid = source - valid
        by_entity[entity] = {
            'source_count': source,
            'valid_count': valid,
            'invalid_count': invalid,
            'planned_destination_count': len(payload.get(entity, [])),
            'source_vs_valid_plus_invalid_ok': source == (valid + invalid),
            'valid_vs_destination_ok': valid == len(payload.get(entity, [])),
        }

    return {
        'generated_at': now_iso(),
        'global': {
            'total_source_records': sum(ctx.source_counts.values()),
            'total_valid_records': sum(ctx.valid_counts.values()),
            'total_invalid_records': len(ctx.errors),
            'all_entities_balanced': all(
                values['source_vs_valid_plus_invalid_ok'] and values['valid_vs_destination_ok']
                for values in by_entity.values()
            ),
        },
        'by_entity': by_entity,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description='Marco 2 - importacao inicial idempotente com de-para e rastreabilidade')
    parser.add_argument('--out-dir', default=str(DEFAULT_OUT_DIR), help='Diretorio de saida dos artefatos')
    args = parser.parse_args()

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    ctx = ImportContext()
    competition_aliases = load_aliases()

    ligas = normalize_ligas(ctx)
    temporadas = normalize_temporadas(ctx, {row['id'] for row in ligas})
    competicoes = normalize_competicoes(ctx, {row['id'] for row in temporadas})
    times = normalize_times(ctx)
    jogadores = normalize_jogadores(ctx, {row['id'] for row in times})
    registros_jogador = build_registros_jogador(ctx, jogadores, temporadas)
    partidas = normalize_partidas(ctx, {row['id'] for row in competicoes}, {row['id'] for row in times}, competition_aliases)
    classificacao = normalize_classificacao(ctx, {row['id'] for row in competicoes}, {row['id'] for row in times}, competition_aliases)
    podios = normalize_podios(ctx, {row['id'] for row in competicoes}, {row['id'] for row in times}, competition_aliases)
    times_temporada = build_times_temporada(ctx, competicoes, partidas, classificacao)
    midia = normalize_midia(ctx, ligas, competicoes, partidas, {row['id'] for row in times}, competition_aliases)
    usuarios = normalize_usuarios(ctx)

    payload = {
        'ligas': ligas,
        'temporadas': temporadas,
        'competicoes': competicoes,
        'times': times,
        'times_temporada': times_temporada,
        'jogadores': jogadores,
        'registros_jogador': registros_jogador,
        'partidas': partidas,
        'classificacao': classificacao,
        'podios': podios,
        'midia': midia,
        'usuarios': usuarios,
    }

    sql_script = build_sql_script(payload)
    (out_dir / 'import_job.sql').write_text(sql_script, encoding='utf-8')

    errors_payload = [error.__dict__ for error in ctx.errors]
    write_json(out_dir / 'import_errors.json', {
        'generated_at': now_iso(),
        'errors': errors_payload,
    })
    write_json(out_dir / 'import_de_para_report.json', {
        'generated_at': now_iso(),
        'entities': ctx.depara,
    })
    write_json(out_dir / 'import_summary.json', build_summary(ctx, payload))
    write_json(out_dir / 'import_aliases_effective.json', {
        'generated_at': now_iso(),
        'competition_ids': competition_aliases,
        'source': str(ALIASES_PATH.relative_to(ROOT)).replace('\\', '/'),
    })

    print('Marco 2 import artifacts generated:')
    print(f' - {out_dir / "import_job.sql"}')
    print(f' - {out_dir / "import_de_para_report.json"}')
    print(f' - {out_dir / "import_errors.json"}')
    print(f' - {out_dir / "import_summary.json"}')
    print(f' - {out_dir / "import_aliases_effective.json"}')

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
