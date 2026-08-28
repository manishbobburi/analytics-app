import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/toast';

export default function RootLayout() {
  return (
    <>
      <AppLayout />
      <Toaster />
    </>
  );
}
