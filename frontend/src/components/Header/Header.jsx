import React, { useState } from 'react';
import { Container, Logo, LogoutBtn } from '../index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, FileText, PlusCircle, LogIn, UserPlus, Menu, X } from 'lucide-react';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true,
      icon: Home,
    },
    {
      name: 'Login',
      slug: '/login',
      active: !authStatus,
      icon: LogIn,
    },
    {
      name: 'Signup',
      slug: '/signup',
      active: !authStatus,
      icon: UserPlus,
    },
    {
      name: 'All Posts',
      slug: '/all-posts',
      active: authStatus,
      icon: FileText,
    },
    {
      name: 'Add Post',
      slug: '/add-post',
      active: authStatus,
      icon: PlusCircle,
    },
  ];

  const handleNavigation = (slug) => {
    navigate(slug);
    setIsOpen(false); // Close mobile menu on navigate
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo / Branding */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Logo width="45px" />
              <span className="hidden bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent sm:block">
                YourBlog
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              if (!item.active) return null;
              const Icon = item.icon;
              const isActive = location.pathname === item.slug;

              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.slug)}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-indigo-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}

            {authStatus && (
              <li className="ml-2 flex items-center gap-4 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                {userData && (
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Hi, {userData.name.split(' ')[0]}
                  </span>
                )}
                <LogoutBtn />
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-900"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="animate-in slide-in-from-top space-y-2 border-t border-zinc-100 py-4 duration-200 md:hidden dark:border-zinc-900">
            <ul className="space-y-1">
              {navItems.map((item) => {
                if (!item.active) return null;
                const Icon = item.icon;
                const isActive = location.pathname === item.slug;

                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.slug)}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-base font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                          : 'text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-indigo-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}

              {authStatus && (
                <li className="mt-2 flex flex-col gap-3 border-t border-zinc-100 px-4 pt-4 dark:border-zinc-900">
                  {userData && (
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Logged in as: {userData.name}
                    </span>
                  )}
                  <div className="flex w-full justify-end">
                    <LogoutBtn />
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
