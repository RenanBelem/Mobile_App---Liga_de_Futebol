from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import json
import re
import sys
import unicodedata
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
WIKI_DOCS = ROOT / 'wiki-lfa' / 'wiki-lfa-main' / 'docs'
JSON_DIR = ROOT / 'fonte' / 'dados' / 'json'
OUT_DIR = ROOT / 'scripts' / 'out'
RULES_PATH = ROOT / 'scripts' / 'wiki_sync_rules.json'

DEFAULT_RULES: dict[str, Any] = {
    'aliases': {
        'competitions': {},
        'seasons': {},
        'teams': {},
    },
    'allowlist': {
        'competitions': ['name', 'organizer', 'type'],
        'seasons': [],
        'teams': ['description'],
    },
}


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def read_text(path: Path) -> str:
    return path.read_text(encoding='utf-8')


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(read_text(path))


def write_json(path: Path, payload: Any) -> None:
    ensure_dir(path.parent)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def deep_copy_json(payload: Any) -> Any:
    return json.loads(json.dumps(payload, ensure_ascii=False))


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


def slugify(value: str) -> str:
    normalized = unicodedata.normalize('NFKD', value)
    ascii_text = ''.join(ch for ch in normalized if not unicodedata.combining(ch))
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r'[^a-z0-9]+', '-', ascii_text)
    return ascii_text.strip('-')


def strip_html(value: str) -> str:
    text = re.sub(r'<br\s*/?>', ' ', value, flags=re.IGNORECASE)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def extract_heading(text: str) -> str:
    for line in text.splitlines():
        if line.startswith('# '):
            return line[2:].strip()
    return ''


def extract_markdown_table_rows(text: str) -> list[list[str]]:
    rows: list[list[str]] = []
    for line in text.splitlines():
        if not line.strip().startswith('|'):
            continue
        raw_cells = [cell.strip() for cell in line.strip().strip('|').split('|')]
        # skip header separator
        if all(re.fullmatch(r':?-{2,}:?', cell.replace(' ', '')) for cell in raw_cells):
            continue
        rows.append(raw_cells)
    return rows


def clean_markdown_links(value: str) -> str:
    # [Texto](link) -> Texto
    return re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', value)


def normalize_alias_mapping(raw_aliases: dict[str, Any]) -> dict[str, dict[str, str]]:
    normalized: dict[str, dict[str, str]] = {
        'competitions': {},
        'seasons': {},
        'teams': {},
    }
    for entity in normalized:
        entity_map = raw_aliases.get(entity, {})
        if not isinstance(entity_map, dict):
            continue
        normalized[entity] = {
            slugify(str(wiki_slug)): slugify(str(json_slug))
            for wiki_slug, json_slug in entity_map.items()
            if str(wiki_slug).strip() and str(json_slug).strip()
        }
    return normalized


def normalize_allowlist(raw_allowlist: dict[str, Any]) -> dict[str, set[str]]:
    normalized: dict[str, set[str]] = {
        'competitions': set(),
        'seasons': set(),
        'teams': set(),
    }
    for entity in normalized:
        values = raw_allowlist.get(entity, [])
        if isinstance(values, list):
            normalized[entity] = {str(field).strip() for field in values if str(field).strip()}
    return normalized


def load_rules() -> tuple[dict[str, dict[str, str]], dict[str, set[str]], bool]:
    rules = deep_copy_json(DEFAULT_RULES)
    loaded_from_file = False

    if RULES_PATH.exists():
        file_rules = read_json(RULES_PATH)
        if isinstance(file_rules, dict):
            rules['aliases'].update(file_rules.get('aliases', {}))
            rules['allowlist'].update(file_rules.get('allowlist', {}))
            loaded_from_file = True

    aliases = normalize_alias_mapping(rules.get('aliases', {}))
    allowlist = normalize_allowlist(rules.get('allowlist', {}))
    return aliases, allowlist, loaded_from_file


def resolve_target_slug(entity: str, wiki_slug: str, aliases: dict[str, dict[str, str]]) -> tuple[str, bool]:
    normalized = slugify(wiki_slug)
    alias_map = aliases.get(entity, {})
    if normalized in alias_map:
        return alias_map[normalized], True
    return normalized, False


