import { useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';
import { cn } from '../../lib/cn';

interface TooltipProps {
  content: ReactNode;
  children?: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const SIDE: Record<NonNullable<TooltipProps['side']>, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span tabIndex={0} className="inline-flex items-center cursor-help">
        {children ?? <Info className="h-3.5 w-3.5 text-text-muted hover:text-accent transition-colors" />}
      </span>
      {open && (
        <span
          role="tooltip"
          className={cn(
            'absolute z-50 w-56 rounded-md border border-border bg-bg-elevated px-3 py-2',
            'text-xs leading-relaxed text-text-secondary shadow-card',
            'animate-fade-in pointer-events-none',
            SIDE[side]
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
