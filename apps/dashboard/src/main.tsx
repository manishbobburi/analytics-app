import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/features/auth/auth-provider';
import { queryClient } from '@/lib/query-client.ts';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AppRouter } from '@/router';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="clickstream-theme-pref">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
