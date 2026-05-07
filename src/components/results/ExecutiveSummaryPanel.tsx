import { useTranslation } from 'react-i18next';
import { Sparkles, Quote, Shield, Database, GitBranch } from 'lucide-react';
import { Card, CardLabel } from '../ui/Card';
import { useROIState } from '../../hooks/useROIState';
import { DonutChart, DonutLegend } from '../charts/DonutChart';
import { WaterfallChart } from '../charts/WaterfallChart';
import { PaybackTimeline } from '../charts/PaybackTimeline';
import { formatCurrency, formatPercent } from '../../lib/format';

export function ExecutiveSummaryPanel() {
  const { t } = useTranslation();
  const { state, result } = useROIState();

  // Pick top-2 contributing modules for the AI insight quote
  const enabled = result.modules.filter((m) => m.enabled).slice().sort((a, b) => b.contributionPct - a.contributionPct);
  const first = enabled[0];
  const second = enabled[1];

  const insightText = first && second
    ? t('resultsTab.keyDrivers', {
        first: t(`modules.${first.id}.short`).toLowerCase(),
        second: t(`modules.${second.id}.short`).toLowerCase(),
      })
    : t('resultsTab.keyDrivers', { first: '—', second: '—' });

  return (
    <aside className="space-y-4">
      {/* AI Insight quote */}
      <Card className="p-5 relative overflow-hidden">
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30">
          <Sparkles className="h-3 w-3 text-accent" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
            {t('resultsTab.aiInsight')}
          </span>
        </div>
        <CardLabel className="mb-3">{t('resultsTab.insightHeading')}</CardLabel>
        <Quote className="h-5 w-5 text-accent/40 mb-2" />
        <p className="text-base leading-relaxed text-text-primary font-display font-medium">
          {insightText}
        </p>
      </Card>

      {/* Waterfall */}
      <Card className="p-5">
        <div className="flex items-baseline justify-between mb-3">
          <CardLabel>{t('resultsTab.waterfallTitle')}</CardLabel>
          <span className="text-[10px] text-text-muted uppercase tracking-wider">
            {state.context.currency}
          </span>
        </div>
        <WaterfallChart result={result} locale={state.locale} />
      </Card>

      {/* Donut + Payback row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <CardLabel>{t('resultsTab.contribution')}</CardLabel>
          <DonutChart data={result.modules} />
          <div className="mt-3">
            <DonutLegend data={result.modules} />
          </div>
        </Card>

        <Card className="p-5 flex flex-col">
          <CardLabel className="mb-2">{t('resultsTab.paybackTimeline')}</CardLabel>
          <PaybackTimeline result={result} />
        </Card>
      </div>

      {/* Footer status row */}
      <Card className="p-4 grid grid-cols-3 gap-3">
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-positive mt-0.5" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted">
              {t('resultsTab.confidenceLabel')}
            </div>
            <div className="text-sm font-bold text-text-primary">
              {result.confidence >= 80 ? 'High' : result.confidence >= 60 ? 'Medium' : 'Low'}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 border-l border-border pl-3">
          <Database className="h-4 w-4 text-info mt-0.5" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted">
              {t('resultsTab.dataQuality')}
            </div>
            <div className="font-mono text-sm font-bold text-text-primary tabular-nums">
              {formatPercent(result.confidence, state.locale, 0)}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 border-l border-border pl-3">
          <GitBranch className="h-4 w-4 text-accent mt-0.5" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted">
              {t('resultsTab.scenarioLabel')}
            </div>
            <div className="text-sm font-bold text-text-primary capitalize">
              {t(`scenarios.${state.context.scenario}`)}
            </div>
          </div>
        </div>
      </Card>

      {/* NPV / IRR strip */}
      <Card className="p-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-text-muted">{t('kpi.npv')}</div>
          <div className="kpi-number text-base text-positive">
            {formatCurrency(result.npv, state.context.currency, state.locale, { compact: true })}
          </div>
        </div>
        <div className="border-x border-border">
          <div className="text-[10px] uppercase tracking-wider text-text-muted">{t('kpi.irr')}</div>
          <div className="kpi-number text-base text-accent">
            {formatPercent(result.irrPct, state.locale, 0)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-text-muted">
            {t('kpi.netBenefit')}
          </div>
          <div className="kpi-number text-base text-positive">
            {formatCurrency(result.fiveYearNetBenefit, state.context.currency, state.locale, {
              compact: true,
            })}
          </div>
        </div>
      </Card>
    </aside>
  );
}
