import type { ImpactLevel } from '../../types';
import { cn } from '../../lib/cn';

interface Props {
  impact: ImpactLevel;
  className?: string;
}

const FILLED: Record<ImpactLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const COLOR: Record<ImpactLevel, string> = {
  low: 'text-info',
  medium: 'text-warning',
  high: 'text-positive',
};

export function ImpactDots({ impact, className }: Props) {
  const filled = FILLED[impact];
  return (
    <span className={cn('inline-flex items-center gap-1', COLOR[impact], className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn('impact-dot', i < filled && 'on')}
          aria-hidden
        />
      ))}
    </span>
  );
}
