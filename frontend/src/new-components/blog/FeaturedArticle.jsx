import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/new-components/ui/avatar';

function FeaturedArticle({ staffPicks = [], selectedTopic = 'All', onSelectTopic }) {
  // Only use real dynamic posts from backend
  const displayPicks = staffPicks.slice(0, 4);

  return (
    <aside className="w-full space-y-8">
      {/* 1. Staff / Curated Picks Section (Real backend posts only) */}
      {displayPicks.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Staff Picks
          </h3>

          <div className="space-y-4">
            {displayPicks.map((pick) => {
              const author = pick.authorName || 'Author';
              const initials = author
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              const formattedDate = pick.$createdAt
                ? new Date(pick.$createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : null;

              return (
                <article key={pick.$id} className="group">
                  {/* Author line */}
                  <div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <Avatar className="h-4 w-4 rounded-full">
                      <AvatarFallback className="bg-zinc-200 text-[9px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate font-medium text-zinc-900 dark:text-zinc-200">
                      {author}
                    </span>
                    {formattedDate && (
                      <>
                        <span className="text-zinc-400">·</span>
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {formattedDate}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Pick Title */}
                  <Link
                    to={`/post/${pick.$id}`}
                    className="line-clamp-2 block font-heading text-sm leading-snug font-bold text-zinc-900 group-hover:underline dark:text-zinc-100"
                  >
                    {pick.title}
                  </Link>
                </article>
              );
            })}
          </div>

          <Link
            to="/all-posts"
            className="mt-4 inline-block text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400"
          >
            See the full list
          </Link>
        </div>
      )}

      {/* 2. Recommended Topics Section */}
      <div
        className={
          displayPicks.length > 0
            ? 'border-t border-zinc-200/80 pt-6 dark:border-zinc-800/80'
            : ''
        }
      >
        <h3 className="mb-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Recommended topics
        </h3>

        <div className="flex flex-wrap gap-2">
          {[
            'Technology',
            'Programming',
            'Design',
            'Architecture',
            'Tutorials',
            'Product',
          ].map((topic) => {
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => onSelectTopic && onSelectTopic(isSelected ? 'All' : topic)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {selectedTopic !== 'All' && (
          <button
            type="button"
            onClick={() => onSelectTopic && onSelectTopic('All')}
            className="mt-3.5 inline-block cursor-pointer text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Show all topics
          </button>
        )}
      </div>

      {/* 3. Medium Minimal Footer Links */}
      <div className="border-t border-zinc-200/80 pt-6 text-[11px] text-zinc-400 dark:text-zinc-500">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          <Link to="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            Help
          </Link>
          <Link to="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            Status
          </Link>
          <Link to="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            About
          </Link>
          <Link to="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            Careers
          </Link>
          <Link to="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            Privacy
          </Link>
          <Link to="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            Terms
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default FeaturedArticle;
