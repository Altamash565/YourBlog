import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
        secondary:
          'border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
        destructive:
          'border-transparent bg-red-500 text-white hover:bg-red-600 dark:bg-red-900 dark:text-red-100',
        outline: 'border-zinc-200 text-zinc-800 dark:border-zinc-800 dark:text-zinc-200',
        accent:
          'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300',
        topic:
          'border-transparent bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 cursor-pointer px-3.5 py-1.5 text-xs rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
