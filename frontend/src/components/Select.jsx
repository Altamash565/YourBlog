import React, { useId } from 'react';
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/new-components/ui/select';
import { CheckCircle2, CircleDashed } from 'lucide-react';

const Select = React.forwardRef(function Select(
  {
    options = [],
    label,
    value,
    defaultValue,
    onChange,
    onValueChange,
    placeholder = 'Select an option',
    className = '',
    name,
    disabled = false,
    ...props
  },
  ref
) {
  const id = useId();
  const [internalValue, setInternalValue] = React.useState(
    value ?? defaultValue ?? options[0] ?? ''
  );

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (val) => {
    if (value === undefined) {
      setInternalValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
    if (onChange) {
      onChange({
        target: {
          name,
          value: val,
        },
      });
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-xs font-semibold tracking-wide text-zinc-500 uppercase select-none dark:text-zinc-400"
        >
          {label}
        </label>
      )}
      <UiSelect
        value={currentValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger id={id} ref={ref} className={className} {...props}>
          <SelectValue placeholder={placeholder}>
            {currentValue === 'active' ? (
              <span className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                <span className="font-medium capitalize">Active</span>
              </span>
            ) : currentValue === 'inactive' ? (
              <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <CircleDashed className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
                <span className="font-medium capitalize">Inactive</span>
              </span>
            ) : (
              <span className="capitalize">{currentValue || placeholder}</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => {
            const optVal = typeof option === 'object' ? option.value : option;
            const optLabel = typeof option === 'object' ? option.label : option;
            const isStatus = optVal === 'active' || optVal === 'inactive';

            return (
              <SelectItem key={optVal} value={optVal}>
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  {isStatus && optVal === 'active' && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                  )}
                  {isStatus && optVal === 'inactive' && (
                    <CircleDashed className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
                  )}
                  <span className="font-medium capitalize">{optLabel}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </UiSelect>
    </div>
  );
});

export default Select;
