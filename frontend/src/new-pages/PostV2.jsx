import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config1';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { resolveAuthorName, getAuthorInitials } from '@/lib/author';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Check,
  Clock,
  Edit3,
  Trash2,
} from 'lucide-react';
import {
  Button,
  Avatar,
  AvatarFallback,
  Badge,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/new-components/ui';
import TableOfContents from '../new-components/blog/TableOfContents';

export default function PostV2() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const contentRef = useRef(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (!slug) {
      navigate('/');
      return;
    }

    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'instant' });

    appwriteService
      .getPost(slug)
      .then((postData) => {
        if (postData) {
          setPost(postData);
          appwriteService
            .getPosts()
            .then((res) => {
              if (res?.documents) {
                const others = res.documents
                  .filter((item) => item.$id !== postData.$id && item.slug !== slug)
                  .slice(0, 3);
                setRelatedPosts(others);
              }
            })
            .catch(() => {});
        } else {
          navigate('/');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, navigate]);

  const readingTime = useMemo(() => {
    if (!post?.content) return 1;
    const textOnly = post.content.replace(/<[^>]*>?/gm, '');
    const wordCount = textOnly.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 225));
  }, [post?.content]);

  const formattedDate = useMemo(() => {
    if (!post?.$createdAt) return null;
    return new Date(post.$createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [post?.$createdAt]);

  // Extract headings & inject persistent unique IDs into content for Table of Contents
  const { processedContent, headings } = useMemo(() => {
    if (!post?.content) return { processedContent: '', headings: [] };

    try {
      const cleanContent = DOMPurify.sanitize(post.content);
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanContent, 'text/html');
      const elements = doc.querySelectorAll('h1, h2, h3, h4');
      const items = [];
      const usedIds = new Set();

      elements.forEach((el, index) => {
        const text = el.textContent?.trim() || '';
        if (!text) return;

        let slug = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        if (!slug) slug = `section-${index + 1}`;

        let id = slug;
        let counter = 1;
        while (usedIds.has(id)) {
          id = `${slug}-${counter}`;
          counter++;
        }
        usedIds.add(id);

        el.setAttribute('id', id);

        const tag = el.tagName.toLowerCase();
        const level = tag === 'h1' ? 1 : tag === 'h2' ? 2 : tag === 'h3' ? 3 : 4;
        items.push({
          id,
          text,
          level,
          index,
        });
      });

      return {
        processedContent: doc.body.innerHTML,
        headings: items,
      };
    } catch (e) {
      console.error('Failed to parse headings for Table of Contents:', e);
      return {
        processedContent: DOMPurify.sanitize(post.content),
        headings: [],
      };
    }
  }, [post?.content]);

  // Synchronize and ensure DOM heading IDs and scroll margins are always active
  useEffect(() => {
    if (!contentRef.current || headings.length === 0) return;

    const timer = setTimeout(() => {
      if (!contentRef.current) return;
      const headingEls = contentRef.current.querySelectorAll('h1, h2, h3, h4');
      headingEls.forEach((el, index) => {
        if (headings[index]) {
          el.id = headings[index].id;
          el.style.scrollMarginTop = '95px';
        }
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [headings, processedContent]);

  const authorName = useMemo(() => {
    return resolveAuthorName(post, userData?.$id, userData?.name);
  }, [post, userData?.$id, userData?.name]);

  const authorInitials = useMemo(() => {
    return getAuthorInitials(authorName);
  }, [authorName]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const status = await appwriteService.deletePost(post.$id);
      if (status) {
        if (post.featuredImage) {
          try {
            await appwriteService.deleteFile(post.featuredImage);
          } catch (e) {
            console.warn('Failed to delete featured image file:', e);
          }
        }
        navigate('/all-posts');
      }
    } catch (error) {
      console.error('Delete post error:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
        <Skeleton className="mb-6 h-8 w-24 rounded-lg" />
        <Skeleton className="mb-8 aspect-[16/9] w-full rounded-2xl sm:aspect-[21/9]" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
        </div>
        <div className="mt-10 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  const imageUrl = post.featuredImage
    ? appwriteService.getFilePreview(post.featuredImage)
    : null;

  return (
    <TooltipProvider delayDuration={150}>
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10 md:px-6"
      >
        {/* 1. Back Navigation & Author Actions */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Blog</span>
          </Button>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  >
                    <Link to={`/edit-post/${post.slug || post.$id}`}>
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Edit article</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Delete article</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* 2. Top Hero Featured Image (Rendered only if dynamic image exists) */}
        {imageUrl && !imgError && (
          <div className="relative mb-8 overflow-hidden rounded-2xl bg-zinc-100 sm:mb-10 dark:bg-zinc-900">
            <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
              <img
                src={imageUrl}
                alt={post.title}
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        )}

        {/* 3. Header: Title & Dynamic Metadata */}
        <header className="mb-8">
          {/* Dynamic Status Badge (Rendered only if status exists) */}
          {post.status && (
            <div className="mb-3">
              <Badge
                variant="secondary"
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
              >
                {post.status}
              </Badge>
            </div>
          )}

          {/* Dynamic Post Title */}
          <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
            {post.title}
          </h1>

          {/* Dynamic Author & Metadata Row */}
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {authorName && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-zinc-900 font-sans text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
                {authorName && (
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {authorName}
                  </span>
                )}
                {authorName && formattedDate && <span>·</span>}
                {formattedDate && <span>{formattedDate}</span>}
                {formattedDate && <span>·</span>}
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingTime} min read
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-zinc-400">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`h-8 w-8 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                      isLiked
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                    }`}
                    aria-label="Like"
                  >
                    <Heart
                      className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isLiked ? 'Unlike' : 'Like'}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`h-8 w-8 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                      isBookmarked
                        ? 'text-zinc-900 dark:text-zinc-100'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                    }`}
                    aria-label="Bookmark"
                  >
                    <Bookmark
                      className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyLink}
                    className="h-8 w-8 rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    aria-label="Share"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {copied ? 'Link copied!' : 'Share or copy link'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* 4. Table of Contents with Professional Gray Grid Row Lines */}
        <TableOfContents headings={headings} contentRef={contentRef} />

        {/* 5. Single-Column Dynamic Article Content */}
        {processedContent && (
          <div
            ref={contentRef}
            className="article-body text-[15px] leading-relaxed text-zinc-800 sm:text-base md:text-[17px] md:leading-8 dark:text-zinc-200"
          >
            {parse(processedContent)}
          </div>
        )}

        {/* 5. Dynamic Related Posts Section (Rendered only if other posts exist) */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-zinc-200/80 pt-10 dark:border-zinc-800/80">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-heading text-xs font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                Related Posts
              </h3>
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                {relatedPosts.length} {relatedPosts.length === 1 ? 'article' : 'articles'}
              </span>
            </div>

            <div className="space-y-3">
              {relatedPosts.map((related) => {
                const excerpt = related.content
                  ? related.content.replace(/<[^>]*>?/gm, '').trim()
                  : '';
                const wordCount = excerpt ? excerpt.split(/\s+/).length : 0;
                const cardReadTime = Math.max(1, Math.ceil(wordCount / 225));
                const cardImage = related.featuredImage
                  ? appwriteService.getFilePreview(related.featuredImage)
                  : null;
                const cardDate = related.$createdAt
                  ? new Date(related.$createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : null;

                return (
                  <Link
                    key={related.$id}
                    to={`/post/${related.slug || related.$id}`}
                    className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white/60 p-4 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50/80 hover:shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/70"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-heading line-clamp-1 text-sm font-semibold text-zinc-900 transition-colors group-hover:text-zinc-600 sm:text-base dark:text-zinc-100 dark:group-hover:text-zinc-300">
                        {related.title}
                      </h4>

                      {excerpt && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-500 sm:text-[13px] dark:text-zinc-400">
                          {excerpt}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
                        {cardDate && <span>{cardDate}</span>}
                        {cardDate && <span>·</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {cardReadTime} min read
                        </span>
                      </div>
                    </div>

                    {cardImage && (
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-22 sm:w-32 dark:bg-zinc-800">
                        <img
                          src={cardImage}
                          alt={related.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.parentElement.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </motion.article>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <motion.div
              initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 240, delay: 0.05 }}
              className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400"
            >
              <Trash2 className="h-5 w-5" />
            </motion.div>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this article? This action cannot
              be undone and your story and cover image will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="text-xs font-medium"
            >
              {isDeleting ? 'Deleting...' : 'Delete Article'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
