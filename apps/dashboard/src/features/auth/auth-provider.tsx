import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { bootstrapAuth } from './hooks';
import { registerAuthFailureHandler } from '@/lib/api';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  isAuthenticated: boolean;
  setAuthenticated: () => void;
  setUnauthenticated: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const authenticated = await bootstrapAuth();

      if (!mounted) {
        return;
      }

      setStatus(authenticated ? 'authenticated' : 'unauthenticated');
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    registerAuthFailureHandler(() => {
      setStatus('unauthenticated');
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        status,
        isAuthenticated: status === 'authenticated',
        setAuthenticated: () => setStatus('authenticated'),
        setUnauthenticated: () => setStatus('unauthenticated'),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
