import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form' 
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [error, setError] = useState("")
  
  const login = async(data) => {
    setError("")
    try {
      const session = await authService.login(data)
      if (session) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(authLogin({userData}));
        navigate("/")
      }

    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className='flex items-center justify-center w-full py-12 px-4'>
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}
        className='mx-auto w-full max-w-md bg-white border border-zinc-200/60 rounded-2xl p-8 sm:p-10 shadow-xl shadow-zinc-200/40 dark:bg-zinc-900 dark:border-zinc-800/60 dark:shadow-none transition-colors duration-300'
      >
        
        {/* Branding Logo */}
        <div className='mb-6 flex justify-center'>
          <span className='inline-block w-full max-w-[80px] transition-transform hover:scale-105'>
            <Logo width='100%' />
          </span>
        </div>

        <h2 className='text-center text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight'>
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 dark:text-indigo-400 transition-colors duration-200 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-red-50 text-red-600 border border-red-200/50 rounded-lg p-3 mt-6 text-sm text-center font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400'
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(login)} className='mt-8 space-y-6'>
          <div className='space-y-4'>
            <div>
              <Input
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                className="dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    matchPattern: (value) => 
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Email address must be a valid address",
                  }
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5 pl-1 font-medium">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                className="dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5 pl-1 font-medium">{errors.password.message}</p>
              )}
            </div>
          </div>

          <Button 
            type='submit' 
            disabled={isSubmitting}
            className='w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

      </motion.div>
    </div>
  )
}

export default Login