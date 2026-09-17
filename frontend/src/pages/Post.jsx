import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config1';
import { Container } from '../components';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Share2, ArrowLeft, Trash2, Edit3, Check } from 'lucide-react';
import {
  Button,
  Avatar,
  AvatarFallback,
  Badge,
  Separator,
  Skeleton,
} from '@/components/ui';

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      setLoading(true);
      appwriteService
        .getPost(slug)
        .then((postData) => {
          if (postData) setPost(postData);
          else navigate('/');
        })
        .finally(() => {
          setLoading(false);
        });
    } else navigate('/');
  }, [slug, navigate]);

  // Dynamic Reading Time Calculation
  const readingTime = useMemo(() => {
    if (!post?.content) return 3;
    const textOnly = post.content.replace(/<[^>]*>?/gm, '');
    const wordCount = textOnly.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 225));
  }, [post?.content]);

  const deletePost = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to permanently delete this article? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate('/');
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
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-12">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-full" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return post ? (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl px-4 py-8 md:py-12"
    >
      {/* Navigation & Author Controls */}
      <div className="mb-8 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        {isAuthor && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link to={`/edit-post/${post.slug || post.$id}`}>
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={deletePost}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        )}
      </div>

      {/* Header Section */}
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="font-mono text-xs tracking-wider uppercase"
          >
            Essay
          </Badge>
          <span className="font-mono text-xs text-zinc-400">{readingTime} min read</span>
        </div>

        <h1 className="font-editorial text-3xl leading-tight font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
          {post.title}
        </h1>

        {/* Author Byline & Date */}
        <div className="mt-6 flex items-center justify-between border-y border-zinc-200/80 py-4 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Published on Margin
              </p>
              <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {post.$createdAt
                  ? new Date(post.$createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recent Story'}
              </p>
            </div>
          </div>

          {/* Quick Action Pill */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={`h-8 w-8 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
              aria-label="Like story"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`h-8 w-8 ${isBookmarked ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
              aria-label="Bookmark story"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-10 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-100 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="max-h-[500px] w-full object-cover"
          />
        </div>
      )}

      {/* Article Body Content (Editorial Prose) */}
      <div className="space-y-6 text-lg leading-relaxed text-zinc-800 dark:text-zinc-200">
        {parse(post.content)}
      </div>

      <Separator className="my-12" />

      {/* Author Footer Card */}
      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/30">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border border-zinc-200 dark:border-zinc-800">
            <AvatarFallback className="text-base font-semibold">M</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Margin Editorial
            </h4>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Independent publishing powered by developers. Thank you for reading and
              supporting open ideas.
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  ) : null;
}
