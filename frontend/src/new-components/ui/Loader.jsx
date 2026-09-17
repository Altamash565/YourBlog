import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({ className, ...props }) {
  return (
    <Loader2
      className={cn('text-muted-foreground h-6 w-6 animate-spin', className)}
      {...props}
    />
  );
}

export function Loading({ className, ...props }) {
  return (
    <div
      className={cn(
        'flex min-h-[60vh] w-full flex-1 items-center justify-center',
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
