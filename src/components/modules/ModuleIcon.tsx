import {
  Timer,
  Zap,
  Wrench,
  TrendingUp,
  Award,
  Network,
  type LucideIcon,
} from 'lucide-react';
import type { ModuleId } from '../../types';
import { cn } from '../../lib/cn';

const ICON: Record<ModuleId, LucideIcon> = {
  downtime: Timer,
  energy: Zap,
  maintenance: Wrench,
  production: TrendingUp,
  quality: Award,
  digitalization: Network,
};

interface Props {
  id: ModuleId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
};

const FRAME: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-12 w-12',
};

export function ModuleIcon({ id, size = 'md', className }: Props) {
  const Icon = ICON[id];
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-border bg-bg-elevated text-accent shrink-0',
        FRAME[size],
        className
      )}
    >
      <Icon className={SIZE_CLASS[size]} strokeWidth={1.8} />
    </span>
  );
}
