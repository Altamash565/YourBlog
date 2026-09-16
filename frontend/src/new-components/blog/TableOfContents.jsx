import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';

export default function TableOfContents({ headings = [], contentRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const menuRef = useRef(null);

  // Track overall reading / scroll progress (0 to 100%)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active heading in view via IntersectionObserver
  useEffect(() => {
    if (!headings || headings.length === 0) return;
    if (!activeId && headings.length > 0) setActiveId(headings[0].id);

    let observer;
    const timer = setTimeout(() => {
      if (!contentRef?.current) return;
      const headingElements = Array.from(
        contentRef.current.querySelectorAll('h1, h2, h3, h4')
      );
      if (headingElements.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length > 0) {
            const idx = headingElements.indexOf(visible[0].target);
            if (idx !== -1 && headings[idx]) setActiveId(headings[idx].id);
          }
        },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
      );
      headingElements.forEach((el) => observer.observe(el));
    }, 300);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [headings, contentRef]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const activeHeading = useMemo(() => {
    if (!headings || headings.length === 0) return null;
    return headings.find((h) => h.id === activeId) || headings[0];
  }, [headings, activeId]);

  const scrollToHeading = useCallback(
    (item) => {
      if (item.id) setActiveId(item.id);
      setIsOpen(false);

      setTimeout(() => {
        let target = null;
        if (contentRef?.current) {
          const allH = contentRef.current.querySelectorAll('h1, h2, h3, h4');
          if (typeof item.index === 'number' && allH[item.index]) {
            target = allH[item.index];
          }
          if (!target && item.text) {
            const txt = item.text.trim();
            for (const h of allH) {
              if (h.textContent.trim() === txt) {
                target = h;
                break;
              }
            }
          }
        }
        if (!target && item.id) target = document.getElementById(item.id);
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const scrollY = window.pageYOffset || window.scrollY || 0;
        window.scrollTo({
          top: Math.max(0, rect.top + scrollY - 95),
          behavior: 'smooth',
        });
      }, 50);
    },
    [contentRef]
  );

  if (!headings || headings.length === 0) return null;

  // Circular progress ring
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * Math.min(100, Math.max(0, scrollProgress))) / 100;

  return (
    <div
      ref={menuRef}
      className="fixed right-4 bottom-6 z-50 w-[calc(100vw-2rem)] rounded-2xl border border-zinc-200/70 bg-white/80 text-zinc-900 shadow-lg ring-1 ring-zinc-900/5 backdrop-blur-xl sm:right-6 sm:w-80 dark:border-zinc-800/70 dark:bg-zinc-950/80 dark:text-white dark:ring-white/5"
      aria-label="Table of contents"
    >
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <div className="flex max-h-[340px] flex-col p-2">
              {/* Header */}
              <div className="px-3 pt-2 pb-1.5">
                <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                  On this page
                </span>
              </div>

              {/* Heading list */}
              <div className="flex-1 scrollbar-none space-y-0.5 overflow-y-auto py-1">
                {headings.map((item) => {
                  const isActive = item.id === activeHeading?.id;
                  const isSubheading = item.level > 2;

                  return (
                    <button
                      key={item.id || `toc-${item.index}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scrollToHeading(item);
                      }}
                      className={`relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-left transition-all duration-150 ${
                        isActive
                          ? 'bg-zinc-100/80 text-zinc-900 dark:bg-zinc-800/60 dark:text-zinc-100'
                          : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-200'
                      } ${isSubheading ? 'pl-7' : 'pl-3'}`}
                    >
                      {/* Active indicator line */}
                      {isActive && (
                        <motion.span
                          layoutId="toc-active"
                          className="absolute top-1 bottom-1 left-0 w-[2px] rounded-full bg-zinc-900 dark:bg-zinc-100"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span
                        className={`line-clamp-1 leading-snug ${
                          isActive
                            ? 'text-[13px] font-medium'
                            : isSubheading
                              ? 'text-[12px]'
                              : 'text-[13px]'
                        }`}
                      >
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-zinc-150 mx-3 border-t dark:border-zinc-800/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar: active heading + progress */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Progress ring */}
          <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
            <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
              <circle
                cx="10"
                cy="10"
                r={radius}
                className="stroke-zinc-200/80 dark:stroke-zinc-800"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="10"
                cy="10"
                r={radius}
                className="stroke-zinc-800 transition-[stroke-dashoffset] duration-200 ease-out dark:stroke-zinc-200"
                strokeWidth="2"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Active heading title */}
          <span className="truncate text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
            {activeHeading?.text || 'Table of Contents'}
          </span>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <ChevronUp className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
        </motion.div>
      </button>
    </div>
  );
}
