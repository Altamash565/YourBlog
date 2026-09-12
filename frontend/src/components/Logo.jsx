import React from 'react';

function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Editorial Ink-Quill Minimalist Icon */}
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm transition-transform hover:scale-105 dark:bg-zinc-100 dark:text-zinc-900">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      </div>

      <span className="font-editorial text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Your
        <span className="font-sans font-semibold text-zinc-500 dark:text-zinc-400">
          Blog
        </span>
      </span>
    </div>
  );
}

export default Logo;
