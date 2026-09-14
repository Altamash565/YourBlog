import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import appwriteService from '@/appwrite/config1';
import { Card } from '@/new-components/ui/card';
import { Badge } from '@/new-components/ui/badge';
import { Input } from '@/new-components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/new-components/ui/tooltip';
import {
  Search,
  Clock,
  BookOpen,
  Share2,
  Check,
  ArrowBigUp,
  ArrowBigDown,
  ArrowUpRight,
  FileText,
  X,
  Plus,
} from 'lucide-react';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function PostCardItem({ post }) {
  const [vote, setVote] = useState(0); // 0 = none, 1 = upvoted, -1 = downvoted
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Extract clean plain text excerpt from HTML content
  const plainExcerpt = useMemo(() => {
    if (!post?.content) return '';
    return post.content.replace(/<[^>]*>?/gm, '').trim();
  }, [post?.content]);

  // Reading time calculation from actual words in post content
  const wordCount = plainExcerpt ? plainExcerpt.split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 60));

  const relativeDate = formatRelativeTime(post?.$createdAt);
  const fullDate = post?.$createdAt
    ? new Date(post.$createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const imageUrl = post?.featuredImage
    ? appwriteService.getFilePreview(post.featuredImage)
    : '';

  const handleUpvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVote((prev) => (prev === 1 ? 0 : 1));
  };

  const handleDownvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVote((prev) => (prev === -1 ? 0 : -1));
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.$id}`;
    if (navigator.share) {
      navigator.share({ title: post.title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-zinc-200/90 bg-white p-4.5 shadow-xs sm:rounded-2xl sm:p-5 dark:border-zinc-800/80 dark:bg-zinc-900/60">
      <div>
        {/* Top Meta: Date on Left, Read Time on Right */}
        <div className="mb-3 flex items-center justify-between text-[11px] text-zinc-500 sm:text-xs dark:text-zinc-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span title={fullDate}>{relativeDate || 'Recently'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
            <span>{readTimeMinutes} min</span>
          </div>
        </div>

        {/* Thumbnail Preview: Compact mid-size without scale animation */}
        {imageUrl && !imgError && (
          <Link
            to={`/post/${post.$id}`}
            className="mb-3 block overflow-hidden rounded-lg bg-zinc-100 sm:rounded-xl dark:bg-zinc-800"
          >
            <img
              src={imageUrl}
              alt={post.title}
              onError={() => setImgError(true)}
              className="h-36 w-full object-cover"
              loading="lazy"
            />
          </Link>
        )}

        {/* Post Title */}
        <Link to={`/post/${post.$id}`} className="block">
          <h2 className="line-clamp-2 text-base font-bold tracking-tight text-zinc-900 sm:text-lg dark:text-zinc-100">
            {post.title}
          </h2>
        </Link>

        {/* Post Excerpt */}
        {plainExcerpt && (
          <Link to={`/post/${post.$id}`} className="block">
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400">
              {plainExcerpt}
            </p>
          </Link>
        )}
      </div>

      {/* Bottom Footer: Left = Real Metadata Badge, Right = Pill Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/60">
        {/* Left: Real Status or Published Date */}
        <div className="flex items-center gap-1.5">
          {post.status ? (
            <Badge
              variant="outline"
              className="px-2 py-0 text-[10px] font-medium tracking-wide uppercase"
            >
              {post.status}
            </Badge>
          ) : fullDate ? (
            <Badge variant="secondary" className="px-2 py-0 text-[10px] font-normal">
              {fullDate}
            </Badge>
          ) : null}
        </div>

        {/* Right: Interaction Pill & Quick Actions */}
        <div className="flex items-center gap-1.5">
          {/* Reddit-style Pill Upvote / Downvote */}
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50/80 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300">
            <button
              type="button"
              onClick={handleUpvote}
              aria-label="Upvote"
              className={`cursor-pointer rounded p-0.5 ${
                vote === 1
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <ArrowBigUp className={`h-3.5 w-3.5 ${vote === 1 ? 'fill-current' : ''}`} />
            </button>
            <span className="min-w-[14px] text-center text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
              {vote === 1 ? 1 : vote === -1 ? -1 : 0}
            </span>
            <button
              type="button"
              onClick={handleDownvote}
              aria-label="Downvote"
              className={`cursor-pointer rounded p-0.5 ${
                vote === -1
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <ArrowBigDown className={`h-3.5 w-3.5 ${vote === -1 ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Share Button */}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share"
                  className="cursor-pointer rounded-full border border-zinc-200 p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Share2 className="h-3 w-3" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? 'Link copied!' : 'Share'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Read Link */}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={`/post/${post.$id}`}
                  className="rounded-full border border-zinc-200 p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Read article</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
}

function AllPostsV2() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
        console.error('AllPostsV2 :: getPosts :: error', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase().trim();
    return posts.filter((post) => {
      const titleMatch = post.title?.toLowerCase().includes(query);
      const contentMatch = post.content?.toLowerCase().includes(query);
      return titleMatch || contentMatch;
    });
  }, [posts, searchQuery]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      {/* Header matching the minimal screenshot style */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-zinc-200/80 pb-5 sm:flex-row sm:items-end dark:border-zinc-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
            All Posts
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Discover the latest stories, insights, and publications across the platform.
          </p>
        </div>

        {/* Actions: Search Bar & Add Post Button */}
        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-60">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 border-zinc-200 bg-white pr-8 pl-8.5 text-xs sm:text-sm dark:border-zinc-800 dark:bg-zinc-900/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Link
            to="/add-post"
            className="inline-flex h-8.5 shrink-0 items-center justify-center gap-1.5 rounded-md bg-zinc-900 px-3 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Post</span>
          </Link>
        </div>
      </div>

      {/* Loading Skeleton Grid: Static without pulse animations */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-xl border border-zinc-200/80 bg-white p-4.5 sm:rounded-2xl sm:p-5 dark:border-zinc-800/80 dark:bg-zinc-900/40"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="h-36 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-5 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3.5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="flex items-center justify-between pt-3">
                <div className="h-5 w-14 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
          <FileText className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            No posts found
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {searchQuery
              ? `No articles match "${searchQuery}". Try a different keyword.`
              : 'There are no posts published yet.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              to="/add-post"
              className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create post</span>
            </Link>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-medium text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Clear search filter
              </button>
            )}
          </div>
        </div>
      ) : (
        /* 3-Column Mid-Square Static Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {filteredPosts.map((post) => (
            <PostCardItem key={post.$id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllPostsV2;
