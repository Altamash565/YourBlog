import React from 'react';
import appwriteService from '../appwrite/config1';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900">
        {/* Card Image Wrapper */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 to-transparent" />
        </div>

        {/* Card Content */}
        <div className="flex flex-grow flex-col p-5">
          <span className="mb-2 text-xs font-medium tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
            Article
          </span>
          <h2 className="mb-3 line-clamp-2 text-lg leading-snug font-semibold text-zinc-900 transition-colors duration-250 group-hover:text-indigo-600 dark:text-zinc-50 dark:group-hover:text-indigo-400">
            {title}
          </h2>
          <p className="mt-auto flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Read Post
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </p>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
