# Python JSON API (Camada de Migracao)

Esta API expõe leitura e escrita dos dados da liga via HTTP usando os mesmos JSONs da aplicação.

## Objetivo

- Centralizar leitura/escrita em Python para facilitar a migração para backend real.
- Manter o frontend com contrato próximo da futura camada de API.

## Instalação

```bash
python -m pip install -r backend/python_api/requirements.txt
```

## Executar

```bash
python -m uvicorn backend.python_api.main:app --reload --host 127.0.0.1 --port 8000
```

Ou via npm script:

```bash
npm run dev:py-api
```

## Endpoints principais

- GET /api/health
- GET /api/db
- PUT /api/db
- POST /api/db/reset
- GET /api/{collection}
- GET /api/{collection}/{id}
- POST /api/{collection}
- PUT /api/{collection}/{id}
- PATCH /api/{collection}/{id}
- DELETE /api/{collection}/{id}

## Persistência

- Base inicial: fonte/dados/json/*.json
- Runtime mutável: scripts/out/runtime/json_route_db.json

A API nunca sobrescreve os JSONs estáticos de origem durante o runtime.
