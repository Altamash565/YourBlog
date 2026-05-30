import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className="w-full py-12 mt-auto border-t border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Copyright */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <Logo width="45px" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                YourBlog
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              &copy; {new Date().getFullYear()} YourBlog. All Rights Reserved.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/">
                  Features
                </Link>
              </li>
              <li>
                <Link className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/">
                  Pricing
                </Link>
              </li>
              <li>
                <Link className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/">
                  Account
                </Link>
              </li>
              <li>
                <Link className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/">
                  Help
                </Link>
              </li>
              <li>
                <Link className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/">
                  Licensing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer