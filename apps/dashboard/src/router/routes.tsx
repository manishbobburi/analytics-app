import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './RootLayout';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <h1>Login</h1>,
  },
  {
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),

    errorElement: <h1>Error</h1>,

    children: [
      {
        index: true,
        element: <h1>Dashboard</h1>,
      },
      {
        path: 'events',
        element: <h1>Events</h1>,
      },
      {
        path: 'write-keys',
        element: <h1>Write keys</h1>,
      },
      {
        path: 'settings',
        element: <h1>Settings</h1>,
      },
    ],
  },
  {
    path: '*',
    element: <h1>Not found</h1>,
  },
]);
