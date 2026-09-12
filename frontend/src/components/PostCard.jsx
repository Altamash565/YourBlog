import React from 'react';
import appwriteService from '../appwrite/config1';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Card, Badge } from '@/components/ui';

function PostCard({ $id, title, featuredImage, $createdAt }) {
  const formattedDate = $createdAt
    ? new Date($createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'Article';

  return (
    <Link to={`/post/${$id}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden border-zinc-200/80 transition-all duration-300 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700">
        {/* Cover Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
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
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <Badge
              variant="secondary"
              className="font-mono text-[11px] tracking-wider uppercase"
            >
              {formattedDate}
            </Badge>
            <span className="font-mono text-xs text-zinc-400">4 min read</span>
          </div>

          <h2 className="font-editorial mb-3 line-clamp-2 text-xl leading-snug font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300">
            {title}
          </h2>

          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100">
              Read story
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default PostCard;
