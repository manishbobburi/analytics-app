import type { ReactNode } from 'react';

import { AuthBrandPanel } from './AuthBrandPanel';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-svh">
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Form */}
        <section className="flex min-h-svh flex-col p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </section>

        {/* Branding */}
        <AuthBrandPanel />
      </div>
    </main>
  );
}
