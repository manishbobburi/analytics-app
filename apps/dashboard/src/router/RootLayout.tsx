import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toast';

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
