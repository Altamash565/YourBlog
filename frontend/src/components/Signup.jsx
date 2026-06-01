import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Input, Logo } from './index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

    const create = async (data) => {
        setError("")
        try {
            const session = await authService.createAccount(data)
            if (session) {
                const currentUser = await authService.getCurrentUser()
                if (currentUser) dispatch(login({userData: currentUser}));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center w-full py-12 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                className="mx-auto w-full max-w-md bg-white border border-zinc-200/60 rounded-2xl p-8 sm:p-10 shadow-xl shadow-zinc-200/40 dark:bg-zinc-900 dark:border-zinc-800/60 dark:shadow-none transition-colors duration-300"
            >
                
                {/* Branding Logo */}
                <div className="mb-6 flex justify-center">
                    <span className="inline-block w-full max-w-[80px] transition-transform hover:scale-105">
                        <Logo width="100%" />
                    </span>
                </div>

                <h2 className="text-center text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Create account
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-semibold text-indigo-600 dark:text-indigo-400 transition-colors duration-200 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50 text-red-600 border border-red-200/50 rounded-lg p-3 mt-6 text-sm text-center font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400"
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
                                className="dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                                {...register("name", {
                                    required: "Full name is required",
                                })}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1.5 pl-1 font-medium">{errors.name.message}</p>
                            )}
                        </div>

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
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1.5 pl-1 font-medium">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </form>
            </motion.div>
        </div>
    )
}

export default Signup