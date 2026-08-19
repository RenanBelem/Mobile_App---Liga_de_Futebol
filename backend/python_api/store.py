from __future__ import annotations

from pathlib import Path
from threading import RLock
from typing import Any
import json
import time

ROOT = Path(__file__).resolve().parents[2]
JSON_DIR = ROOT / 'fonte' / 'dados' / 'json'
RUNTIME_DB_PATH = ROOT / 'scripts' / 'out' / 'runtime' / 'json_route_db.json'

COLLECTION_MAP: dict[str, tuple[str, str]] = {
    'leagues': ('ligas.json', 'leagues'),
    'seasons': ('temporadas.json', 'seasons'),
    'competitions': ('competicoes.json', 'competitions'),
    'teams': ('times.json', 'teams'),
    'players': ('jogadores.json', 'players'),
    'tournaments': ('torneios.json', 'tournaments'),
    'matches': ('partidas.json', 'matches'),
    'matchEvents': ('eventos_partida.json', 'match_events'),
    'media': ('midias.json', 'media'),
    'users': ('usuarios.json', 'users'),
    'podiums': ('podios.json', 'podiums'),
    'standings': ('standings.json', 'standings'),
}


class JsonRouteStore:
    def __init__(self) -> None:
        self._lock = RLock()

    def _read_json_file(self, path: Path) -> dict[str, Any]:
        return json.loads(path.read_text(encoding='utf-8'))

    def _write_json_file(self, path: Path, payload: Any) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    def _create_base_db(self) -> dict[str, list[dict[str, Any]]]:
        db: dict[str, list[dict[str, Any]]] = {}
        for collection, (filename, root_key) in COLLECTION_MAP.items():
            payload = self._read_json_file(JSON_DIR / filename)
            rows = payload.get(root_key, [])
            db[collection] = rows if isinstance(rows, list) else []
        return db

    def read_db(self) -> dict[str, list[dict[str, Any]]]:
        with self._lock:
            if not RUNTIME_DB_PATH.exists():
                base = self._create_base_db()
                self._write_json_file(RUNTIME_DB_PATH, base)
                return base

            try:
                payload = self._read_json_file(RUNTIME_DB_PATH)
                if not isinstance(payload, dict):
                    raise ValueError('Invalid runtime database')
                return payload
            except Exception:
                base = self._create_base_db()
                self._write_json_file(RUNTIME_DB_PATH, base)
                return base

    def write_db(self, db: dict[str, list[dict[str, Any]]]) -> None:
        with self._lock:
            self._write_json_file(RUNTIME_DB_PATH, db)

    def replace_db(self, db: dict[str, list[dict[str, Any]]]) -> dict[str, list[dict[str, Any]]]:
        with self._lock:
            self.write_db(db)
            return db

    def reset_db(self) -> dict[str, list[dict[str, Any]]]:
        base = self._create_base_db()
        self.write_db(base)
        return base

    def list_rows(self, collection: str) -> list[dict[str, Any]]:
        db = self.read_db()
        rows = db.get(collection, [])
        return rows if isinstance(rows, list) else []

    def get_row(self, collection: str, item_id: str) -> dict[str, Any] | None:
        rows = self.list_rows(collection)
        for row in rows:
            if str(row.get('id')) == item_id:
                return row
        return None

    def _ensure_id(self, payload: dict[str, Any]) -> str:
        value = str(payload.get('id') or '').strip()
        if value:
            return value
        return str(int(time.time() * 1000))

    def insert_row(self, collection: str, payload: dict[str, Any]) -> dict[str, Any]:
        db = self.read_db()
        rows = db.get(collection, [])
        if not isinstance(rows, list):
            rows = []
            db[collection] = rows

        created = dict(payload)
        created['id'] = self._ensure_id(created)
        rows.append(created)
        self.write_db(db)
        return created

    def put_row(self, collection: str, item_id: str, payload: dict[str, Any]) -> dict[str, Any] | None:
        db = self.read_db()
        rows = db.get(collection, [])
        if not isinstance(rows, list):
            return None

        for index, row in enumerate(rows):
            if str(row.get('id')) != item_id:
                continue
            replaced = dict(payload)
            replaced['id'] = item_id
            rows[index] = replaced
            self.write_db(db)
            return replaced

        return None

    def patch_row(self, collection: str, item_id: str, payload: dict[str, Any]) -> dict[str, Any] | None:
        db = self.read_db()
        rows = db.get(collection, [])
        if not isinstance(rows, list):
            return None

        for index, row in enumerate(rows):
            if str(row.get('id')) != item_id:
                continue
            updated = dict(row)
            updated.update(payload)
            updated['id'] = item_id
            rows[index] = updated
            self.write_db(db)
            return updated

        return None

    def delete_row(self, collection: str, item_id: str) -> bool:
        db = self.read_db()
        rows = db.get(collection, [])
        if not isinstance(rows, list):
            return False

        next_rows = [row for row in rows if str(row.get('id')) != item_id]
        if len(next_rows) == len(rows):
            return False

        db[collection] = next_rows
        self.write_db(db)
        return True
