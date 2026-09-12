import React, { useId } from 'react';

const Input = React.forwardRef(function Input(
  { label, type = 'text', className = '', ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label
          className="mb-1.5 block pl-0.5 text-sm font-semibold text-zinc-700 select-none dark:text-zinc-300"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        className={`flex w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 transition-all duration-200 outline-none placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-500 focus:ring-4 focus:ring-zinc-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-700 dark:focus:border-zinc-400 dark:focus:ring-zinc-400/10 ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;
