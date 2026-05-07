import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: Option[];
  value: string;
  onChange: (next: string) => void;
  size?: 'sm' | 'md';
}

export function Select({ options, value, onChange, size = 'md', className, ...rest }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'w-full rounded-md border border-border bg-bg-base/60 px-3 text-text-primary',
        'focus:border-accent focus:[box-shadow:0_0_0_3px_rgb(var(--accent)/0.15)] focus:outline-none',
        'cursor-pointer transition-all',
        size === 'sm' ? 'h-9 text-sm' : 'h-11 text-base',
        className
      )}
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-bg-surface text-text-primary">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
