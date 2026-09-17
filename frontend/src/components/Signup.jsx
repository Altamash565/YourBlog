import React, { useState } from 'react';
import authService from '../appwrite/auth';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Button, Input, Logo } from './index.js';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const create = async (data) => {
    setError('');
    try {
      const session = await authService.createAccount(data);
      if (session) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) dispatch(login({ userData: currentUser }));
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex w-full items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}
        className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-xl shadow-zinc-200/40 transition-colors duration-300 sm:p-10 dark:border-zinc-800/60 dark:bg-zinc-900 dark:shadow-none"
      >
        {/* Branding Logo */}
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <h2 className="text-center text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create account
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-semibold text-zinc-900 transition-colors duration-200 hover:text-zinc-700 hover:underline dark:text-zinc-100 dark:hover:text-zinc-300"
          >
            Sign In
          </Link>
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-lg border border-red-200/50 bg-red-50 p-3 text-center text-sm font-medium text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(create)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                className="dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                {...register('name', {
                  required: 'Full name is required',
                })}
              />
              {errors.name && (
                <p className="mt-1.5 pl-1 text-xs font-medium text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                className="dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                {...register('email', {
                  required: 'Email is required',
                  validate: {
                    matchPattern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      'Email address must be a valid address',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1.5 pl-1 text-xs font-medium text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                className="dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1.5 pl-1 text-xs font-medium text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default Signup;
