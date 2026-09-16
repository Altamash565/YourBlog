import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import appwriteService from '@/appwrite/config1';
import { PostForm } from '../components';
import { FormSkeleton } from '../components/Loader';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/new-components/ui/button';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

function EditPostV2() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      setLoading(true);
      appwriteService
        .getPost(slug)
        .then((postData) => {
          if (isMounted) {
            if (postData) {
              setPost(postData);
            } else {
              navigate('/');
            }
          }
        })
        .catch((error) => {
          console.error('EditPostV2 :: getPost error:', error);
          if (isMounted) navigate('/');
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      navigate('/');
    }

    return () => {
      isMounted = false;
    };
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl py-6 sm:py-10">
        <div className="mb-4">
          <div className="h-8 w-20 rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="mb-8 space-y-2">
          <div className="h-8 w-44 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-72 rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <FormSkeleton />
      </div>
    );
  }

  if (!post) return null;

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-5xl py-6 sm:py-10"
    >
      {/* Navigation & Back Button (matching Post.jsx) */}
      <motion.div variants={headerVariants} className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </motion.div>

      {/* Page Header */}
      <motion.div variants={headerVariants} className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Edit Story
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          Update your article content, cover image, and publishing settings.
        </p>
      </motion.div>

      <PostForm post={post} />
    </motion.div>
  );
}

export default EditPostV2;
