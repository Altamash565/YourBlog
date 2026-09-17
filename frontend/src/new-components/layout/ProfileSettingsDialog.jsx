import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/new-components/ui/dialog';
import { Avatar, AvatarFallback } from '@/new-components/ui/avatar';
import { Button } from '@/new-components/ui/button';
import { Badge } from '@/new-components/ui/badge';
import { Input } from '@/new-components/ui/input';
import { useTheme } from 'next-themes';
import {
  User,
  Settings,
  Shield,
  Sun,
  Moon,
  Laptop,
  Check,
  LogOut,
  Mail,
  Sparkles,
  Bookmark,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfileSettingsDialog({
  open,
  onOpenChange,
  initialTab = 'profile',
  userData,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { theme, setTheme } = useTheme();
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  const userName = userData?.name || 'Creator';
  const userEmail = userData?.email || 'author@margin.com';
  const userId = userData?.$id || 'usr_margin_author';
  const userInitial = userName.trim().charAt(0).toUpperCase();

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(userId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-0 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        {/* Header Hero */}
        <div className="border-b border-zinc-200/80 bg-zinc-50/70 p-6 dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-sm dark:border-zinc-800">
              <AvatarFallback className="rounded-2xl bg-zinc-900 text-lg font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {userName}
                </h3>
                <Badge
                  variant="secondary"
                  className="py-0.2 px-2 text-[10px] font-semibold tracking-wider uppercase"
                >
                  Author
                </Badge>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <Mail className="size-3.5" />
                <span>{userEmail}</span>
              </p>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="mt-5 flex rounded-xl border border-zinc-200/80 bg-zinc-200/50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all select-none',
                activeTab === 'profile'
                  ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              )}
            >
              <User className="size-3.5" />
              <span>Profile</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all select-none',
                activeTab === 'settings'
                  ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              )}
            >
              <Settings className="size-3.5" />
              <span>Settings</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('help')}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all select-none',
                activeTab === 'help'
                  ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              )}
            >
              <HelpCircle className="size-3.5" />
              <span>About</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Display Name
                </label>
                <Input
                  value={userName}
                  readOnly
                  className="bg-zinc-50 dark:bg-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Email Address
                </label>
                <Input
                  value={userEmail}
                  readOnly
                  className="bg-zinc-50 dark:bg-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Author ID
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {copiedId ? 'Copied!' : 'Copy ID'}
                  </button>
                </div>
                <Input
                  value={userId}
                  readOnly
                  className="bg-zinc-50 font-mono text-xs dark:bg-zinc-900"
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-5">
              {/* Theme Picker */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Appearance & Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all',
                      theme === 'light'
                        ? 'border-zinc-900 bg-zinc-50 text-zinc-900 ring-2 ring-zinc-900/10 dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-100/10'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900'
                    )}
                  >
                    <Sun className="size-4" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all',
                      theme === 'dark'
                        ? 'border-zinc-900 bg-zinc-50 text-zinc-900 ring-2 ring-zinc-900/10 dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-100/10'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900'
                    )}
                  >
                    <Moon className="size-4" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all',
                      theme === 'system'
                        ? 'border-zinc-900 bg-zinc-50 text-zinc-900 ring-2 ring-zinc-900/10 dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-100/10'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900'
                    )}
                  >
                    <Laptop className="size-4" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Preferences list */}
              <div className="space-y-3 rounded-xl border border-zinc-200/80 p-3.5 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Editorial Typography
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Inter sans-serif with serif headings
                    </p>
                  </div>
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Auto-save Drafts
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Real-time publishing persistence
                    </p>
                  </div>
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-3 text-left">
              <div className="space-y-2 rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-editorial text-base font-bold italic">
                    Margin Platform
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Margin is a modern editorial publishing platform for writers,
                  developers, and thinkers.
                </p>
              </div>

              <div className="space-y-2 rounded-xl border border-zinc-200/80 p-3.5 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Version</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100">
                    v2.4.0
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Support</span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    support@margin.com
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-zinc-200/80 bg-zinc-50/50 px-6 py-3.5 dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="h-8 gap-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <LogOut className="size-3.5" />
            <span>Sign out</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs font-medium"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileSettingsDialog;
