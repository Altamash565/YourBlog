import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/new-components/ui/dialog';
import { Button } from '@/new-components/ui/button';
import { Mail, ArrowUpRight } from 'lucide-react';

export function HelpSupportDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <DialogHeader className="space-y-1 pb-4 text-left">
          <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Help & Support
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
            Keyboard shortcuts and assistance for Margin
          </DialogDescription>
        </DialogHeader>

        {/* Shortcuts Section */}
        <div className="space-y-2.5 border-t border-zinc-100 py-3.5 dark:border-zinc-800/80">
          <p className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            Shortcuts
          </p>

          <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
            <div className="flex items-center justify-between">
              <span>Search articles</span>
              <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                ⌘K / Ctrl+K
              </kbd>
            </div>

            <div className="flex items-center justify-between">
              <span>Theme toggle</span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Top bar icon
              </span>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="space-y-2.5 border-t border-zinc-100 py-3.5 dark:border-zinc-800/80">
          <p className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            Assistance
          </p>

          <a
            href="mailto:support@margin.com"
            className="group flex items-center justify-between py-1 text-xs text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
              <span>Email Support</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300">
              support@margin.com
              <ArrowUpRight className="size-3" />
            </span>
          </a>
        </div>

        {/* Minimal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4 text-[11px] text-zinc-400 dark:border-zinc-800/80 dark:text-zinc-500">
          <span>Margin v2.4.0</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-7 cursor-pointer px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HelpSupportDialog;
