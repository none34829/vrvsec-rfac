import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { scaleIn } from '@/lib/animations';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
