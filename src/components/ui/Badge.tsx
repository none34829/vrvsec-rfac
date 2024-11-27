'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  asButton?: boolean;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

export function Badge({ 
  variant = 'default', 
  children, 
  className,
  onClick,
  asButton = false
}: BadgeProps) {
  const Component = asButton ? 'button' : 'span';
  
  return (
    <Component
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      type={asButton ? 'button' : undefined}
    >
      {children}
    </Component>
  );
}
