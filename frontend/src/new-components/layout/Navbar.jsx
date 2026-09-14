import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  PanelLeft,
  Search,
  PenSquare,
  Compass,
  FileText,
  LogOut,
  User,
  X,
  Sparkles,
  BookOpen,
  TrendingUp,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { SidebarTrigger, useSidebar } from '@/new-components/ui/sidebar';
import { cn } from '@/lib/utils';

import authService from '@/appwrite/auth';
import { logout } from '@/store/authSlice';
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
  ThemeToggle,
} from '@/new-components/ui';

export default function Navbar() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isHome = location.pathname === '/';

  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Sync searchQuery with URL params when on Home page
  useEffect(() => {
    if (isHome) {
      const q = searchParams.get('search') || '';
      setSearchQuery(q);
    }
  }, [searchParams, isHome]);

  // Focus search input when mobile search is opened
  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  // Global keyboard shortcut (⌘K or Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        } else {
          setIsMobileSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (isHome) {
      if (value) {
        setSearchParams({ search: value }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    if (isHome) {
      setSearchParams({}, { replace: true });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (isHome) {
      if (trimmed) {
        setSearchParams({ search: trimmed });
      } else {
        setSearchParams({});
      }
    } else {
      if (trimmed) {
        navigate(`/?search=${encodeURIComponent(trimmed)}`);
      } else {
        navigate('/');
      }
    }
    setIsMobileSearchOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userInitial = userData?.name ? userData.name.trim().charAt(0).toUpperCase() : 'U';

  const categories = [
    'Technology',
    'Design',
    'Engineering',
    'AI & Data',
    'Productivity',
    'Startups',
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= LEFT SECTION ================= */}

        <div className="flex flex-1 items-center gap-2.5 md:gap-3">
          {/* Official Shadcn Sidebar Trigger - hidden on desktop when sidebar is collapsed */}
          <SidebarTrigger
            className={cn(
              '-ml-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
              !isMobile && isCollapsed && 'hidden'
            )}
          />

          {/* Mobile Logo with Name */}
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <span className="font-editorial text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              YourBlog
            </span>
          </Link>

          {!isMobile && !isCollapsed && (
            <Separator orientation="vertical" className="mr-1 hidden h-4 md:block" />
          )}

          {/* Desktop Search Bar (Left-aligned like Medium / Hashnode) */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden w-56 sm:block md:w-72 lg:w-80"
          >
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <Input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search articles..."
              className="h-9 w-full rounded-lg border-zinc-200 bg-zinc-50/70 pr-12 pl-8 text-xs focus:bg-white focus:ring-1 focus:ring-zinc-400 sm:text-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:focus:bg-zinc-900 dark:focus:ring-zinc-700"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 select-none md:flex dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
                <span className="text-xs">⌘</span>K
              </kbd>
            )}
          </form>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            className="h-9 w-9 text-zinc-600 sm:hidden dark:text-zinc-400"
            aria-label="Toggle mobile search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggler Button (next-themes + animated SolarSwitch) */}
          <ThemeToggle className="h-9 w-9 rounded-lg border-zinc-200/80 bg-transparent text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-900" />

          {/* Write Action Button (When Authenticated) */}

          {authStatus && (
            <Button
              asChild
              variant="outline"
              className="hidden h-9 items-center gap-1.5 rounded-lg border-zinc-200/80 bg-transparent px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 md:inline-flex dark:border-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            >
              <Link to="/add-post">
                <PenSquare className="h-4 w-4" />
                <span>Write</span>
              </Link>
            </Button>
          )}

          {/* Profile / Signup Button Section */}
          {!authStatus ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden text-xs font-medium text-zinc-700 hover:bg-zinc-100 sm:inline-flex dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                <Link to="/login">Log In</Link>
              </Button>

              <Button
                size="sm"
                asChild
                className="h-8 rounded-lg bg-zinc-900 px-3 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          ) : (
            /* Authenticated User Profile Dropdown */
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="relative flex cursor-pointer items-center rounded-full p-0.5 ring-offset-2 outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-zinc-900 text-[11px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="z-[100] w-60 border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <DropdownMenuLabel className="px-2 py-1.5 font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-semibold text-zinc-900 dark:text-zinc-100">
                      {userData?.name || 'Author'}
                    </p>
                    <p className="truncate text-xs leading-none text-zinc-500 dark:text-zinc-400">
                      {userData?.email || 'author@yourblog.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  onClick={() => navigate('/add-post')}
                  className="cursor-pointer gap-2"
                >
                  <PenSquare className="h-4 w-4 text-zinc-500" />
                  <span>Write Article</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate('/all-posts')}
                  className="cursor-pointer gap-2"
                >
                  <FileText className="h-4 w-4 text-zinc-500" />
                  <span>All Articles</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate('/')}
                  className="cursor-pointer gap-2"
                >
                  <Compass className="h-4 w-4 text-zinc-500" />
                  <span>Explore Feed</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950/40"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {isMobileSearchOpen && (
        <div className="border-t border-zinc-200/80 bg-white/95 px-4 py-2.5 sm:hidden dark:border-zinc-800/80 dark:bg-zinc-950/95">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search articles, topics..."
              className="h-9 w-full rounded-lg pr-8 pl-9 text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSearchClear}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
