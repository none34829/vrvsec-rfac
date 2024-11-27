'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/lib/animations';

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
  const Component = asButton ? motion.button : motion.span;
  
  return (
    <Component
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      whileHover={{ scale: 1.05 }}
      whileTap={asButton ? { scale: 0.95 } : undefined}
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