def apply_allowed_changes(
    row: dict[str, Any],
    candidate: dict[str, Any],
    *,
    allowed_fields: set[str],
    entity: str,
) -> dict[str, dict[str, Any]]:
    changes: dict[str, dict[str, Any]] = {}

    for field, new_value in candidate.items():
        if field not in allowed_fields:
            continue
        if new_value is None:
            continue

        old_value = row.get(field)

        # For description, preserve local richer content and fill only empty slots.
        if entity == 'teams' and field == 'description' and old_value not in (None, ''):
            continue

        if old_value != new_value:
            changes[field] = {
                'from': old_value,
                'to': new_value,
            }

    return changes


def normalize_competition_type(raw_type: str) -> str:
    text = slugify(raw_type)
    if 'primeira-divisao' in text or 'campeonato' in text:
        return 'campeonato'
    return 'copa'


def parse_infobox_label_value(text: str, label: str) -> str | None:
    pattern = re.compile(
        rf'<td[^>]*>\s*{re.escape(label)}\s*</td>\s*<td[^>]*>(.*?)</td>',
        flags=re.IGNORECASE | re.DOTALL,
    )
    match = pattern.search(text)
    if not match:
        return None
    value = clean_markdown_links(strip_html(match.group(1)))
    return value or None


@dataclass
class WikiCompetition:
    source_file: str
    name: str
    slug: str
    organizer: str | None
    competition_type: str | None
    editions: int | None


@dataclass
class WikiSeasonRow:
    source_file: str
    season_slug: str
    season_name: str
    competition_name: str
    champion: str | None
    vice: str | None


@dataclass
class WikiTeam:
    source_file: str
    name: str
    slug: str
    founded_year: int | None
    description: str | None


def season_slug_from_path(path: Path) -> tuple[str, str]:
    year = path.parent.name
    stem = path.stem
    if not year.isdigit():
        return stem, stem
    yy = year[-2:]
    slug = f'{stem}-{yy}'
    name = f'{stem.capitalize()} {yy}'
    return slug, name


def parse_wiki_competitions() -> list[WikiCompetition]:
    competitions_dir = WIKI_DOCS / 'campeonatos'
    entries: list[WikiCompetition] = []

    for path in sorted(competitions_dir.glob('*.md')):
        text = read_text(path)
        heading = extract_heading(text)
        if not heading:
            continue

        organizer = parse_infobox_label_value(text, 'Organizador')
        raw_type = parse_infobox_label_value(text, 'Tipo') or ''
        editions_raw = parse_infobox_label_value(text, 'Edições')

        editions = None
        if editions_raw and editions_raw.isdigit():
            editions = int(editions_raw)

        entries.append(
            WikiCompetition(
                source_file=str(path.relative_to(ROOT)).replace('\\', '/'),
                name=heading,
                slug=slugify(heading),
                organizer=organizer,
                competition_type=normalize_competition_type(raw_type) if raw_type else None,
                editions=editions,
            )
        )

    return entries


def parse_wiki_seasons() -> list[WikiSeasonRow]:
    seasons_dir = WIKI_DOCS / 'temporadas'
    entries: list[WikiSeasonRow] = []

    for path in sorted(seasons_dir.glob('*/*.md')):
        text = read_text(path)
        season_slug, season_name = season_slug_from_path(path)
        rows = extract_markdown_table_rows(text)
        if len(rows) < 2:
            continue

        # First row is header for this file structure
        data_rows = rows[1:]
        for row in data_rows:
            if len(row) < 4:
                continue
            competition_name = clean_markdown_links(strip_html(row[0]))
            champion = clean_markdown_links(strip_html(row[1])) if len(row) > 1 else None
            vice = clean_markdown_links(strip_html(row[3])) if len(row) > 3 else None

            entries.append(
                WikiSeasonRow(
                    source_file=str(path.relative_to(ROOT)).replace('\\', '/'),
                    season_slug=slugify(season_slug),
                    season_name=season_name,
                    competition_name=competition_name,
                    champion=champion or None,
                    vice=vice or None,
                )
            )

    return entries


