import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TableOfContents({ headings = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const menuRef = useRef(null);

  // Track overall reading / scroll progress (0 to 100%)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active heading in view via IntersectionObserver
  useEffect(() => {
    if (!headings || headings.length === 0) return;

    // Set initial active heading
    if (!activeId && headings.length > 0) {
      setActiveId(headings[0].id);
    }

    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible headings
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Take the one closest to top
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    headingElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, activeId]);

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeHeading = useMemo(() => {
    if (!headings || headings.length === 0) return null;
    return headings.find((h) => h.id === activeId) || headings[0];
  }, [headings, activeId]);

  if (!headings || headings.length === 0) {
    return null;
  }

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
      setIsOpen(false);
    }
  };

  // Circular progress SVG values
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * Math.min(100, Math.max(0, scrollProgress))) / 100;

  return (
    <aside
      ref={menuRef}
      className="fixed right-4 bottom-6 z-50 max-w-[calc(100vw-2rem)] sm:right-6 sm:w-84"
      aria-label="Table of contents"
    >
      <AnimatePresence>
        {/* Expanded Popup Menu matching reference screenshot */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="mb-2 flex max-h-[460px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 p-3 text-zinc-900 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-white"
          >
            {/* Header label */}
            <div className="px-3 pt-1 pb-2">
              <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                Table of Contents
              </span>
            </div>

            {/* List of headings */}
            <div className="scrollbar-none flex-1 space-y-1 overflow-y-auto pr-1">
              {headings.map((item) => {
                const isActive = item.id === activeHeading?.id;
                const isSubheading = item.level > 2;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToHeading(item.id)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${
                      isActive
                        ? 'bg-zinc-100 font-semibold text-zinc-950 shadow-xs dark:bg-zinc-800/90 dark:text-white'
                        : isSubheading
                          ? 'text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200'
                          : 'text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900/60 dark:hover:text-white'
                    } ${isSubheading ? 'pl-6' : 'pl-3'}`}
                  >
                    <span className="line-clamp-2 leading-snug">{item.text}</span>
                    {isActive && (
                      <span className="ml-2 h-2 w-2 shrink-0 rounded-full bg-zinc-900 dark:bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Docked Trigger Pill matching the bottom bar in screenshot */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/95 px-4 py-3 text-zinc-900 shadow-xl backdrop-blur-xl transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800/90 dark:bg-zinc-950/95 dark:text-white dark:hover:border-zinc-700 dark:hover:bg-zinc-950"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Active dot */}
          <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-900 shadow-xs dark:bg-white" />

          {/* Current Active Heading Title */}
          <span className="truncate text-left text-xs font-semibold sm:text-sm">
            {activeHeading?.text || 'Table of Contents'}
          </span>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
          <svg className="h-6 w-6 -rotate-90" viewBox="0 0 24 24">
            {/* Background ring track */}
            <circle
              cx="12"
              cy="12"
              r={radius}
              className="stroke-zinc-200 dark:stroke-zinc-800"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Animated foreground progress stroke */}
            <circle
              cx="12"
              cy="12"
              r={radius}
              className="stroke-zinc-900 transition-[stroke-dashoffset] duration-150 ease-out dark:stroke-white"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </motion.button>
    </aside>
  );
}
