import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config1';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
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
} from '@/new-components/ui';
import TableOfContents from '../new-components/blog/TableOfContents';

export default function PostV2() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  // Extract headings from article content for the Table of Contents
  useEffect(() => {
    if (!post?.content) {
      setHeadings([]);
      return;
    }

    const timer = setTimeout(() => {
      if (!contentRef.current) return;
      const elements = contentRef.current.querySelectorAll('h1, h2, h3, h4');
      const items = [];

      elements.forEach((el, index) => {
        let id = el.id;
        if (!id) {
          id =
            el.textContent
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '') || `heading-${index + 1}`;
          el.id = id;
        }
        el.style.scrollMarginTop = '95px';

        const tag = el.tagName.toLowerCase();
        const level = tag === 'h1' ? 1 : tag === 'h2' ? 2 : tag === 'h3' ? 3 : 4;
        items.push({
          id,
          text: el.textContent.trim(),
          level,
        });
      });

      setHeadings(items);
    }, 150);

    return () => clearTimeout(timer);
  }, [post?.content]);

  const authorName = useMemo(() => {
    if (isAuthor && userData?.name) return userData.name;
    if (post?.userName) return post.userName;
    if (post?.author) return post.author;
    return null;
  }, [isAuthor, userData?.name, post?.userName, post?.author]);

  const authorInitials = useMemo(() => {
    if (!authorName) return '';
    return authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [authorName]);

  const deletePost = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to permanently delete this article? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        if (post.featuredImage) {
          appwriteService.deleteFile(post.featuredImage);
        }
        navigate('/all-posts');
      }
    });
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
                    onClick={deletePost}
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
              className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase"
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
                <AvatarFallback className="bg-zinc-900 font-mono text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {authorName && (
                <span className="font-sans font-semibold text-zinc-800 dark:text-zinc-200">
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
      <TableOfContents headings={headings} />

      {/* 5. Single-Column Dynamic Article Content */}
      {post.content && (
        <div
          ref={contentRef}
          className="article-body text-[15px] leading-relaxed text-zinc-800 sm:text-base md:text-[17px] md:leading-8 dark:text-zinc-200"
        >
          {parse(post.content)}
        </div>
      )}

      {/* 5. Dynamic Related Posts List (Rendered only if other posts exist) */}
      {relatedPosts.length > 0 && (
        <section className="mt-14 pt-8">
          <h3 className="font-heading mb-4 text-xs font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            Related Posts
          </h3>
          <div className="space-y-1">
            {relatedPosts.map((related) => (
              <Link
                key={related.$id}
                to={`/post/${related.$id}`}
                className="group flex items-center justify-between py-2.5 transition-colors"
              >
                <span className="font-heading text-sm font-medium text-zinc-700 transition-colors group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-white">
                  {related.title}
                </span>
                {related.$createdAt && (
                  <span className="shrink-0 font-mono text-[11px] text-zinc-400 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                    {new Date(related.$createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </motion.article>
  </TooltipProvider>
  );
}
