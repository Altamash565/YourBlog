import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config1';
import { Button, Container, PostDetailSkeleton } from '../components';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      setLoading(true);
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) setPost(post);
          else navigate('/');
        })
        .finally(() => {
          setLoading(false);
        });
    } else navigate('/');
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate('/');
      }
    });
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <PostDetailSkeleton />
      </div>
    );
  }

  return post ? (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-4xl px-4 py-12"
    >
      <Container>
        {/* Author Options Bar */}
        {isAuthor && (
          <div className="mb-6 flex justify-end gap-3">
            <Link to={`/edit-post/${post.slug || post.$id}`}>
              <Button variant="outline" className="text-sm font-semibold">
                Edit Post
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={deletePost}
              className="text-sm font-semibold"
            >
              Delete Post
            </Button>
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8 text-center md:text-left">
          <div className="mb-3 flex items-center gap-3 text-xs font-medium tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
            <span>Published Article</span>
            <span>•</span>
            <span>5 min read</span>
          </div>
          <h1 className="text-2xl leading-snug font-bold text-zinc-900 sm:text-3xl dark:text-zinc-50">
            {post.title}
          </h1>
        </header>

        {/* Featured Image */}
        <div className="mb-10 w-full overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-100 shadow-lg dark:border-zinc-800/60 dark:bg-zinc-900">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="h-auto max-h-[480px] w-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="max-w-none space-y-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          {parse(post.content)}
        </div>
      </Container>
    </motion.article>
  ) : null;
}
