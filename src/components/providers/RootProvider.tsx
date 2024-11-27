'use client';

import { DataProvider } from '@/contexts/DataContext';
import { ToastContainer } from '@/components/ui/ToastContainer';

interface RootProviderProps {
  children: React.ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <DataProvider>
      {children}
      <ToastContainer />
    </DataProvider>
  );
}
