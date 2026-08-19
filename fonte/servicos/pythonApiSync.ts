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

export const startPythonApiSyncPolling = (intervalMs = 3000) => {
  if (!isPythonApiEnabled()) {
    return () => undefined;
  }

  let cancelled = false;
  let inFlight = false;

  const tick = async () => {
    if (cancelled || inFlight) {
      return;
    }

    inFlight = true;
    try {
      await syncJsonDbFromPythonApi();
    } catch {
      // Best-effort polling: keep app running with local cache if API is unavailable.
    } finally {
      inFlight = false;
    }
  };

  const timerId = window.setInterval(() => {
    void tick();
  }, intervalMs);

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      void tick();
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  void tick();

  return () => {
    cancelled = true;
    window.clearInterval(timerId);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
};
