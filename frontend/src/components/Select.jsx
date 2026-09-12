import React, { useId } from 'react';

const Select = React.forwardRef(function Select(
  { options, label, className = '', ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block pl-0.5 text-sm font-semibold text-zinc-700 select-none dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <select
        {...props}
        id={id}
        ref={ref}
        className={`flex w-full cursor-pointer rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 transition-all duration-200 outline-none hover:border-zinc-300 focus:border-zinc-500 focus:ring-4 focus:ring-zinc-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-700 dark:focus:border-zinc-400 dark:focus:ring-zinc-400/10 ${className}`}
      >
        {options?.map((option) => (
          <option key={option} value={option} className="dark:bg-zinc-900">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Select;
