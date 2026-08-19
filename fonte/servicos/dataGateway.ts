import { simulatedRealtimeBackend } from '@/servicos/simulatedRealtimeBackend';
import { syncJsonDbFromPythonApi, isPythonApiEnabled } from '@/servicos/pythonApiSync';

type Collection = Parameters<typeof simulatedRealtimeBackend.from>[0];

type CollectionRows<K extends Collection> = ReturnType<ReturnType<typeof simulatedRealtimeBackend.from<K>>['select']>;
type CollectionItem<K extends Collection> = CollectionRows<K>[number];

const resolveApiBaseUrl = () => import.meta.env.VITE_PYTHON_API_URL ?? 'http://localhost:8000/api';

const fetchJson = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

export const dataGateway = {
  list: async <K extends Collection>(collection: K): Promise<Array<CollectionItem<K>>> => {
    if (!isPythonApiEnabled()) {
      return simulatedRealtimeBackend.from(collection).select() as Array<CollectionItem<K>>;
    }

    return fetchJson<Array<CollectionItem<K>>>(`${resolveApiBaseUrl()}/${collection}`);
  },

  getById: async <K extends Collection>(collection: K, id: string): Promise<CollectionItem<K> | undefined> => {
    if (!isPythonApiEnabled()) {
      return simulatedRealtimeBackend.from(collection).select().find((row) => String((row as { id?: string }).id) === id) as CollectionItem<K> | undefined;
    }

    const response = await fetch(`${resolveApiBaseUrl()}/${collection}/${id}`);
    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as CollectionItem<K>;
  },

  insert: async <K extends Collection>(collection: K, payload: Omit<CollectionItem<K>, 'id'> & Partial<{ id: string }>): Promise<CollectionItem<K>> => {
    if (!isPythonApiEnabled()) {
      return simulatedRealtimeBackend.from(collection).insert(payload) as CollectionItem<K>;
    }

    const created = await fetchJson<CollectionItem<K>>(`${resolveApiBaseUrl()}/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    await syncJsonDbFromPythonApi();
    return created;
  },

  put: async <K extends Collection>(collection: K, id: string, payload: Omit<CollectionItem<K>, 'id'>): Promise<CollectionItem<K> | undefined> => {
    if (!isPythonApiEnabled()) {
      return simulatedRealtimeBackend.from(collection).update(id, payload) as CollectionItem<K> | undefined;
    }

    const response = await fetch(`${resolveApiBaseUrl()}/${collection}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const updated = (await response.json()) as CollectionItem<K>;
    await syncJsonDbFromPythonApi();
    return updated;
  },

  patch: async <K extends Collection>(collection: K, id: string, payload: Partial<Omit<CollectionItem<K>, 'id'>>): Promise<CollectionItem<K> | undefined> => {
    if (!isPythonApiEnabled()) {
      return simulatedRealtimeBackend.from(collection).patch(id, payload) as CollectionItem<K> | undefined;
    }

    const response = await fetch(`${resolveApiBaseUrl()}/${collection}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const updated = (await response.json()) as CollectionItem<K>;
    await syncJsonDbFromPythonApi();
    return updated;
  },

  remove: async <K extends Collection>(collection: K, id: string): Promise<boolean> => {
    if (!isPythonApiEnabled()) {
      return simulatedRealtimeBackend.from(collection).delete(id);
    }

    const result = await fetchJson<{ deleted: boolean }>(`${resolveApiBaseUrl()}/${collection}/${id}`, {
      method: 'DELETE',
    });

    if (result.deleted) {
      await syncJsonDbFromPythonApi();
    }

    return result.deleted;
  },
};
