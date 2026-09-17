import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({ className, ...props }) {
  return (
    <Loader2
      className={cn('h-6 w-6 animate-spin text-muted-foreground', className)}
      {...props}
    />
  );
}

export function Loading({ className, ...props }) {
  return (
    <div
      className={cn(
        'flex flex-1 w-full min-h-[60vh] items-center justify-center',
        className
      )}
      {...props}
    >
      <Spinner />
    </div>
  );
}

export const Loader = Loading;
export default Loading;
