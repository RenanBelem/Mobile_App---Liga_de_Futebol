import { useEffect, useMemo, useState } from 'react';
import { jsonRouteRepository } from '@/servicos/jsonRouteRepository';
import { simulatedRealtimeBackend, type Collection, type CollectionItem } from '@/servicos/simulatedRealtimeBackend';

export const useRealtimeCollection = <K extends Collection>(table: K) => {
  const [rows, setRows] = useState<Array<CollectionItem<K>>>(() => simulatedRealtimeBackend.from(table).select());

  useEffect(() => {
    const unsubscribe = simulatedRealtimeBackend.from(table).subscribe((nextRows) => {
      setRows(nextRows);
    });

    return unsubscribe;
  }, [table]);

  return useMemo(() => rows, [rows]);
};

export const useJsonDbVersion = () => {
  const [version, setVersion] = useState(() => Date.now());

  useEffect(() => {
    const unsubscribe = jsonRouteRepository.subscribe(() => {
      setVersion(Date.now());
    });

    return unsubscribe;
  }, []);

  return version;
};
