import React, { useState } from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Home, FileText, PlusCircle, LogIn, UserPlus, Menu, X } from 'lucide-react'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true,
      icon: Home
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
      icon: LogIn
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
      icon: UserPlus
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
      icon: FileText
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
      icon: PlusCircle
    },
  ]

  const handleNavigation = (slug) => {
    navigate(slug)
    setIsOpen(false) // Close mobile menu on navigate
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors duration-300">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo / Branding */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <Logo width="45px" />
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                YourBlog
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              if (!item.active) return null;
              const Icon = item.icon;
              const isActive = location.pathname === item.slug;
              
              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.slug)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                      ${isActive 
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' 
                        : 'text-zinc-600 hover:text-indigo-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-indigo-400 dark:hover:bg-zinc-900'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}

            {authStatus && (
              <li className="flex items-center gap-4 ml-2 border-l border-zinc-200 dark:border-zinc-800 pl-4">
                {userData && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
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
            className="flex items-center justify-center p-2 rounded-lg md:hidden text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden border-t border-zinc-100 dark:border-zinc-900 py-4 space-y-2 animate-in slide-in-from-top duration-200">
            <ul className="space-y-1">
              {navItems.map((item) => {
                if (!item.active) return null;
                const Icon = item.icon;
                const isActive = location.pathname === item.slug;

                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.slug)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-150 cursor-pointer
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' 
                          : 'text-zinc-600 hover:text-indigo-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-indigo-400 dark:hover:bg-zinc-900'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}

              {authStatus && (
                <li className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-900 px-4 flex flex-col gap-3">
                  {userData && (
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Logged in as: {userData.name}
                    </span>
                  )}
                  <div className="w-full flex justify-end">
                    <LogoutBtn />
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header


