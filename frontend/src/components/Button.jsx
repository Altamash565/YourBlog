import React from 'react'
import { motion } from 'framer-motion'

const Button = React.forwardRef(({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer duration-200'
  
  const variants = {
    default: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/10 active:scale-[0.98]',
    destructive: 'bg-rose-600 text-white hover:bg-rose-500 shadow-sm active:scale-[0.98]',
    outline: 'border border-zinc-200/80 bg-white text-zinc-800 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800/80 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 active:scale-[0.98]',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-850 dark:text-zinc-200 dark:hover:bg-zinc-800 active:scale-[0.98]',
    ghost: 'hover:bg-zinc-100 hover:text-zinc-900 text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 active:scale-[0.98]',
    link: 'text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400'
  }

  const sizes = {
    default: 'h-10 px-5 py-2.5',
    sm: 'h-9 rounded-lg px-3',
    lg: 'h-11 rounded-xl px-8',
    icon: 'h-10 w-10'
  }

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button