import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useROIState } from '../../hooks/useROIState';
import { getModuleColor } from './theme';
import type { ModuleResult } from '../../types';

interface Props {
  data: ModuleResult[];
}

export function DonutChart({ data }: Props) {
  const { t } = useTranslation();
  const { result } = useROIState();
  const enabled = data.filter((m) => m.enabled && m.contributionPct > 0);

  return (
    <div className="relative w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={enabled}
            dataKey="contributionPct"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
            stroke="rgb(var(--bg-surface))"
            strokeWidth={2}
            startAngle={90}
            endAngle={-270}
          >
            {enabled.map((m) => (
              <Cell key={m.id} fill={getModuleColor(m.id)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="kpi-number text-2xl text-accent">
          {result.totalROIPct.toFixed(0)}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-text-secondary mt-0.5">
          {t('kpi.totalROI')}
        </span>
      </div>
    </div>
  );
}

interface LegendProps {
  data: ModuleResult[];
}

export function DonutLegend({ data }: LegendProps) {
  const { t } = useTranslation();
  const enabled = data.filter((m) => m.enabled && m.contributionPct > 0);
  return (
    <ul className="space-y-1.5">
      {enabled.map((m) => (
        <li key={m.id} className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: getModuleColor(m.id) }}
            />
            <span className="text-text-secondary truncate">{t(`modules.${m.id}.name`)}</span>
          </div>
          <span className="font-mono font-semibold text-text-primary tabular-nums">
            {m.contributionPct.toFixed(0)}%
          </span>
        </li>
      ))}
    </ul>
  );
}
