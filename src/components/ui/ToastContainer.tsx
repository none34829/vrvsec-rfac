'use client';

import { useToast } from './Toast';

export function ToastContainer() {
  const { ToastContainer: Container } = useToast();
  return <Container />;
}
