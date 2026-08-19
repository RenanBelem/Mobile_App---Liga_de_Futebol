from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .store import COLLECTION_MAP, JsonRouteStore

app = FastAPI(title='LFA JSON API', version='0.1.0')
store = JsonRouteStore()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


def assert_collection(collection: str) -> None:
    if collection not in COLLECTION_MAP:
        raise HTTPException(status_code=404, detail=f'Collection not found: {collection}')


@app.get('/api/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}


@app.get('/api/db')
def get_db() -> dict[str, list[dict[str, Any]]]:
    return store.read_db()


@app.put('/api/db')
def replace_db(payload: dict[str, list[dict[str, Any]]]) -> dict[str, list[dict[str, Any]]]:
    return store.replace_db(payload)


@app.post('/api/db/reset')
def reset_db() -> dict[str, list[dict[str, Any]]]:
    return store.reset_db()


@app.get('/api/{collection}')
def list_collection(collection: str) -> list[dict[str, Any]]:
    assert_collection(collection)
    return store.list_rows(collection)


@app.get('/api/{collection}/{item_id}')
def get_collection_item(collection: str, item_id: str) -> dict[str, Any]:
    assert_collection(collection)
    item = store.get_row(collection, item_id)
    if not item:
        raise HTTPException(status_code=404, detail='Item not found')
    return item


@app.post('/api/{collection}')
def insert_collection_item(collection: str, payload: dict[str, Any]) -> dict[str, Any]:
    assert_collection(collection)
    return store.insert_row(collection, payload)


@app.put('/api/{collection}/{item_id}')
def replace_collection_item(collection: str, item_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    assert_collection(collection)
    updated = store.put_row(collection, item_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail='Item not found')
    return updated


@app.patch('/api/{collection}/{item_id}')
def patch_collection_item(collection: str, item_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    assert_collection(collection)
    updated = store.patch_row(collection, item_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail='Item not found')
    return updated


@app.delete('/api/{collection}/{item_id}')
def delete_collection_item(collection: str, item_id: str) -> dict[str, bool]:
    assert_collection(collection)
    deleted = store.delete_row(collection, item_id)
    return {'deleted': deleted}
