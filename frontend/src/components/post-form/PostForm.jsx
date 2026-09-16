import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, RTE, Select } from '..';
import appwriteService from '../../appwrite/config1';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Loader2,
  AlertCircle,
  UploadCloud,
  FileImage,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveAuthor } from '@/lib/author';

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
  const [imageError, setImageError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragCounter = useRef(0);
  const fileInputRef = useRef(null);

  // Register image field in react-hook-form
  useEffect(() => {
    register('image', { required: !post && !previewUrl });
  }, [register, post, previewUrl]);

  // Clean up object URL on unmount or replace
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const existingImageUrl = post?.featuredImage
    ? appwriteService.getFilePreview(post.featuredImage)
    : null;

  const currentPreview = previewUrl || existingImageUrl;

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageError('Image size exceeds 10MB limit.');
      return;
    }

    setImageError(null);
    setSubmitError(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile({
      name: file.name,
      size:
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`,
    });

    setValue('image', files, { shouldValidate: true });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setIsDragging(false);
      dragCounter.current = 0;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (e) => {
    e?.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setImageError(null);
    setValue('image', null, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerUpload = (e) => {
    e?.stopPropagation();
    fileInputRef.current?.click();
  };

  const submit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (!userData?.$id) {
        throw new Error('Your session has expired. Please log in again to publish.');
      }

      if (post) {
        // --- UPDATE FLOW ---
        const file = data.image && data.image[0]
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
          setImageError('Please select a cover image for your article.');
          throw new Error('Please select a cover image for your article.');
        }

        const file = await appwriteService.uploadFile(data.image[0]);

        if (file) {
          if (userData?.$id && userData?.name) {
            saveAuthor(userData.$id, userData.name);
          }

          const fileId = file.$id;
          const dbPost = await appwriteService.createPost({
            title: data.title,
            slug: data.slug,
            content: data.content,
            featuredImage: fileId,
            status: data.status,
            userId: userData.$id,
            authorName: userData.name || '',
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

  const formContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const formSectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.form
      variants={formContainerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(submit)}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8"
    >
      {/* ─── Editor Section ─── */}
      <motion.div variants={formSectionVariants} className="space-y-5 lg:col-span-2">
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
      </motion.div>

      {/* ─── Sidebar: Publishing Settings ─── */}
      <motion.div variants={formSectionVariants} className="lg:col-span-1">
        <div className="sticky top-20 space-y-5 rounded-2xl border border-zinc-200/80 bg-white/60 p-5 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <h3 className="text-xs font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
            Publish Settings
          </h3>

          {/* Error message */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2 rounded-xl border border-red-200/60 bg-red-50/80 p-3 text-[13px] text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cover Image Upload Card */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                Cover Image
              </label>
              {selectedFile?.size && (
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                  {selectedFile.size}
                </span>
              )}
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFiles(e.target.files);
                }
              }}
            />

            <AnimatePresence mode="wait">
              {!currentPreview ? (
                /* Dropzone: Empty state */
                <motion.div
                  key="empty-dropzone"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  role="button"
                  tabIndex={0}
                  onClick={handleTriggerUpload}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleTriggerUpload(e);
                    }
                  }}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 outline-hidden ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/80 shadow-md ring-4 ring-indigo-500/20 scale-[1.01] dark:border-indigo-400 dark:bg-indigo-950/40 dark:ring-indigo-400/20'
                      : imageError
                      ? 'border-red-300 bg-red-50/30 hover:border-red-400 dark:border-red-800 dark:bg-red-950/20'
                      : 'border-zinc-200 bg-zinc-50/70 hover:border-indigo-400/70 hover:bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-500/50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
                      isDragging
                        ? 'scale-110 bg-indigo-500 text-white shadow-md'
                        : 'bg-white text-zinc-500 shadow-xs group-hover:scale-105 group-hover:text-indigo-600 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:text-indigo-400'
                    }`}
                  >
                    <UploadCloud className="h-6 w-6" />
                  </div>

                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {isDragging ? (
                      <span className="text-indigo-600 dark:text-indigo-400">
                        Drop your image here to upload
                      </span>
                    ) : (
                      <>
                        <span className="text-indigo-600 hover:underline dark:text-indigo-400">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                      </>
                    )}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                    PNG, JPG, WEBP, or GIF (up to 10MB)
                  </p>
                </motion.div>
              ) : (
                /* Preview Card state with Drag & Drop replacement support */
                <motion.div
                  key="preview-card"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-2.5 transition-all dark:border-zinc-800/80 dark:bg-zinc-900/40"
                >
                  {/* Drag overlay on top of preview */}
                  <AnimatePresence>
                    {isDragging && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-500 bg-indigo-950/85 p-4 text-center text-white backdrop-blur-xs"
                      >
                        <UploadCloud className="mb-2 h-7 w-7 animate-bounce text-indigo-300" />
                        <p className="text-sm font-semibold">Drop new cover image</p>
                        <p className="text-xs text-indigo-200">
                          Release to replace current cover
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Thumbnail Image Container */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-950 dark:border-zinc-800/60">
                    <img
                      src={currentPreview}
                      alt="Cover preview"
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-xs">
                      {previewUrl ? 'New Cover' : 'Current Cover'}
                    </div>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="mt-2.5 flex items-center justify-between gap-2 px-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <FileImage className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
                      <span className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {selectedFile ? selectedFile.name : 'Cover image'}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={handleTriggerUpload}
                        title="Change image"
                        className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Change</span>
                      </button>

                      {(previewUrl || !post) && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          title={previewUrl && post ? 'Revert to original' : 'Remove image'}
                          className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>{previewUrl && post ? 'Revert' : 'Remove'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image validation error */}
            <AnimatePresence>
              {imageError && (
                <motion.div
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mt-2 flex items-center gap-1.5 overflow-hidden text-xs text-red-500 dark:text-red-400"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{imageError}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
          <motion.div whileTap={{ scale: 0.985 }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
          </motion.div>
        </div>
      </motion.div>
    </motion.form>
  );
}

export default PostForm;
