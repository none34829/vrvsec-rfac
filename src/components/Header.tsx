'use client';

import Link from 'next/link';
import { Button } from './ui/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">VRV Security</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Help
          </Button>
          <Button variant="ghost" size="sm">
            Settings
          </Button>
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        </div>
      </div>
    </header>
  );
}
