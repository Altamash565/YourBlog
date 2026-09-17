import React, { useEffect, useState, useMemo } from 'react';
import appwriteService from '../appwrite/config1';
import { Container, PostCard } from '../components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Card, Badge, Input, Skeleton } from '@/components/ui';

const TOPICS = ['All', 'Engineering', 'Design', 'Architecture', 'Tutorials', 'Product'];

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');

  useEffect(() => {
    appwriteService
      .getPosts()
      .then((res) => {
        if (res) {
          setPosts(res.documents);
        }
      })
      .catch((err) => {
        console.error('Home :: getPosts :: error', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchSearch =
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [posts, searchQuery]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const standardPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div className="w-full py-6 md:py-10">
      <Container>
        {/* Magazine Editorial Hero Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-zinc-200/80 pb-8 sm:flex-row sm:items-end dark:border-zinc-800/80">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-mono text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                The Open Journal
              </span>
            </div>
            <h1 className="font-editorial text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
              Stories &amp; Ideas.
            </h1>
            <p className="mt-2 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
              Thoughtful articles on software craft, system architecture, and modern
              product design.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-zinc-200 bg-white pl-9 dark:border-zinc-800 dark:bg-zinc-900"
            />
          </div>
        </div>

        {/* Topic Filter Pills */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`cursor-pointer rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                selectedTopic === topic
                  ? 'bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              #{topic}
            </button>
          ))}
        </div>

        {/* Content Loading Skeleton */}
        {loading ? (
          <div className="space-y-10">
            {/* Featured Hero Skeleton */}
            <div className="grid grid-cols-1 gap-6 rounded-2xl border border-zinc-200/80 p-6 lg:grid-cols-12 dark:border-zinc-800/80">
              <Skeleton className="aspect-video w-full rounded-xl lg:col-span-7" />
              <div className="flex flex-col justify-center space-y-4 lg:col-span-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>

            {/* Grid Skeletons */}
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
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              No publications found
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {searchQuery
                ? `No articles matching "${searchQuery}"`
                : 'Be the first author to publish a story!'}
            </p>
            <div className="mt-5">
              <Link
                to="/add-post"
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-95 dark:bg-zinc-100 dark:text-zinc-900"
              >
                Publish an Article
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* FEATURED LEAD STORY (Asymmetric Magazine Card) */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Link to={`/post/${featuredPost.$id}`} className="group block">
                  <Card className="overflow-hidden border-zinc-200/80 transition-all duration-300 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-zinc-700">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                      {/* Featured Image */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 lg:col-span-7 dark:bg-zinc-800">
                        <img
                          src={appwriteService.getFilePreview(featuredPost.featuredImage)}
                          alt={featuredPost.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <Badge className="absolute top-4 left-4 border-0 bg-zinc-900/80 text-white backdrop-blur-md dark:bg-white/90 dark:text-zinc-900">
                          <Sparkles className="mr-1 h-3 w-3" /> Featured Lead
                        </Badge>
                      </div>

                      {/* Featured Info */}
                      <div className="flex flex-col justify-center p-6 lg:col-span-5 lg:p-8">
                        <div className="mb-3 flex items-center gap-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                          <span>
                            {featuredPost.$createdAt
                              ? new Date(featuredPost.$createdAt).toLocaleDateString(
                                  'en-US',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  }
                                )
                              : 'Recent'}
                          </span>
                          <span>•</span>
                          <span>5 min read</span>
                        </div>

                        <h2 className="font-editorial text-2xl leading-tight font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-zinc-600 sm:text-3xl lg:text-4xl dark:text-zinc-50 dark:group-hover:text-zinc-300">
                          {featuredPost.title}
                        </h2>

                        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {featuredPost.content
                            ? featuredPost.content
                                .replace(/<[^>]*>?/gm, '')
                                .slice(0, 180) + '...'
                            : 'Click to read the complete article on Margin.'}
                        </p>

                        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          <span>Read full story</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )}

            {/* CURATED ARTICLES STREAM */}
            {standardPosts.length > 0 && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Recent Stories
                  </h2>
                  <Link
                    to="/all-posts"
                    className="text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    View archive &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {standardPosts.map((post, idx) => (
                    <motion.div
                      key={post.$id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                    >
                      <PostCard {...post} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default Home;
