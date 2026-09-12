import React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/80',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
