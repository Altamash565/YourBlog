import React, { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, RTE, Select } from '..';
import appwriteService from '../../appwrite/config1';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2, ImagePlus, AlertCircle } from 'lucide-react';

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      status: post?.status || 'active',
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const submit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Robust auth check - verify both the redux state AND the $id field
      if (!userData?.$id) {
        throw new Error('Your session has expired. Please log in again to publish.');
      }

      if (post) {
        // --- UPDATE FLOW ---
        const file = data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;

        if (file) {
          // Clean up old image from storage
          await appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.slug || post.$id, {
          title: data.title,
          content: data.content,
          status: data.status,
          featuredImage: file ? file.$id : post.featuredImage,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.slug || dbPost.$id}`);
        }
      } else {
        // --- CREATE FLOW ---
        if (!data.image || !data.image[0]) {
          throw new Error('Please select a featured image for your article.');
        }

        const file = await appwriteService.uploadFile(data.image[0]);

        if (file) {
          const fileId = file.$id;
          const dbPost = await appwriteService.createPost({
            title: data.title,
            slug: data.slug,
            content: data.content,
            featuredImage: fileId,
            status: data.status,
            userId: userData.$id,
          });
          if (dbPost) {
            navigate(`/post/${dbPost.slug || dbPost.$id}`);
          }
        } else {
          throw new Error('Failed to upload image. Please try again.');
        }
      }
    } catch (error) {
      console.error('PostForm :: submit :: error', error);
      setSubmitError(error.message || 'Failed to save post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === 'string')
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, '-')
        .replace(/\s/g, '-')
        .slice(0, 36);

    return '';
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue('slug', slugTransform(value.title, { shouldvalidate: true }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8"
    >
      {/* ─── Editor Section ─── */}
      <div className="space-y-5 lg:col-span-2">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            Title
          </label>
          <Input
            placeholder="Give your story a title…"
            className="w-full text-base dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            {...register('title', { required: true })}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            Slug
          </label>
          <Input
            placeholder="auto-generated-slug"
            className="w-full text-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            {...register('slug', { required: true })}
            onInput={(e) => {
              setValue('slug', slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              });
            }}
          />
          <p className="mt-1 pl-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            URL-friendly identifier, auto-generated from title
          </p>
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            Content
          </label>
          <RTE
            name="content"
            control={control}
            defaultValue={getValues('content')}
          />
        </div>
      </div>

      {/* ─── Sidebar: Publishing Settings ─── */}
      <div className="lg:col-span-1">
        <div className="sticky top-20 space-y-5 rounded-2xl border border-zinc-200/80 bg-white/60 p-5 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <h3 className="text-xs font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
            Publish Settings
          </h3>

          {/* Error message */}
          {submitError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200/60 bg-red-50/80 p-3 text-[13px] text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Featured Image */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Cover Image
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/60 px-4 py-6 text-center transition-colors hover:border-zinc-300 hover:bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/40">
              <ImagePlus className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Click to upload image
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                PNG, JPG, GIF
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register('image', { required: !post })}
              />
            </label>
          </div>

          {/* Existing image preview (edit mode) */}
          {post && post.featuredImage && (
            <div className="overflow-hidden rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="h-36 w-full object-cover"
              />
            </div>
          )}

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              defaultValue={post?.status || 'active'}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={['active', 'inactive']}
                  className="w-full"
                />
              )}
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {post ? 'Updating…' : 'Publishing…'}
              </>
            ) : post ? (
              'Update Article'
            ) : (
              'Publish Article'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default PostForm;
