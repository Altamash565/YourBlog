import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import appwriteService from '@/appwrite/config1';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  BookmarkCheck,
  Check,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/new-components/ui/tooltip';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // Same year: e.g. "May 30"
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  // Older years: e.g. "May 30, 2023"
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function BlogCard({ $id, title, content, featuredImage, $createdAt }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Parse plain text excerpt from HTML/rich content
  const plainExcerpt = content ? content.replace(/<[^>]*>?/gm, '').trim() : '';

  // Format relative and full date from Appwrite
  const relativeDate = formatRelativeTime($createdAt);
  const fullDate = $createdAt
    ? new Date($createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Estimate reading time from real content
  const wordCount = plainExcerpt ? plainExcerpt.split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 50));

  const imageUrl = featuredImage ? appwriteService.getFilePreview(featuredImage) : '';

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked((prev) => !prev);
    if (!isLiked && isDisliked) setIsDisliked(false);
  };

  const handleDislike = (e) => {
    e.preventDefault();
    setIsDisliked((prev) => !prev);
    if (!isDisliked && isLiked) setIsLiked(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved((prev) => !prev);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/post/${$id}`;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <TooltipProvider delayDuration={150}>
      <article className="group mb-8 border-b border-zinc-200/70 pb-8 dark:border-zinc-800/70">
        {/* 1. Date & Reading Time */}
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          {relativeDate && (
            <span title={fullDate} className="cursor-default">
              {relativeDate}
            </span>
          )}
          {relativeDate && <span className="text-zinc-300 dark:text-zinc-700">·</span>}
          <span>{readTimeMinutes} min read</span>
        </div>

        {/* 2. Main Story Row: Split when image exists, Full-width when no image */}
        {imageUrl && !imgError ? (
          <div className="flex items-start justify-between gap-6 sm:gap-8">
            {/* Left: Title & Excerpt */}
            <div className="min-w-0 flex-1 pr-1">
              <Link to={`/post/${$id}`} className="block">
                <h2 className="line-clamp-2 font-serif text-xl leading-snug font-bold tracking-tight text-zinc-900 group-hover:text-zinc-600 sm:text-2xl dark:text-zinc-100 dark:group-hover:text-zinc-300">
                  {title}
                </h2>
                {plainExcerpt && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed font-normal text-zinc-600 sm:text-base dark:text-zinc-400">
                    {plainExcerpt}
                  </p>
                )}
              </Link>
            </div>

            {/* Right: Real Thumbnail Image from Backend */}
            <Link
              to={`/post/${$id}`}
              className="relative block shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800"
            >
              <img
                src={imageUrl}
                alt={title}
                onError={() => setImgError(true)}
                className="h-20 w-28 object-cover sm:h-28 sm:w-40 md:h-28 md:w-44"
                loading="lazy"
              />
            </Link>
          </div>
        ) : (
          /* Full-width editorial fallback when post has no cover image */
          <div className="w-full">
            <Link to={`/post/${$id}`} className="block">
              <h2 className="font-serif text-xl leading-snug font-bold tracking-tight text-zinc-900 group-hover:text-zinc-600 sm:text-2xl dark:text-zinc-100 dark:group-hover:text-zinc-300">
                {title}
              </h2>
              {plainExcerpt && (
                <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed font-normal text-zinc-600 sm:text-base dark:text-zinc-400">
                  {plainExcerpt}
                </p>
              )}
            </Link>
          </div>
        )}

        {/* 3. Bottom Actions: Like, Dislike, Share, Bookmark */}
        <div className="mt-5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          {/* Left: Like, Dislike, Share */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Like */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleLike}
                  aria-label="Like"
                  className={`cursor-pointer rounded-full p-1.5 ${
                    isLiked
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-200'
                  }`}
                >
                  <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLiked ? 'Liked' : 'Like'}</p>
              </TooltipContent>
            </Tooltip>

            {/* Dislike */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleDislike}
                  aria-label="Dislike"
                  className={`cursor-pointer rounded-full p-1.5 ${
                    isDisliked
                      ? 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400'
                      : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-200'
                  }`}
                >
                  <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isDisliked ? 'Disliked' : 'Dislike'}</p>
              </TooltipContent>
            </Tooltip>

            {/* Share */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share"
                  className="cursor-pointer rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-200"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? 'Link copied!' : 'Share'}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right: Bookmark */}
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleSave}
                  aria-label="Bookmark"
                  className={`cursor-pointer rounded-full p-1.5 ${
                    isSaved
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-200'
                  }`}
                >
                  {isSaved ? (
                    <BookmarkCheck className="h-4 w-4 fill-current text-zinc-900 dark:text-zinc-100" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSaved ? 'Saved' : 'Save story'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </article>
    </TooltipProvider>
  );
}

export default BlogCard;
