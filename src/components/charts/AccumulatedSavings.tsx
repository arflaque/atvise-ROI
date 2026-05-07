import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import { buildAccumulatedSavings } from '../../lib/calculations';
import { formatCurrency } from '../../lib/format';
import type { ROIResult, Locale } from '../../types';
import { readThemeColor } from './theme';

interface Props {
  result: ROIResult;
  locale: Locale;
}

export function AccumulatedSavings({ result, locale }: Props) {
  const { t } = useTranslation();
  const data = buildAccumulatedSavings(result);
  const accent = readThemeColor('--accent');
  const positive = readThemeColor('--positive');

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="accFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positive} stopOpacity={0.5} />
              <stop offset="100%" stopColor={positive} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="year"
            stroke="rgb(var(--text-muted))"
            tick={{ fill: 'rgb(var(--text-secondary))', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}Y`}
          />
          <YAxis hide />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke={positive}
            strokeWidth={2}
            fill="url(#accFill)"
          />
          <Area
            type="monotone"
            dataKey="net"
            stroke={accent}
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="transparent"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between text-[10px] mt-1 px-2">
        <span className="text-text-secondary">{t('resultsTab.fiveYearAccumulated')}</span>
        <span className="font-mono text-positive font-bold tabular-nums">
          {formatCurrency(result.annualSavings * 5, result.currency, locale, { compact: true })}
        </span>
      </div>
    </div>
  );
}
