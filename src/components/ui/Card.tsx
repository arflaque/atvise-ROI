import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  elevated?: boolean;
  glow?: boolean;
  as?: 'div' | 'section' | 'article' | 'aside';
  children?: ReactNode;
}

export function Card({
  active = false,
  elevated = false,
  glow = false,
  as = 'div',
  className,
  children,
  ...rest
}: CardProps) {
  const Component = as as 'div';
  return (
    <Component
      className={cn(
        elevated ? 'card-elevated' : 'card',
        active && 'card-active border-accent/40',
        glow && 'shadow-glow-sm',
        'transition-all duration-200',
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 pt-5 pb-3', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 pb-5', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardLabel({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('label-tag mb-1.5', className)} {...rest}>
      {children}
    </div>
  );
}
