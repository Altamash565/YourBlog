import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import appwriteService from '@/appwrite/config1';
import { BlogCard } from '@/new-components/blog';
import { Skeleton } from '@/new-components/ui/skeleton';
import { BookOpen, SquarePen, Search, X } from 'lucide-react';

function HomeV2() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    appwriteService
      .getPosts()
      .then((res) => {
        if (isMounted && res?.documents) {
          const sorted = [...res.documents].sort(
            (a, b) => new Date(b.$createdAt || 0) - new Date(a.$createdAt || 0)
          );
          setPosts(sorted);
        }
      })
      .catch((err) => {
        console.error('HomeV2 :: getPosts error:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter posts based on search query in title and content
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase().trim();
    return posts.filter((post) => {
      const titleMatch = post.title?.toLowerCase().includes(query);
      const contentMatch = post.content?.toLowerCase().includes(query);
      return titleMatch || contentMatch;
    });
  }, [posts, searchQuery]);

  const handleClearSearch = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-2 py-4 sm:px-4">
      {/* Clean, Minimal Feed Header */}
      <div className="mb-6 flex items-center justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
            {searchQuery ? 'Search Stories' : 'Latest Stories'}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {loading
              ? 'Loading stories...'
              : searchQuery
                ? `${filteredPosts.length} ${filteredPosts.length === 1 ? 'result' : 'results'} found`
                : `${posts.length} ${posts.length === 1 ? 'article' : 'articles'} published`}
          </p>
        </div>

        <Link
          to="/add-post"
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          <SquarePen className="h-3.5 w-3.5" />
          <span>Write</span>
        </Link>
      </div>

      {/* Stories Feed: Row-wise Medium Cards */}
      {loading ? (
        /* Row-wise Skeletons */
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 border-b border-zinc-200/70 pb-8 dark:border-zinc-800/70"
            >
              {/* Date skeleton */}
              <Skeleton className="h-3 w-28" />

              {/* Title & subtitle + thumbnail skeleton */}
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-11/12" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                {i !== 1 && <Skeleton className="h-24 w-36 shrink-0 rounded-md" />}
              </div>

              {/* Bottom skeleton */}
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-zinc-200 px-4 py-16 text-center dark:border-zinc-800">
          {searchQuery ? (
            <>
              <Search className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                No stories matching "{searchQuery}"
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                Try searching with different keywords or check for typos.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear Search</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                No stories published yet
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                Be the first author to publish a story on YourBlog!
              </p>
              <div className="mt-5">
                <Link
                  to="/add-post"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  <SquarePen className="h-3.5 w-3.5" />
                  <span>Write a Story</span>
                </Link>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Real dynamic posts stream */
        <div>
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.$id}
              $id={post.$id}
              title={post.title}
              content={post.content}
              featuredImage={post.featuredImage}
              $createdAt={post.$createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeV2;
