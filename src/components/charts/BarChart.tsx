import { Bar, BarChart as RBarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useROIState } from '../../hooks/useROIState';
import { formatCurrency } from '../../lib/format';
import { getModuleColor } from './theme';
import type { ModuleResult } from '../../types';

interface Props {
  data: ModuleResult[];
}

export function ModuleSavingsBarChart({ data }: Props) {
  const { t } = useTranslation();
  const { state } = useROIState();
  const enabled = data
    .filter((m) => m.enabled && m.annualSavings > 0)
    .sort((a, b) => b.annualSavings - a.annualSavings);

  const max = enabled[0]?.annualSavings ?? 0;

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart
          data={enabled}
          layout="vertical"
          margin={{ top: 8, right: 60, bottom: 8, left: 8 }}
        >
          <XAxis type="number" hide domain={[0, max * 1.1]} />
          <YAxis
            type="category"
            dataKey="id"
            stroke="rgb(var(--text-muted))"
            tick={{ fill: 'rgb(var(--text-secondary))', fontSize: 11 }}
            tickFormatter={(v: string) => t(`modules.${v}.name`)}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Bar
            dataKey="annualSavings"
            radius={[0, 4, 4, 0]}
            isAnimationActive
            label={{
              position: 'right',
              formatter: (value: number) =>
                formatCurrency(value, state.context.currency, state.locale, { compact: true }),
              fill: 'rgb(var(--text-primary))',
              fontSize: 11,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            }}
          >
            {enabled.map((m) => (
              <Cell key={m.id} fill={getModuleColor(m.id)} />
            ))}
          </Bar>
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}
