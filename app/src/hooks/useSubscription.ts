import { useCallback, useEffect, useMemo, useState } from 'react';
import { storage } from '../lib/storage';
import { Client, createClient } from 'graphql-ws';
import { ASTNode, print } from 'graphql';
import { env } from '../lib/env';

type Request<V> = {
  query: ASTNode;
  variables?: V extends Record<string, unknown> ? V : undefined;
};

type ConnectionParams = {
  Authorization?: string;
  isStatus: boolean;
  isTracking: boolean;
};

type Params<T, V> = {
  request: Request<V>;
  connectionParams: ConnectionParams;
  onData?: (data: T | null) => void;
  onError?: (error: unknown) => void;
  enabled?: boolean;
  enableLog?: boolean;
};

type HookReturn<T> = {
  data: T | null;
  client: Client;
  subscription: () => void;
};

export function useSubscription<T, V = unknown>({
  request,
  connectionParams,
  onData,
  onError,
  enabled = true,
  enableLog = false,
}: Params<T, V>): HookReturn<T> {
  const [data, setData] = useState<T | null>(null);

  const client = useMemo(() => {
    return createClient({
      url: env.SUBS_API_URL,
      connectionParams: () => ({
        Authorization:
          connectionParams.Authorization ||
          `Bearer ${storage.getString('token')}`,
        isStatus: connectionParams.isStatus,
        isTracking: connectionParams.isTracking,
      }),
      keepAlive: 30000,
      connectionAckWaitTimeout: 10000,
      retryAttempts: 100,
      lazy: false,
      shouldRetry: () => true,
    });
  }, [connectionParams]);

  const subscription = useCallback(() => {
    if (!enabled) return;
    const unsub = client.subscribe<T>(
      {
        query: print(request.query),
        variables: request.variables,
      },
      {
        next: (result) => {
          if (result && result.data) {
            if (enableLog) {
              console.info('Resultado da subscription', result.data);
            }
            setData(result.data);
            if (onData) {
              onData(result.data);
            }
            return;
          }
          if (result && result.errors !== undefined) {
            console.error('erro', result.errors);
          }
        },
        error: (error) => {
          // TODO: adicionar erro de autorização.
          if (onError) {
            onError(error);
          }
          console.error('error', error);
        },
        complete: () => {
          // console.log('complete');
        },
      }
    );
    return unsub;
  }, [client, request, enabled]);

  useEffect(() => {
    if (!request || !request.query || !enabled) return;
    const unsub = subscription();
    return () => {
      unsub!();
    };
  }, [request, client, subscription, enabled]);

  return {
    data,
    client,
    subscription,
  };
}
