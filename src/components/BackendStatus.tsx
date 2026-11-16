import { useEffect, useState } from 'react';

type BackendState = 'checking' | 'online' | 'offline';

interface HealthResponse {
  backend?: string;
  generator?: string;
}

export function BackendStatus() {
  const [status, setStatus] = useState<BackendState>('checking');
  const [generator, setGenerator] = useState('not_connected');

  useEffect(() => {
    const controller = new AbortController();

    async function checkBackend() {
      try {
        const response = await fetch('/api/health', {
          signal: controller.signal,
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('Backend nicht erreichbar');
        }

        const data: HealthResponse = await response.json();

        if (!controller.signal.aborted) {
          setStatus(
            data.backend === 'online' ? 'online' : 'offline'
          );
          setGenerator(data.generator ?? 'not_connected');
        }
      } catch {
        if (!controller.signal.aborted) {
          setStatus('offline');
        }
      }
    }

    void checkBackend();

    return () => controller.abort();
  }, []);

  const message =
    status === 'checking'
      ? 'Backend wird geprüft'
      : status === 'offline'
        ? 'Backend offline'
        : generator === 'not_connected'
          ? 'Backend online – KI noch nicht verbunden'
          : 'Backend online – KI-Status: ' + generator;

  return (
    <div
      role="status"
      className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
    >
      <span
        className={`h-2 w-2 rounded-full ${
          status === 'online'
            ? 'bg-green-500'
            : status === 'offline'
              ? 'bg-red-500'
              : 'bg-amber-500'
        }`}
      />

      <span>{message}</span>
    </div>
  );
}
