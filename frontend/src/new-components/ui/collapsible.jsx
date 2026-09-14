import * as React from 'react';
import { Collapsible } from 'radix-ui';
import { cn } from '@/lib/utils';

const CollapsibleRoot = Collapsible.Root;
const CollapsibleTrigger = Collapsible.Trigger;

function CollapsibleContent({ className, ...props }) {
  return (
    <Collapsible.Content
      className={cn(
        'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden transition-all',
        className
      )}
      {...props}
    />
  );
}

export { CollapsibleRoot as Collapsible, CollapsibleTrigger, CollapsibleContent };
