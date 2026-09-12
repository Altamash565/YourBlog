import React, { useState, useEffect, useMemo } from 'react';
import appwriteService from '../appwrite/config1';
import { Container, PostCard } from '../components';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { Input, Skeleton } from '@/components/ui';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    appwriteService
      .getPosts()
      .then((res) => {
        if (res) {
          setPosts(res.documents);
        }
      })
      .catch((err) => {
        console.error('AllPosts :: getPosts :: error', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      return (
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [posts, searchQuery]);

  return (
    <div className="w-full py-6 md:py-10">
      <Container>
        {/* Archive Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-zinc-200/80 pb-8 sm:flex-row sm:items-end dark:border-zinc-800/80">
          <div>
            <span className="font-mono text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
              Library Archive
            </span>
            <h1 className="font-editorial text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
              All Publications.
            </h1>
            <p className="mt-2 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
              Explore the entire catalogue of tutorials, engineering notes, and developer
              guides.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-zinc-200 bg-white pl-9 dark:border-zinc-800 dark:bg-zinc-900"
            />
          </div>
        </div>

        {/* Content Loading or Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="space-y-3 rounded-xl border border-zinc-200/80 p-4 dark:border-zinc-800/80"
              >
                <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              No matching articles
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : 'No posts published yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.$id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
              >
                <PostCard {...post} />
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
