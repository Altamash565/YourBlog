import React, { useState } from 'react';
import { Container, Logo } from '../index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  PenSquare,
  Compass,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  FileText,
  User,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import authService from '@/appwrite/auth';
import { ThemeToggle } from '@/new-components/ui/theme-toggle';

import {
  Button,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logout());
      navigate('/');
    });
  };

  const navItems = [
    {
      name: 'Explore',
      slug: '/',
      active: true,
      icon: Compass,
    },
    {
      name: 'All Articles',
      slug: '/all-posts',
      active: authStatus,
      icon: FileText,
    },
  ];

  const handleNavigation = (slug) => {
    navigate(slug);
    setIsOpen(false);
  };

  const userInitial = userData?.name ? userData.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-md transition-colors duration-200 dark:border-zinc-800/80 dark:bg-zinc-950/85">
      <Container>
        <nav className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-5 md:flex">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                if (!item.active) return null;
                const isActive = location.pathname === item.slug;

                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.slug)}
                      className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3 border-l border-zinc-200 pl-4 dark:border-zinc-800">
              {/* Animated Theme Toggle Button */}
              <ThemeToggle className="h-8 w-8 rounded-lg" />

              {/* Guest / User Auth Actions */}

              {!authStatus ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button size="sm" asChild className="gap-1.5">
                    <Link to="/add-post">
                      <PenSquare className="h-3.5 w-3.5" />
                      <span>Write</span>
                    </Link>
                  </Button>

                  {/* shadcn User Dropdown Menu */}
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button className="cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-zinc-400/40">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{userInitial}</AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm leading-none font-medium text-zinc-900 dark:text-zinc-100">
                            {userData?.name || 'Author'}
                          </p>
                          <p className="text-xs leading-none text-zinc-500 dark:text-zinc-400">
                            {userData?.email || ''}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/add-post')}>
                        <PenSquare className="mr-2 h-4 w-4" />
                        <span>Write Article</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/all-posts')}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>All Articles</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 focus:text-red-600 dark:text-red-400"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions & Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 text-zinc-500 dark:text-zinc-400"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-8 text-zinc-600 dark:text-zinc-400"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="space-y-3 border-t border-zinc-100 py-3 md:hidden dark:border-zinc-900">
            <ul className="space-y-1">
              {navItems.map((item) => {
                if (!item.active) return null;
                const isActive = location.pathname === item.slug;

                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.slug)}
                      className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}

              {!authStatus ? (
                <li className="flex flex-col gap-2 pt-2">
                  <Button variant="outline" asChild className="w-full justify-center">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-center">
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </li>
              ) : (
                <li className="flex flex-col gap-2 pt-2">
                  <Button asChild className="w-full justify-center gap-2">
                    <Link to="/add-post" onClick={() => setIsOpen(false)}>
                      <PenSquare className="h-4 w-4" />
                      <span>Write an Article</span>
                    </Link>
                  </Button>
                  <div className="flex items-center justify-between px-2 pt-2">
                    <span className="text-xs text-zinc-500">
                      Signed in as {userData?.name || 'Author'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-xs"
                    >
                      Sign out
                    </Button>
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Header;
