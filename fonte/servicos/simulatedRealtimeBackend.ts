import { jsonLeagueData } from '@/dados/jsonData';
import { jsonRouteRepository } from '@/servicos/jsonRouteRepository';

type JsonDb = typeof jsonLeagueData;

type Collection = keyof JsonDb;

type CollectionItem<K extends Collection> = JsonDb[K] extends Array<infer T> ? T : never;

type ChangeType = 'INSERT' | 'UPDATE' | 'DELETE';

type ChangePayload<K extends Collection> = {
  table: K;
  type: ChangeType;
  newRecord?: CollectionItem<K>;
  oldRecord?: CollectionItem<K>;
};

type Unsubscribe = () => void;

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const notifyCollectionChange = <K extends Collection>(payload: ChangePayload<K>) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent('lfa:collection-change', { detail: payload }));
};

export const simulatedRealtimeBackend = {
  from<K extends Collection>(table: K) {
    return {
      select: (): Array<CollectionItem<K>> => jsonRouteRepository.get(table),

      insert: (payload: Omit<CollectionItem<K>, 'id'> & Partial<{ id: string }>) => {
        const created = jsonRouteRepository.post(table, payload as Omit<CollectionItem<K>, 'id'> & Partial<{ id: string }>);
        notifyCollectionChange<K>({ table, type: 'INSERT', newRecord: deepClone(created) });
        return created;
      },

      update: (id: string, payload: Omit<CollectionItem<K>, 'id'>) => {
        const previous = jsonRouteRepository.getById(table, id);
        const updated = jsonRouteRepository.put(table, id, payload);
        if (updated) {
          notifyCollectionChange<K>({
            table,
            type: 'UPDATE',
            oldRecord: previous ? deepClone(previous) : undefined,
            newRecord: deepClone(updated),
          });
        }
        return updated;
      },

      patch: (id: string, payload: Partial<Omit<CollectionItem<K>, 'id'>>) => {
        const previous = jsonRouteRepository.getById(table, id);
        const updated = jsonRouteRepository.patch(table, id, payload);
        if (updated) {
          notifyCollectionChange<K>({
            table,
            type: 'UPDATE',
            oldRecord: previous ? deepClone(previous) : undefined,
            newRecord: deepClone(updated),
          });
        }
        return updated;
      },

      delete: (id: string) => {
        const previous = jsonRouteRepository.getById(table, id);
        const removed = jsonRouteRepository.delete(table, id);
        if (removed) {
          notifyCollectionChange<K>({
            table,
            type: 'DELETE',
            oldRecord: previous ? deepClone(previous) : undefined,
          });
        }
        return removed;
      },

      subscribe: (callback: (rows: Array<CollectionItem<K>>) => void): Unsubscribe => {
        const emit = () => callback(jsonRouteRepository.get(table));

        emit();

        const unsubDb = jsonRouteRepository.subscribe(emit);

        const onCollectionChange = (event: Event) => {
          const customEvent = event as CustomEvent<ChangePayload<K>>;
          if (customEvent.detail?.table === table) {
            emit();
          }
        };

        if (typeof window !== 'undefined') {
          window.addEventListener('lfa:collection-change', onCollectionChange as EventListener);
        }

        return () => {
          unsubDb();
          if (typeof window !== 'undefined') {
            window.removeEventListener('lfa:collection-change', onCollectionChange as EventListener);
          }
        };
      },
    };
  },

  channel: (table: Collection) => ({
    on: (
      _event: 'postgres_changes',
      callback: (payload: { table: Collection; eventType: ChangeType }) => void,
    ) => {
      const unsubscribe = jsonRouteRepository.subscribe(() => {
        callback({ table, eventType: 'UPDATE' });
      });

      return {
        subscribe: () => ({ unsubscribe }),
      };
    },
  }),
};

export type { Collection, CollectionItem, ChangePayload, ChangeType, Unsubscribe };
