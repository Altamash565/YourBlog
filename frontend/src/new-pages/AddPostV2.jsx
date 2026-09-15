import React from 'react';
import { Container, PostForm } from '../components';
import { motion } from 'framer-motion';

function AddPostV2() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-5xl py-6 sm:py-10"
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Write a Story
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          Share your ideas with the world. Fill in the details below and publish your
          article.
        </p>
      </div>

      <PostForm />
    </motion.div>
  );
}

export default AddPostV2;
