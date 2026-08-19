import { jsonRouteRepository } from '@/servicos/jsonRouteRepository';

type JsonDb = ReturnType<typeof jsonRouteRepository.getDb>;

const resolveApiBaseUrl = () => import.meta.env.VITE_PYTHON_API_URL ?? 'http://localhost:8000/api';

export const isPythonApiEnabled = () => import.meta.env.VITE_USE_PYTHON_API === 'true';

export const syncJsonDbFromPythonApi = async (): Promise<JsonDb | null> => {
  if (!isPythonApiEnabled()) {
    return null;
  }

  const response = await fetch(`${resolveApiBaseUrl()}/db`);
  if (!response.ok) {
    throw new Error(`Failed to sync database: ${response.status}`);
  }

  const db = (await response.json()) as JsonDb;
  jsonRouteRepository.setDb(db);
  return db;
};
