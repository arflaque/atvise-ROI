import { useTranslation } from 'react-i18next';
import { ChevronRight, Database, Cpu, Settings, BarChart3 } from 'lucide-react';
import { Card, CardLabel } from '../ui/Card';
import { useROIState } from '../../hooks/useROIState';
import { formatCurrency, formatPercent } from '../../lib/format';
import { cn } from '../../lib/cn';

interface Stage {
  num: number;
  icon: typeof Cpu;
  i18n: 'story.s1' | 'story.s2' | 'story.s3' | 'story.s4';
  metrics: () => { label: string; value: string }[];
}

export function ROIStory() {
  const { t } = useTranslation();
  const { state, result } = useROIState();
  const energy = result.modules.find((m) => m.id === 'energy');
  const downtime = result.modules.find((m) => m.id === 'downtime');
  const quality = result.modules.find((m) => m.id === 'quality');
  const production = result.modules.find((m) => m.id === 'production');

  const stages: Stage[] = [
    {
      num: 1,
      icon: BarChart3,
      i18n: 'story.s1',
      metrics: () => [
        { label: 'OEE', value: '62%' },
        { label: 'Downtime', value: `${state.modules.downtime.values.hoursPerMonth ?? 40}h` },
        {
          label: 'Energy Cost',
          value: formatCurrency(
            (state.modules.energy.values.kwhPerMonth ?? 0) *
              (state.modules.energy.values.costPerKwh ?? 0) *
              12,
            state.context.currency,
            state.locale,
            { compact: true }
          ),
        },
        { label: 'Quality Loss', value: '3.8%' },
      ],
    },
    {
      num: 2,
      icon: Database,
      i18n: 'story.s2',
      metrics: () => [
        { label: 'Data Coverage', value: '92%' },
        {
          label: 'Assets Connected',
          value: String(state.modules.digitalization.values.connectedAssets ?? 0),
        },
        { label: 'Alert Accuracy', value: '84' },
      ],
    },
    {
      num: 3,
      icon: Settings,
      i18n: 'story.s3',
      metrics: () => [
        { label: 'OEE', value: '78%' },
        {
          label: 'Downtime',
          value: `↓${(downtime?.appliedImprovementPct ?? 0).toFixed(1)}%`,
        },
        {
          label: 'Energy',
          value: `↓${(energy?.appliedImprovementPct ?? 0).toFixed(1)}%`,
        },
        {
          label: 'Quality',
          value: `↓${(quality?.appliedImprovementPct ?? 0).toFixed(1)}%`,
        },
      ],
    },
    {
      num: 4,
      icon: Cpu,
      i18n: 'story.s4',
      metrics: () => [
        { label: t('kpi.fiveYearROI'), value: `${result.totalROIPct.toFixed(0)}%` },
        {
          label: t('kpi.npv'),
          value: formatCurrency(result.npv, state.context.currency, state.locale, { compact: true }),
        },
        { label: t('kpi.irr'), value: formatPercent(result.irrPct, state.locale, 0) },
        {
          label: t('kpi.payback'),
          value: `${result.paybackMonths.toFixed(1)} ${t('kpi.paybackUnit')}`,
        },
      ],
    },
  ];
  // Avoid unused var lint when production isn't visualized but kept for parity
  void production;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <CardLabel>ROI STORY</CardLabel>
          <h3 className="heading-display text-lg text-text-primary">{t('story.title')}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {stages.map((stage, idx) => (
          <StageCard key={stage.num} stage={stage} isLast={idx === stages.length - 1} />
        ))}
      </div>
    </Card>
  );
}

function StageCard({ stage, isLast }: { stage: Stage; isLast: boolean }) {
  const { t } = useTranslation();
  const Icon = stage.icon;
  return (
    <div className="relative">
      <div
        className={cn(
          'rounded-card border border-border bg-bg-base/50 p-4 transition-all hover:border-accent/40',
          'h-full'
        )}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-mono font-bold text-sm">
            {stage.num}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-text-primary leading-tight">
              {t(`${stage.i18n}.title`)}
            </h4>
          </div>
          <Icon className="h-4 w-4 text-accent shrink-0" />
        </div>
        <p className="text-xs text-text-secondary mb-3 leading-relaxed">
          {t(`${stage.i18n}.desc`)}
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-3 border-t border-border">
          {stage.metrics().map((m) => (
            <div key={m.label} className="min-w-0">
              <div className="text-[9px] uppercase tracking-wider text-text-muted truncate">
                {m.label}
              </div>
              <div className="font-mono text-xs font-bold text-text-primary tabular-nums">
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isLast && (
        <ChevronRight className="hidden xl:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent/40" />
      )}
    </div>
  );
}
