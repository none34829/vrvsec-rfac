'use client';

import { useToast } from './toast';

export function ToastContainer() {
  const { ToastContainer: Container } = useToast();
  return <Container />;
}