def parse_wiki_teams() -> list[WikiTeam]:
    teams_dir = WIKI_DOCS / 'times'
    entries: list[WikiTeam] = []

    for path in sorted(teams_dir.glob('*.md')):
        text = read_text(path)
        heading = extract_heading(text)
        if not heading:
            continue

        founded_raw = parse_infobox_label_value(text, 'Fundação')
        founded_year = int(founded_raw) if founded_raw and founded_raw.isdigit() else None

        paragraphs = [line.strip() for line in text.splitlines() if line.strip() and not line.startswith('#')]
        description = None
        for line in paragraphs:
            if line.startswith('<') or line.startswith('|'):
                continue
            description = clean_markdown_links(strip_html(line))
            if description:
                break

        entries.append(
            WikiTeam(
                source_file=str(path.relative_to(ROOT)).replace('\\', '/'),
                name=heading,
                slug=slugify(path.stem.replace('_', '-')),
                founded_year=founded_year,
                description=description,
            )
        )

    return entries


def build_wiki_enrichment() -> dict[str, Any]:
    competitions = parse_wiki_competitions()
    seasons = parse_wiki_seasons()
    teams = parse_wiki_teams()

    return {
        'generated_at': now_iso(),
        'source_root': str(WIKI_DOCS.relative_to(ROOT)).replace('\\', '/'),
        'competitions': [entry.__dict__ for entry in competitions],
        'seasons': [entry.__dict__ for entry in seasons],
        'teams': [entry.__dict__ for entry in teams],
    }


def build_validation_report(enrichment: dict[str, Any], aliases: dict[str, dict[str, str]]) -> dict[str, Any]:
    competitions_json = read_json(JSON_DIR / 'competicoes.json').get('competitions', [])
    seasons_json = read_json(JSON_DIR / 'temporadas.json').get('seasons', [])
    teams_json = read_json(JSON_DIR / 'times.json').get('teams', [])

    json_comp_slugs = {slugify(item.get('slug', '')) for item in competitions_json if item.get('slug')}
    json_season_slugs = {slugify(item.get('slug', '')) for item in seasons_json if item.get('slug')}
    json_team_slugs = {slugify(item.get('slug', '')) for item in teams_json if item.get('slug')}

    wiki_comp_slugs = {slugify(item['slug']) for item in enrichment['competitions']}
    wiki_season_slugs = {slugify(item['season_slug']) for item in enrichment['seasons']}
    wiki_team_slugs = {slugify(item['slug']) for item in enrichment['teams']}

    wiki_comp_slugs_with_alias = {
        resolve_target_slug('competitions', item['slug'], aliases)[0]
        for item in enrichment['competitions']
    }
    wiki_season_slugs_with_alias = {
        resolve_target_slug('seasons', item['season_slug'], aliases)[0]
        for item in enrichment['seasons']
    }
    wiki_team_slugs_with_alias = {
        resolve_target_slug('teams', item['slug'], aliases)[0]
        for item in enrichment['teams']
    }

    report = {
        'generated_at': now_iso(),
        'coverage': {
            'competitions': {
                'wiki_total': len(wiki_comp_slugs),
                'json_total': len(json_comp_slugs),
                'matched': len(wiki_comp_slugs & json_comp_slugs),
                'matched_with_aliases': len(wiki_comp_slugs_with_alias & json_comp_slugs),
                'only_in_wiki': sorted(wiki_comp_slugs - json_comp_slugs),
                'only_in_json': sorted(json_comp_slugs - wiki_comp_slugs),
                'only_in_wiki_after_aliases': sorted(wiki_comp_slugs_with_alias - json_comp_slugs),
            },
            'seasons': {
                'wiki_total': len(wiki_season_slugs),
                'json_total': len(json_season_slugs),
                'matched': len(wiki_season_slugs & json_season_slugs),
                'matched_with_aliases': len(wiki_season_slugs_with_alias & json_season_slugs),
                'only_in_wiki': sorted(wiki_season_slugs - json_season_slugs),
                'only_in_json': sorted(json_season_slugs - wiki_season_slugs),
                'only_in_wiki_after_aliases': sorted(wiki_season_slugs_with_alias - json_season_slugs),
            },
            'teams': {
                'wiki_total': len(wiki_team_slugs),
                'json_total': len(json_team_slugs),
                'matched': len(wiki_team_slugs & json_team_slugs),
                'matched_with_aliases': len(wiki_team_slugs_with_alias & json_team_slugs),
                'only_in_wiki': sorted(wiki_team_slugs - json_team_slugs),
                'only_in_json': sorted(json_team_slugs - wiki_team_slugs),
                'only_in_wiki_after_aliases': sorted(wiki_team_slugs_with_alias - json_team_slugs),
            },
        },
        'rules': {
            'rules_file': str(RULES_PATH.relative_to(ROOT)).replace('\\', '/'),
            'aliases_loaded': {
                entity: len(values)
                for entity, values in aliases.items()
            },
        },
    }
    return report


