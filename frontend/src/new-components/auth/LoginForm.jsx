import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import authService from '@/appwrite/auth';
import { login } from '@/store/authSlice';
import { MarginIcon } from '@/new-components';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/new-components/ui/card';
import { Input } from '@/new-components/ui/input';
import { Button } from '@/new-components/ui/button';

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const session = await authService.login({
        email: data.email,
        password: data.password,
      });
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login({ userData }));
        }
        navigate('/');
      }
    } catch (err) {
      console.error('LoginForm :: login error', err);
      setServerError(
        err?.message || 'Invalid email or password. Please check your credentials.'
      );
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md">
      <Card className="border-zinc-200/80 bg-white shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none">
        <CardHeader className="space-y-2 pb-6 text-center">
          <div className="mx-auto flex justify-center">
            <MarginIcon className="size-11 transition-transform hover:scale-105" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            Enter your credentials to access your Margin account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {serverError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200/80 bg-red-50/70 p-3 text-xs text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="email"
                className="text-xs font-semibold tracking-wide text-zinc-700 select-none sm:text-sm dark:text-zinc-300"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                disabled={isSubmitting}
                className="h-10 text-sm focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/60"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs font-medium text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold tracking-wide text-zinc-700 select-none sm:text-sm dark:text-zinc-300"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className="h-10 pr-10 text-sm focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/60"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-10 w-full cursor-pointer bg-zinc-900 font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.99] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-zinc-100 pt-4 text-center sm:pt-5 dark:border-zinc-800/80">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
            >
              Sign up
            </Link>
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to stories</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
