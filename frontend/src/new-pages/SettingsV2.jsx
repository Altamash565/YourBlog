import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import authService from '@/appwrite/auth';
import { logout } from '@/store/authSlice';
import { Button } from '@/new-components/ui/button';
import { Sun, Moon, Laptop, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsV2() {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem('margin_autosave') !== 'false';
  });
  const [readingMode, setReadingMode] = useState(() => {
    return localStorage.getItem('margin_reading_mode') === 'true';
  });

  const userName = userData?.name || 'Author';
  const userEmail = userData?.email || '';

  const toggleAutoSave = () => {
    const next = !autoSave;
    setAutoSave(next);
    localStorage.setItem('margin_autosave', String(next));
  };

  const toggleReadingMode = () => {
    const next = !readingMode;
    setReadingMode(next);
    localStorage.setItem('margin_reading_mode', String(next));
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('SettingsV2 :: logout error:', err);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
          Settings
        </h1>
        <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
          Manage your appearance, reading preferences, and session
        </p>
      </div>

      <div className="space-y-8">
        {/* ========================================================================= */}
        {/* 1. APPEARANCE & THEME                                                     */}
        {/* ========================================================================= */}
        <div className="space-y-3 border-b border-zinc-200/60 pb-8 dark:border-zinc-800/60">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Appearance
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Choose your preferred interface theme
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={cn(
                'flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all select-none',
                theme === 'light'
                  ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:bg-zinc-900'
              )}
            >
              <Sun className="size-3.5" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={cn(
                'flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all select-none',
                theme === 'dark'
                  ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:bg-zinc-900'
              )}
            >
              <Moon className="size-3.5" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={cn(
                'flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all select-none',
                theme === 'system'
                  ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:bg-zinc-900'
              )}
            >
              <Laptop className="size-3.5" />
              <span>System</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. WRITING & READING PREFERENCES                                          */}
        {/* ========================================================================= */}
        <div className="space-y-3 border-b border-zinc-200/60 pb-8 dark:border-zinc-800/60">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Preferences
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Writing and reading workflow settings
            </p>
          </div>

          <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80 bg-white dark:divide-zinc-800/80 dark:border-zinc-800 dark:bg-zinc-900/30">
            <div
              onClick={toggleAutoSave}
              className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/60"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Auto-save drafts
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Continuously persist changes while editing articles
                </p>
              </div>
              <div
                className={cn(
                  'h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors',
                  autoSave
                    ? 'bg-zinc-900 dark:bg-zinc-100'
                    : 'bg-zinc-200 dark:bg-zinc-700'
                )}
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded-full bg-white shadow-xs transition-transform dark:bg-zinc-900',
                    autoSave ? 'translate-x-4' : 'translate-x-0'
                  )}
                />
              </div>
            </div>

            <div
              onClick={toggleReadingMode}
              className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/60"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Comfortable reading width
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Optimize article line length for enhanced readability
                </p>
              </div>
              <div
                className={cn(
                  'h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors',
                  readingMode
                    ? 'bg-zinc-900 dark:bg-zinc-100'
                    : 'bg-zinc-200 dark:bg-zinc-700'
                )}
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded-full bg-white shadow-xs transition-transform dark:bg-zinc-900',
                    readingMode ? 'translate-x-4' : 'translate-x-0'
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SESSION & LOGOUT                                                       */}
        {/* ========================================================================= */}
        <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Account Session
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Signed in as{' '}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {userName}
              </span>{' '}
              {userEmail && `(${userEmail})`}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="h-8 cursor-pointer gap-1.5 self-start rounded-lg border-zinc-200 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 sm:self-auto dark:border-zinc-800 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <LogOut className="size-3.5" />
            <span>Sign out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
