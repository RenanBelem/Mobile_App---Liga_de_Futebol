import { jsonLeagueData } from '@/dados/jsonData';

const STORAGE_JSON_DB = 'lfa_json_route_db_v1';

type JsonDb = typeof jsonLeagueData;

type JsonCollection = keyof JsonDb;

type CollectionItem<K extends JsonCollection> = JsonDb[K] extends Array<infer T> ? T : never;

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const createBaseDb = (): JsonDb => deepClone(jsonLeagueData);

const saveDb = (db: JsonDb) => {
  localStorage.setItem(STORAGE_JSON_DB, JSON.stringify(db));
};

const readDb = (): JsonDb => {
  const raw = localStorage.getItem(STORAGE_JSON_DB);
  if (!raw) {
    const base = createBaseDb();
    saveDb(base);
    return base;
  }

  try {
    const parsed = JSON.parse(raw) as JsonDb;
    return parsed;
  } catch {
    const base = createBaseDb();
    saveDb(base);
    return base;
  }
};

const ensureId = (item: Record<string, unknown>) => {
  if (typeof item.id === 'string' && item.id.trim().length > 0) {
    return item.id;
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const jsonRouteRepository = {
  getDb: (): JsonDb => readDb(),

  resetDb: () => {
    const base = createBaseDb();
    saveDb(base);
    return base;
  },

  get<K extends JsonCollection>(collection: K): Array<CollectionItem<K>> {
    const db = readDb();
    return deepClone(db[collection] as Array<CollectionItem<K>>);
  },

  getById<K extends JsonCollection>(collection: K, id: string): CollectionItem<K> | undefined {
    const items = this.get(collection) as Array<Record<string, unknown>>;
    return items.find((item) => item.id === id) as CollectionItem<K> | undefined;
  },

  post<K extends JsonCollection>(collection: K, payload: Omit<CollectionItem<K>, 'id'> & Partial<{ id: string }>): CollectionItem<K> {
    const db = readDb();
    const items = db[collection] as Array<Record<string, unknown>>;
    const id = ensureId(payload as Record<string, unknown>);
    const created = { ...payload, id } as CollectionItem<K>;

    items.push(created as Record<string, unknown>);
    saveDb(db);
    return deepClone(created);
  },

  put<K extends JsonCollection>(collection: K, id: string, payload: Omit<CollectionItem<K>, 'id'>): CollectionItem<K> | undefined {
    const db = readDb();
    const items = db[collection] as Array<Record<string, unknown>>;
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) {
      return undefined;
    }

    const replaced = { ...payload, id } as CollectionItem<K>;
    items[index] = replaced as Record<string, unknown>;
    saveDb(db);
    return deepClone(replaced);
  },

  patch<K extends JsonCollection>(collection: K, id: string, partial: Partial<Omit<CollectionItem<K>, 'id'>>): CollectionItem<K> | undefined {
    const db = readDb();
    const items = db[collection] as Array<Record<string, unknown>>;
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) {
      return undefined;
    }

    const current = items[index] as CollectionItem<K>;
    const updated = { ...current, ...partial, id } as CollectionItem<K>;
    items[index] = updated as Record<string, unknown>;
    saveDb(db);
    return deepClone(updated);
  },

  delete<K extends JsonCollection>(collection: K, id: string): boolean {
    const db = readDb();
    const items = db[collection] as Array<Record<string, unknown>>;
    const next = items.filter((item) => item.id !== id);

    if (next.length === items.length) {
      return false;
    }

    db[collection] = next as JsonDb[K];
    saveDb(db);
    return true;
  },
};