def apply_merge_from_enrichment(
    enrichment: dict[str, Any],
    aliases: dict[str, dict[str, str]],
    allowlist: dict[str, set[str]],
    *,
    dry_run: bool,
) -> dict[str, Any]:
    competitions_path = JSON_DIR / 'competicoes.json'
    seasons_path = JSON_DIR / 'temporadas.json'
    teams_path = JSON_DIR / 'times.json'

    competitions_data = read_json(competitions_path)
    seasons_data = read_json(seasons_path)
    teams_data = read_json(teams_path)

    competition_patch_by_slug: dict[str, dict[str, Any]] = {}
    competition_alias_hits = 0
    for item in enrichment['competitions']:
        resolved_slug, used_alias = resolve_target_slug('competitions', item['slug'], aliases)
        competition_patch_by_slug[resolved_slug] = item
        if used_alias:
            competition_alias_hits += 1

    team_patch_by_slug: dict[str, dict[str, Any]] = {}
    team_alias_hits = 0
    for item in enrichment['teams']:
        resolved_slug, used_alias = resolve_target_slug('teams', item['slug'], aliases)
        team_patch_by_slug[resolved_slug] = item
        if used_alias:
            team_alias_hits += 1

    all_changes: list[dict[str, Any]] = []
    competition_updates = 0
    matched_comp_slugs: set[str] = set()
    for row in competitions_data.get('competitions', []):
        slug = slugify(str(row.get('slug', '')))
        patch = competition_patch_by_slug.get(slug)
        if not patch:
            continue
        matched_comp_slugs.add(slug)

        candidate = {
            'name': patch.get('name'),
            'organizer': patch.get('organizer'),
            'type': patch.get('competition_type'),
        }
        changes = apply_allowed_changes(
            row,
            candidate,
            allowed_fields=allowlist.get('competitions', set()),
            entity='competitions',
        )
        if not changes:
            continue

        if not dry_run:
            for field, payload in changes.items():
                row[field] = payload['to']
            row['updated_at'] = now_iso()
        competition_updates += 1
        all_changes.append(
            {
                'entity': 'competitions',
                'id': row.get('id'),
                'slug': row.get('slug'),
                'wiki_slug': patch.get('slug'),
                'fields': changes,
            }
        )

    season_updates = 0

    team_updates = 0
    matched_team_slugs: set[str] = set()
    for row in teams_data.get('teams', []):
        slug = slugify(str(row.get('slug', '')))
        patch = team_patch_by_slug.get(slug)
        if not patch:
            continue
        matched_team_slugs.add(slug)

        candidate = {
            'name': patch.get('name'),
            'founded_year': patch.get('founded_year'),
            'description': patch.get('description'),
        }
        changes = apply_allowed_changes(
            row,
            candidate,
            allowed_fields=allowlist.get('teams', set()),
            entity='teams',
        )
        if not changes:
            continue

        if not dry_run:
            for field, payload in changes.items():
                row[field] = payload['to']
            row['updated_at'] = now_iso()
        team_updates += 1
        all_changes.append(
            {
                'entity': 'teams',
                'id': row.get('id'),
                'slug': row.get('slug'),
                'wiki_slug': patch.get('slug'),
                'fields': changes,
            }
        )

    if not dry_run:
        write_json(competitions_path, competitions_data)
        write_json(seasons_path, seasons_data)
        write_json(teams_path, teams_data)

    unresolved_competitions = sorted(
        slug
        for slug in competition_patch_by_slug
        if slug not in matched_comp_slugs
    )
    unresolved_teams = sorted(
        slug
        for slug in team_patch_by_slug
        if slug not in matched_team_slugs
    )

    return {
        'dry_run': dry_run,
        'rules_file': str(RULES_PATH.relative_to(ROOT)).replace('\\', '/'),
        'allowlist': {
            entity: sorted(list(fields))
            for entity, fields in allowlist.items()
        },
        'aliases_used': {
            'competitions': competition_alias_hits,
            'teams': team_alias_hits,
        },
        'competitions_updated': competition_updates,
        'seasons_touched': season_updates,
        'teams_updated': team_updates,
        'unresolved_wiki_slugs': {
            'competitions': unresolved_competitions,
            'teams': unresolved_teams,
        },
        'changes': all_changes,
    }


