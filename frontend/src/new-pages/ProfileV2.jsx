import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import appwriteService from '@/appwrite/config1';
import authService from '@/appwrite/auth';
import { login } from '@/store/authSlice';
import { saveAuthor } from '@/lib/author';
import { Avatar, AvatarFallback, AvatarImage } from '@/new-components/ui/avatar';
import { Button } from '@/new-components/ui/button';
import { Input } from '@/new-components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/new-components/ui/dialog';
import { ArrowUpRight, Pencil, Camera, Trash2, Upload } from 'lucide-react';

export default function ProfileV2() {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Avatar states
  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  const userName = userData?.name || 'Author';
  const userEmail = userData?.email || '';
  const userInitial = userName.trim().charAt(0).toUpperCase();

  const currentAvatarUrl =
    userData?.prefs?.avatarUrl ||
    userData?.avatarUrl ||
    (userData?.$id ? localStorage.getItem(`margin_avatar_${userData.$id}`) : null) ||
    '';

  useEffect(() => {
    let isMounted = true;
    if (userData?.$id) {
      setLoadingPosts(true);
      appwriteService
        .getPosts()
        .then((res) => {
          if (isMounted && res?.documents) {
            const authored = res.documents.filter(
              (p) => p.userId === userData.$id || p.authorId === userData.$id
            );
            setUserPosts(authored);
          }
        })
        .catch((err) => {
          console.error('ProfileV2 :: getPosts error:', err);
        })
        .finally(() => {
          if (isMounted) setLoadingPosts(false);
        });
    } else {
      setLoadingPosts(false);
    }

    return () => {
      isMounted = false;
    };
  }, [userData?.$id]);

  const handleOpenDialog = () => {
    setNameInput(userName);
    setAvatarFile(null);
    setAvatarPreview(currentAvatarUrl);
    setAvatarRemoved(false);
    setError('');
    setIsDialogOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    setError('');
    setAvatarFile(file);
    setAvatarRemoved(false);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    setAvatarRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const cleanName = nameInput.trim();
    if (!cleanName) return;

    setSaving(true);
    setError('');

    try {
      let finalAvatarUrl = currentAvatarUrl;

      // 1. If user uploaded a new avatar file
      if (avatarFile) {
        try {
          const uploaded = await appwriteService.uploadFile(avatarFile);
          if (uploaded?.$id) {
            finalAvatarUrl = appwriteService.getFilePreview(uploaded.$id);
          }
        } catch (uploadErr) {
          console.warn('Appwrite upload failed, fallback to local data URL:', uploadErr);
          // Fallback to base64 Data URL so the photo update is never blocked
          finalAvatarUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(avatarFile);
          });
        }
      } else if (avatarRemoved) {
        finalAvatarUrl = '';
      }

      // 2. Update name via Appwrite
      let updatedUser = userData;
      if (cleanName !== userName) {
        updatedUser = await authService.updateName(cleanName);
      }

      // 3. Update preferences in Appwrite and localStorage
      const updatedPrefs = {
        ...(updatedUser?.prefs || {}),
        avatarUrl: finalAvatarUrl,
      };

      try {
        await authService.updatePrefs(updatedPrefs);
      } catch (prefErr) {
        console.warn('Appwrite updatePrefs error:', prefErr);
      }

      if (userData?.$id) {
        if (finalAvatarUrl) {
          localStorage.setItem(`margin_avatar_${userData.$id}`, finalAvatarUrl);
        } else {
          localStorage.removeItem(`margin_avatar_${userData.$id}`);
        }
      }

      // 4. Update Redux state and author mapping
      const combinedUserData = {
        ...updatedUser,
        name: cleanName,
        prefs: updatedPrefs,
        avatarUrl: finalAvatarUrl,
      };

      dispatch(login({ userData: combinedUserData }));

      if (userData?.$id) {
        saveAuthor(userData.$id, cleanName);
      }

      setIsDialogOpen(false);
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      {/* Profile Header */}
      <div className="flex flex-col items-start justify-between gap-5 border-b border-zinc-200/80 pb-8 sm:flex-row sm:items-center sm:gap-6 dark:border-zinc-800">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
          <Avatar className="h-20 w-20 shrink-0 rounded-full border border-zinc-200 sm:h-24 sm:w-24 dark:border-zinc-800">
            {currentAvatarUrl && (
              <AvatarImage
                src={currentAvatarUrl}
                alt={userName}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-zinc-900 text-2xl font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
              {userInitial}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              {userName}
            </h1>

            {userEmail && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{userEmail}</p>
            )}

            <p className="pt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Author on Margin • {userPosts.length}{' '}
              {userPosts.length === 1 ? 'Story' : 'Stories'}
            </p>
          </div>
        </div>

        {/* Update Profile Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenDialog}
          className="h-8 shrink-0 cursor-pointer gap-1.5 rounded-lg border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
        >
          <Pencil className="size-3" />
          <span>Update Profile</span>
        </Button>
      </div>

      {/* Published Stories Section */}
      <div className="pt-8">
        <h2 className="mb-6 text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
          Published Stories
        </h2>

        {loadingPosts ? (
          <div className="py-12 text-center text-xs text-zinc-400">
            Loading stories...
          </div>
        ) : userPosts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No stories published yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
            {userPosts.map((post) => (
              <article key={post.$id} className="group py-6 first:pt-0">
                <Link to={`/post/${post.$id}`} className="block space-y-1.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-base font-semibold text-zinc-900 underline-offset-4 group-hover:underline sm:text-lg dark:text-zinc-100">
                      {post.title}
                    </h3>
                    <ArrowUpRight className="size-4 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  {post.content && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500 sm:text-sm dark:text-zinc-400">
                      {post.content.replace(/<[^>]*>?/gm, '').slice(0, 160)}...
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                    <span>
                      {new Date(post.$createdAt || Date.now()).toLocaleDateString(
                        undefined,
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Simple Minimal Update Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Update Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Update your author photo and display name.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateProfile} className="space-y-4 pt-2">
            {/* Photo / Avatar Uploader */}
            <div className="flex flex-col items-center justify-center gap-3 py-1">
              <div className="group relative">
                <Avatar className="h-20 w-20 rounded-full border-2 border-zinc-200 dark:border-zinc-800">
                  {avatarPreview && (
                    <AvatarImage
                      src={avatarPreview}
                      alt={userName}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-zinc-900 text-xl font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  title="Upload photo"
                >
                  <Camera className="size-5" />
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 gap-1.5 px-2.5 text-xs"
                >
                  <Upload className="size-3" />
                  <span>Upload Photo</span>
                </Button>

                {avatarPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    className="h-7 px-2 text-xs text-zinc-500 hover:text-red-600 dark:hover:text-red-400"
                    title="Remove photo"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Display Name Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="author-display-name"
                className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Display Name
              </label>
              <Input
                id="author-display-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your author name"
                className="h-9 text-xs"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Email Address
              </label>
              <Input
                value={userEmail}
                disabled
                className="h-9 cursor-not-allowed bg-zinc-50 text-xs opacity-70 dark:bg-zinc-900/60"
              />
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="h-8 text-xs font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={saving || !nameInput.trim()}
                className="h-8 rounded-lg bg-zinc-900 px-3.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
