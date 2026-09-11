import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-zinc-200 bg-zinc-100 py-12 text-zinc-600 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Copyright */}
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Logo width="45px" />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent">
                YourBlog
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              &copy; {new Date().getFullYear()} YourBlog. All Rights Reserved.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-sm transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  to="/"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  to="/"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  to="/"
                >
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-sm transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  to="/"
                >
                  Account
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  to="/"
                >
                  Help
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  to="/"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-sm transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  to="/"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  to="/"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                  to="/"
                >
                  Licensing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
