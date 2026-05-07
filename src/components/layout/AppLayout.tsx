import type { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { Footer } from './Footer';

interface Props {
  children: ReactNode;
}

export function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary">
      <TopNav />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Subtle animated grid backdrop, behind content */}
        <div className="pointer-events-none fixed inset-0 grid-bg grid-bg-animated opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <div className="relative px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
