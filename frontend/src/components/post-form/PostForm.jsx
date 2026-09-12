import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, RTE, Select } from '..';
import appwriteService from '../../appwrite/config1';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

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
      className="grid grid-cols-1 gap-8 lg:grid-cols-3"
    >
      {/* Editor Section */}
      <div className="space-y-6 lg:col-span-2">
        <Input
          label="Post Title"
          placeholder="Enter article title"
          className="w-full dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          {...register('title', { required: true })}
        />
        <Input
          label="Slug (URL Path)"
          placeholder="auto-generated-slug"
          className="w-full font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          {...register('slug', { required: true })}
          onInput={(e) => {
            setValue('slug', slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Article Content"
          name="content"
          control={control}
          defaultValue={getValues('content')}
        />
      </div>

      {/* Publishing Settings Sidebar */}
      <div className="h-fit space-y-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm lg:col-span-1 dark:border-zinc-800/80 dark:bg-zinc-900/60">
        {submitError && (
          <div className="rounded-lg border border-red-200/50 bg-red-50 p-3 text-sm font-medium text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
            {submitError}
          </div>
        )}
        <Input
          label="Featured Image"
          type="file"
          className="w-full cursor-pointer dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register('image', { required: !post })}
        />
        {post && (
          <div className="w-full overflow-hidden rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="max-h-48 w-full object-cover"
            />
          </div>
        )}
        <Select
          options={['active', 'inactive']}
          label="Publication Status"
          className="w-full dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          {...register('status', { required: true })}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {post ? 'Updating...' : 'Publishing...'}
            </>
          ) : post ? (
            'Update Article'
          ) : (
            'Publish Article'
          )}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
