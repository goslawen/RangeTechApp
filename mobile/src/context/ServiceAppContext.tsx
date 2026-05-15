import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {ApiHealth, fetchApiHealth} from '../api/client';

type ServiceAppContextValue = {
  health: ApiHealth | null;
  isLoading: boolean;
  error: string | null;
  refreshHealth: () => Promise<void>;
};

const ServiceAppContext = createContext<ServiceAppContextValue | undefined>(
  undefined,
);

export function ServiceAppProvider({
  children,
}: PropsWithChildren): React.JSX.Element {
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setHealth(await fetchApiHealth());
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      health,
      isLoading,
      error,
      refreshHealth,
    }),
    [error, health, isLoading, refreshHealth],
  );

  return (
    <ServiceAppContext.Provider value={value}>
      {children}
    </ServiceAppContext.Provider>
  );
}

export function useServiceApp(): ServiceAppContextValue {
  const context = useContext(ServiceAppContext);

  if (!context) {
    throw new Error('useServiceApp must be used inside ServiceAppProvider');
  }

  return context;
}
