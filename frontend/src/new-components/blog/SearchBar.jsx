import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/new-components/ui/input';

function SearchBar({
  value,
  onChange,
  placeholder = 'Search stories, topics, authors...',
  onClear,
}) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-full border-zinc-200/80 bg-zinc-100/70 pr-9 pl-9 text-sm focus-visible:ring-1 focus-visible:ring-zinc-400 dark:border-zinc-700/80 dark:bg-zinc-800/60"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
