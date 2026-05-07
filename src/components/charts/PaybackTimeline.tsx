import { useTranslation } from 'react-i18next';
import type { ROIResult } from '../../types';
import { cn } from '../../lib/cn';

interface Props {
  result: ROIResult;
  /** Total span in months for the visual axis. Default 24. */
  span?: number;
}

export function PaybackTimeline({ result, span = 24 }: Props) {
  const { t } = useTranslation();
  const months = Math.min(result.paybackMonths, span);
  const pct = Math.max(0, Math.min(100, (months / span) * 100));
  const overdue = result.paybackMonths > span;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-3">
        <span className="kpi-number text-3xl text-positive">
          {result.paybackMonths.toFixed(1)}
        </span>
        <span className="text-xs uppercase tracking-widest text-text-secondary">
          {t('kpi.paybackUnit')}
        </span>
      </div>

      {/* Track */}
      <div className="relative">
        <div className="h-1 rounded-full bg-bg-base" />

        {/* Progress fill */}
        <div
          className={cn(
            'absolute top-0 left-0 h-1 rounded-full transition-all duration-700',
            overdue ? 'bg-warning' : 'bg-gradient-to-r from-positive to-accent'
          )}
          style={{ width: `${pct}%` }}
        />

        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700"
          style={{ left: `${pct}%` }}
        >
          <span className="block h-3.5 w-3.5 rounded-full bg-accent [box-shadow:0_0_0_3px_rgb(var(--accent)/0.2),0_0_12px_rgb(var(--accent)/0.6)]" />
        </div>

        {/* Endpoint markers */}
        <div className="flex justify-between pt-3 text-[10px] font-mono text-text-muted tabular-nums">
          <span>0</span>
          <span className="text-accent font-bold">
            {result.paybackMonths > span ? `>${span}` : result.paybackMonths.toFixed(1)}
          </span>
          <span>{span}</span>
        </div>
      </div>

      <div className="flex justify-between text-[10px] uppercase tracking-wider text-text-muted mt-1">
        <span>0</span>
        <span>{t('kpi.payback')}</span>
        <span>{t('kpi.paybackUnit')}</span>
      </div>
    </div>
  );
}
