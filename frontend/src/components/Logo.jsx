import React from 'react';
import { MarginIcon } from '@/new-components';

function Logo({ className = '', showText = true, size = 'default' }) {
  const iconSizes = {
    sm: 'size-7',
    default: 'size-8',
    lg: 'size-9',
    xl: 'size-10',
  };

  const textSizes = {
    sm: 'text-lg',
    default: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <MarginIcon
        className={`${iconSizes[size] || iconSizes.default} shrink-0 transition-transform hover:scale-105`}
      />

      {showText && (
        <span
          className={`font-['Inter',sans-serif] italic ${textSizes[size] || textSizes.default} pr-1 font-normal text-zinc-900 select-none dark:text-zinc-50`}
        >
          Margin
        </span>
      )}
    </div>
  );
}

export default Logo;
