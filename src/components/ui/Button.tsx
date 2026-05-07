import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'ghost' | 'subtle' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-accent text-text-inverse hover:shadow-glow-sm hover:-translate-y-px [box-shadow:0_0_0_1px_rgb(var(--accent)/0.4)]',
  ghost:
    'bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent',
  subtle:
    'bg-bg-elevated text-text-primary hover:bg-bg-hover border border-border',
  danger:
    'bg-negative/10 text-negative border border-negative/40 hover:bg-negative/20',
};

const SIZE: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-chip',
        'font-semibold uppercase tracking-wider transition-all duration-200',
        'select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT[variant],
        SIZE[size],
        className
      )}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
