import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

// Elegant Route Progress Bar at the top of the screen
export function RouteProgressBar() {
  const location = useLocation()
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setAnimating(true)
    const timer = setTimeout(() => {
      setAnimating(false)
    }, 600) // animate for 600ms
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <AnimatePresence>
      {animating && (
        <motion.div
          initial={{ width: '0%', opacity: 1 }}
          animate={{ width: '100%' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[9999] pointer-events-none"
        />
      )}
    </AnimatePresence>
  )
}

// Center-aligned Loader situated between Header and Footer
export function GlobalLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-24 w-full min-h-[45vh] gap-3">
      {/* Sleek, thin spinner */}
      <div className="w-7 h-7 rounded-full border-2 border-zinc-200 border-t-indigo-600 dark:border-zinc-800 dark:border-t-indigo-400 animate-spin" />
      {/* Clean, uppercase typography */}
      <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-widest uppercase select-none animate-pulse">
        Loading
      </span>
    </div>
  )
}

// Skeleton representation of a PostCard
export function PostCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl border border-zinc-200/60 bg-white dark:border-zinc-800/60 dark:bg-zinc-900 shadow-sm">
      {/* Card Image Shimmer */}
      <div className="aspect-video w-full shimmer" />
      
      {/* Card Content Shimmer */}
      <div className="flex flex-col flex-grow p-5 space-y-4">
        {/* Category tag placeholder */}
        <div className="w-16 h-3 rounded shimmer" />
        
        {/* Title placeholders */}
        <div className="space-y-2">
          <div className="w-full h-5 rounded shimmer" />
          <div className="w-3/4 h-5 rounded shimmer" />
        </div>
        
        {/* Read More link placeholder */}
        <div className="w-24 h-4 rounded shimmer mt-auto" />
      </div>
    </div>
  )
}

// Skeleton representation of individual post details
export function PostDetailSkeleton() {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto w-full space-y-8">
      {/* Article Header Metadata & Title */}
      <div className="flex flex-col items-center md:items-start space-y-3">
        <div className="w-32 h-3 rounded shimmer" />
        <div className="w-full h-8 rounded shimmer sm:w-3/4" />
        <div className="w-1/2 h-8 rounded shimmer sm:w-1/3" />
      </div>

      {/* Featured Image */}
      <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl shimmer shadow-sm" />

      {/* Article Body Content */}
      <div className="space-y-4">
        <div className="w-full h-4 rounded shimmer" />
        <div className="w-[98%] h-4 rounded shimmer" />
        <div className="w-[95%] h-4 rounded shimmer" />
        <div className="w-[97%] h-4 rounded shimmer" />
        <div className="w-[60%] h-4 rounded shimmer" />
      </div>
      <div className="space-y-4 pt-4">
        <div className="w-full h-4 rounded shimmer" />
        <div className="w-[96%] h-4 rounded shimmer" />
        <div className="w-[94%] h-4 rounded shimmer" />
        <div className="w-[45%] h-4 rounded shimmer" />
      </div>
    </div>
  )
}

// Skeleton representation of the PostForm / EditPost layout
export function FormSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 w-full">
      {/* Editor Section Skeletons */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <div className="w-20 h-4 rounded shimmer" />
          <div className="w-full h-11 rounded-xl shimmer" />
        </div>
        <div className="space-y-2">
          <div className="w-24 h-4 rounded shimmer" />
          <div className="w-full h-11 rounded-xl shimmer" />
        </div>
        <div className="space-y-2">
          <div className="w-28 h-4 rounded shimmer" />
          <div className="w-full h-72 rounded-2xl shimmer" />
        </div>
      </div>

      {/* Publishing Sidebar Skeletons */}
      <div className="lg:col-span-1 space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-6 h-fit shadow-sm">
        <div className="space-y-2">
          <div className="w-28 h-4 rounded shimmer" />
          <div className="w-full h-11 rounded-xl shimmer" />
        </div>
        <div className="space-y-2">
          <div className="w-32 h-4 rounded shimmer" />
          <div className="w-full h-11 rounded-xl shimmer" />
        </div>
        <div className="w-full h-11 rounded-xl shimmer mt-4" />
      </div>
    </div>
  )
}
