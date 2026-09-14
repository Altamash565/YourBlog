import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Route progress bar disabled across website
export function RouteProgressBar() {
  return null;
}

// Center-aligned Loader situated between Header and Footer
export function GlobalLoader() {
  return (
    <div className="flex min-h-[45vh] w-full flex-col items-center justify-center gap-3 py-24">
      {/* Sleek, thin spinner */}
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100" />
      {/* Clean, uppercase typography */}
      <span className="animate-pulse text-[11px] font-semibold tracking-widest text-zinc-400 uppercase select-none dark:text-zinc-500">
        Loading
      </span>
    </div>
  );
}

// Skeleton representation of a PostCard
export function PostCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900">
      {/* Card Image Shimmer */}
      <div className="shimmer aspect-video w-full" />

      {/* Card Content Shimmer */}
      <div className="flex flex-grow flex-col space-y-4 p-5">
        {/* Category tag placeholder */}
        <div className="shimmer h-3 w-16 rounded" />

        {/* Title placeholders */}
        <div className="space-y-2">
          <div className="shimmer h-5 w-full rounded" />
          <div className="shimmer h-5 w-3/4 rounded" />
        </div>

        {/* Read More link placeholder */}
        <div className="shimmer mt-auto h-4 w-24 rounded" />
      </div>
    </div>
  );
}

// Skeleton representation of individual post details
export function PostDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-12">
      {/* Article Header Metadata & Title */}
      <div className="flex flex-col items-center space-y-3 md:items-start">
        <div className="shimmer h-3 w-32 rounded" />
        <div className="shimmer h-8 w-full rounded sm:w-3/4" />
        <div className="shimmer h-8 w-1/2 rounded sm:w-1/3" />
      </div>

      {/* Featured Image */}
      <div className="shimmer aspect-video w-full rounded-2xl shadow-sm md:aspect-[21/9]" />

      {/* Article Body Content */}
      <div className="space-y-4">
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-[98%] rounded" />
        <div className="shimmer h-4 w-[95%] rounded" />
        <div className="shimmer h-4 w-[97%] rounded" />
        <div className="shimmer h-4 w-[60%] rounded" />
      </div>
      <div className="space-y-4 pt-4">
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-[96%] rounded" />
        <div className="shimmer h-4 w-[94%] rounded" />
        <div className="shimmer h-4 w-[45%] rounded" />
      </div>
    </div>
  );
}

// Skeleton representation of the PostForm / EditPost layout
export function FormSkeleton() {
  return (
    <div className="grid w-full grid-cols-1 gap-8 py-8 lg:grid-cols-3">
      {/* Editor Section Skeletons */}
      <div className="space-y-6 lg:col-span-2">
        <div className="space-y-2">
          <div className="shimmer h-4 w-20 rounded" />
          <div className="shimmer h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="shimmer h-4 w-24 rounded" />
          <div className="shimmer h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="shimmer h-4 w-28 rounded" />
          <div className="shimmer h-72 w-full rounded-2xl" />
        </div>
      </div>

      {/* Publishing Sidebar Skeletons */}
      <div className="h-fit space-y-6 rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm lg:col-span-1 dark:border-zinc-800/60 dark:bg-zinc-900">
        <div className="space-y-2">
          <div className="shimmer h-4 w-28 rounded" />
          <div className="shimmer h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="shimmer h-4 w-32 rounded" />
          <div className="shimmer h-11 w-full rounded-xl" />
        </div>
        <div className="shimmer mt-4 h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