def escape_sql(value: Any) -> str:
    if value is None:
        return 'NULL'
    if isinstance(value, bool):
        return 'TRUE' if value else 'FALSE'
    if isinstance(value, (int, float)):
        return str(value)
    text = str(value).replace("'", "''")
    return f"'{text}'"


def render_upsert_sql(table: str, rows: list[dict[str, Any]], unique_key: str) -> str:
    if not rows:
        return ''

    columns = sorted({key for row in rows for key in row.keys()})
    update_cols = [col for col in columns if col != unique_key]
    statements: list[str] = []

    for row in rows:
        values = [escape_sql(row.get(col)) for col in columns]
        set_clause = ', '.join(f'{col} = EXCLUDED.{col}' for col in update_cols)
        statements.append(
            f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join(values)}) "
            f"ON CONFLICT ({unique_key}) DO UPDATE SET {set_clause};"
        )

    return '\n'.join(statements) + '\n'


def export_upsert_sql() -> Path:
    ensure_dir(OUT_DIR)
    ligas = read_json(JSON_DIR / 'ligas.json').get('leagues', [])
    temporadas = read_json(JSON_DIR / 'temporadas.json').get('seasons', [])
    competicoes = read_json(JSON_DIR / 'competicoes.json').get('competitions', [])

    sql_parts = [
        '-- Auto-generated by scripts/wiki_sync_pipeline.py\n',
        render_upsert_sql('leagues', ligas, 'id'),
        render_upsert_sql('seasons', temporadas, 'id'),
        render_upsert_sql('competitions', competicoes, 'id'),
    ]

    output_path = OUT_DIR / 'supabase_upserts.sql'
    output_path.write_text('\n'.join(sql_parts), encoding='utf-8')
    return output_path


def command_snapshot() -> None:
    ensure_dir(OUT_DIR)
    enrichment = build_wiki_enrichment()
    aliases, _, _ = load_rules()
    report = build_validation_report(enrichment, aliases)

    write_json(JSON_DIR / 'wiki_enrichment.json', enrichment)
    write_json(OUT_DIR / 'wiki_sync_report.json', report)

    print('Snapshot generated:')
    print(f' - {JSON_DIR / "wiki_enrichment.json"}')
    print(f' - {OUT_DIR / "wiki_sync_report.json"}')


def command_merge(*, dry_run: bool) -> None:
    enrichment_path = JSON_DIR / 'wiki_enrichment.json'
    if not enrichment_path.exists():
        print('wiki_enrichment.json not found. Run snapshot first.')
        raise SystemExit(1)

    aliases, allowlist, loaded_from_file = load_rules()
    enrichment = read_json(enrichment_path)
    result = apply_merge_from_enrichment(enrichment, aliases, allowlist, dry_run=dry_run)
    result_path = OUT_DIR / ('wiki_merge_preview.json' if dry_run else 'wiki_merge_result.json')
    write_json(result_path, result)

    print('Merge preview complete:' if dry_run else 'Merge complete:')
    if not loaded_from_file:
        print(f'Rules file not found. Using defaults: {RULES_PATH}')
    else:
        print(f'Rules loaded from: {RULES_PATH}')
    print(f'Result file: {result_path}')
    print(json.dumps(result, ensure_ascii=False, indent=2))


def command_export_upserts() -> None:
    output = export_upsert_sql()
    print(f'Upsert SQL exported: {output}')


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print('Usage: python scripts/wiki_sync_pipeline.py [snapshot|merge|export-upserts] [--dry-run]')
        return 1

    command = argv[1]
    dry_run = '--dry-run' in argv[2:]

    if command == 'snapshot':
        command_snapshot()
        return 0
    if command == 'merge':
        command_merge(dry_run=dry_run)
        return 0
    if command == 'export-upserts':
        command_export_upserts()
        return 0

    print(f'Unknown command: {command}')
    return 1


if __name__ == '__main__':
    raise SystemExit(main(sys.argv))
