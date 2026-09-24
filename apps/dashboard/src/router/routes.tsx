import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './RootLayout';
import ProtectedRoute from './ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { Dashboard } from '@/pages/Dashboard';
import { EventsPage } from '@/pages/Events';
import { WriteKeysPage } from '@/pages/WriteKeys';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'events',
            element: <EventsPage />,
          },
          {
            path: 'write-keys',
            element: <WriteKeysPage />,
          },
        ],
      },
      {
        path: '*',
        element: <h1>Not found</h1>,
      },
    ],
  },
]);
