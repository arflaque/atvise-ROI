import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { buildWaterfallData } from '../../lib/calculations';
import type { ROIResult, Currency, Locale } from '../../types';
import { formatCompactSigned, formatCurrency } from '../../lib/format';
import { readThemeColor } from './theme';

interface Props {
  result: ROIResult;
  locale: Locale;
}

interface WfRow {
  label: string;
  start: number;
  delta: number;
  end: number;
  fill: string;
  type: 'baseline' | 'positive' | 'negative' | 'total';
  /** Original signed value, used for label rendering (delta is always positive). */
  signedValue: number;
}

function buildBarRows(result: ROIResult): WfRow[] {
  const items = buildWaterfallData(result);
  const rows: WfRow[] = [];
  let running = 0;

  for (const it of items) {
    if (it.type === 'baseline') {
      rows.push({
        label: 'Baseline',
        start: it.value,
        delta: -it.value,
        end: 0,
        fill: readThemeColor('--text-muted'),
        type: 'baseline',
        signedValue: it.value,
      });
      running = 0;
      continue;
    }
    if (it.type === 'total') {
      rows.push({
        label: 'Net',
        start: 0,
        delta: it.value,
        end: it.value,
        fill: readThemeColor('--accent'),
        type: 'total',
        signedValue: it.value,
      });
      continue;
    }
    if (it.type === 'positive') {
      rows.push({
        label: it.label,
        start: running,
        delta: it.value,
        end: running + it.value,
        fill: readThemeColor('--positive'),
        type: 'positive',
        signedValue: it.value,
      });
      running += it.value;
      continue;
    }
    if (it.type === 'negative') {
      rows.push({
        label: 'Investment',
        start: running + it.value,
        delta: -it.value,
        end: running + it.value,
        fill: readThemeColor('--negative'),
        type: 'negative',
        signedValue: it.value,
      });
      running += it.value;
      continue;
    }
  }
  return rows;
}

export function WaterfallChart({ result, locale }: Props) {
  const { t } = useTranslation();
  const rows = buildBarRows(result);
  const currency: Currency = result.currency;

  // Friendly X-axis labels keyed by the row's `label` field
  const labelOf = (row: WfRow | undefined): string => {
    if (!row) return '';
    if (row.type === 'baseline') return t('kpi.totalROI', { defaultValue: 'Baseline' });
    if (row.type === 'negative') return 'Investment';
    if (row.type === 'total') return 'Net';
    return t(`modules.${row.label}.name`);
  };

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 28, right: 12, bottom: 8, left: 8 }}>
          <XAxis
            dataKey="label"
            stroke="rgb(var(--text-muted))"
            tick={{ fill: 'rgb(var(--text-secondary))', fontSize: 10 }}
            tickFormatter={(v: string) => labelOf(rows.find((r) => r.label === v))}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip
            cursor={{ fill: 'rgb(var(--accent) / 0.06)' }}
            wrapperStyle={{ outline: 'none' }}
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const row = payload[0].payload as WfRow;
              return (
                <div className="rounded-md border border-border bg-bg-elevated px-3 py-2 shadow-card">
                  <div className="text-[10px] uppercase tracking-wider text-text-muted">
                    {labelOf(row)}
                  </div>
                  <div className="font-mono text-sm font-bold text-text-primary tabular-nums">
                    {formatCurrency(row.signedValue, currency, locale, { compact: true })}
                  </div>
                </div>
              );
            }}
          />
          {/* Invisible "spacer" bar lifts the visible delta to its starting point */}
          <Bar dataKey="start" stackId="a" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="delta" stackId="a" radius={[4, 4, 4, 4]} maxBarSize={48}>
            {rows.map((row, i) => (
              <Cell key={i} fill={row.fill} />
            ))}
            <LabelList
              dataKey="signedValue"
              position="top"
              offset={6}
              formatter={(value: number) => formatCompactSigned(value, locale)}
              style={{
                fill: 'rgb(var(--text-secondary))',
                fontSize: 10,
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontWeight: 600,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
