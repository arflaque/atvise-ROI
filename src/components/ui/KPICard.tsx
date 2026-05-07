import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Card } from './Card';
import { Tooltip } from './Tooltip';

interface KPICardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  delta?: { value: string; direction: 'up' | 'down' | 'neutral'; positive: boolean };
  icon?: ReactNode;
  tooltip?: string;
  tone?: 'positive' | 'warning' | 'neutral' | 'accent';
  className?: string;
}

const TONE: Record<NonNullable<KPICardProps['tone']>, string> = {
  positive: 'text-positive',
  warning: 'text-warning',
  neutral: 'text-text-primary',
  accent: 'text-accent',
};

export function KPICard({
  label,
  value,
  unit,
  delta,
  icon,
  tooltip,
  tone = 'positive',
  className,
}: KPICardProps) {
  return (
    <Card className={cn('p-5 flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2">
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-bg-elevated text-accent">
            {icon}
          </span>
        )}
        <span className="label-tag flex-1 text-text-secondary">{label}</span>
        {tooltip && <Tooltip content={tooltip} />}
      </div>

      <div className="flex items-baseline gap-2">
        <span className={cn('kpi-number text-kpi-lg', TONE[tone])}>{value}</span>
        {unit && <span className="text-xs text-text-secondary uppercase tracking-wider">{unit}</span>}
      </div>

      {delta && (
        <div
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium',
            delta.positive ? 'text-positive' : 'text-text-secondary'
          )}
        >
          {delta.direction === 'up' && <ArrowUp className="h-3 w-3" />}
          {delta.direction === 'down' && <ArrowDown className="h-3 w-3" />}
          <span>{delta.value}</span>
        </div>
      )}
    </Card>
  );
}
