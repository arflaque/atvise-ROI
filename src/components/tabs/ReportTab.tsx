import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Link2, CheckCircle2, Lightbulb, Target, ListChecks } from 'lucide-react';
import { Card, CardLabel } from '../ui/Card';
import { Button } from '../ui/Button';
import { ModuleIcon } from '../modules/ModuleIcon';
import { KPIRow } from '../results/KPIRow';
import { DonutChart, DonutLegend } from '../charts/DonutChart';
import { ModuleSavingsBarChart } from '../charts/BarChart';
import { useROIState } from '../../hooks/useROIState';
import { formatCurrency, formatPercent } from '../../lib/format';
import { exportNodeToPdf, loadImageAsPng } from '../report/PDFExport';

export default function ReportTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, result, shareableUrl, setTheme } = useROIState();
  const reportRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  // Wait for two animation frames so React state → DOM → CSS variables → repaint all settle.
  const waitForRepaint = () =>
    new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );

  const enabled = result.modules
    .filter((m) => m.enabled && m.annualSavings > 0)
    .sort((a, b) => b.annualSavings - a.annualSavings);

  const top = enabled[0];
  const second = enabled[1];

  const findings = [
    top &&
      `${t(`modules.${top.id}.name`)} es el mayor contribuidor (${top.contributionPct.toFixed(0)}% del ROI).`,
    second && `${t(`modules.${second.id}.name`)} aporta ${second.contributionPct.toFixed(0)}% adicional al caso.`,
    `Payback estimado: ${result.paybackMonths.toFixed(1)} ${t('kpi.paybackUnit')}.`,
    `Reducción de riesgo operacional: ${formatPercent(result.riskReductionPct, state.locale, 0)}.`,
  ].filter(Boolean) as string[];

  const opportunities = enabled.slice(0, 3).map((m, i) =>
    `${i + 1}. ${t(`modules.${m.id}.name`)} — ${formatCurrency(m.annualSavings, state.context.currency, state.locale)}/año (${m.appliedImprovementPct.toFixed(1)}% de mejora aplicada).`
  );

  const recommendations = [
    'Priorizar módulos por payback ascendente para liberar caja temprano.',
    'Establecer KPIs de baseline antes del go-live para medir el delta real.',
    'Definir gates de fase con métricas claras antes de escalar a planta entera.',
  ];

  const downloadPdf = async () => {
    if (!reportRef.current) return;
    setBusy(true);

    // Force corporate (light) theme during capture so the PDF prints cleanly
    // and the light-variant logos sit correctly on white. Restore after.
    const originalTheme = state.theme;
    if (originalTheme !== 'corporate') {
      setTheme('corporate');
      await waitForRepaint();
      // Charts re-render reads CSS vars at render time — let them paint once more
      await waitForRepaint();
    }

    try {
      const base = import.meta.env.BASE_URL;
      const [atvise, vester] = await Promise.all([
        loadImageAsPng(`${base}atvise-on-light.svg`),
        loadImageAsPng(`${base}vester-on-light.svg`),
      ]);

      await exportNodeToPdf(reportRef.current, {
        filename: `vester-roi-${state.context.projectName?.replace(/\s+/g, '-').toLowerCase() ?? 'report'}.pdf`,
        letterhead: { topRight: atvise, bottomRight: vester },
      });
    } finally {
      if (originalTheme !== 'corporate') {
        setTheme(originalTheme);
      }
      setBusy(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* PDF generation overlay — covers theme flip + capture work */}
      {busy && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-4 rounded-card bg-bg-surface border border-border px-8 py-6 shadow-card">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border-2 border-accent/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
            </div>
            <span className="text-sm font-semibold tracking-wider uppercase text-text-primary">
              {t('reportTab.generating')}
            </span>
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardLabel>{t('nav.report')}</CardLabel>
          <h2 className="heading-display text-2xl text-text-primary">{t('reportTab.title')}</h2>
          <p className="text-sm text-text-secondary mt-1">{t('reportTab.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            iconLeft={copied ? <CheckCircle2 className="h-4 w-4 text-positive" /> : <Link2 className="h-4 w-4" />}
            onClick={copyLink}
          >
            {copied ? t('reportTab.copied') : t('reportTab.shareLink')}
          </Button>
          <Button
            variant="primary"
            iconLeft={<Download className="h-4 w-4" />}
            onClick={downloadPdf}
            disabled={busy}
          >
            {busy ? t('reportTab.generating') : t('reportTab.exportPdf')}
          </Button>
        </div>
      </div>

      {/* Report body — captured by PDF export */}
      <div ref={reportRef} className="space-y-6 bg-bg-base p-2 rounded-card">
        {/* Cover */}
        <Card className="p-8 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative">
            <CardLabel>{t('brand.product').toUpperCase()}</CardLabel>
            <h1 className="heading-display text-3xl sm:text-4xl text-text-primary mt-2">
              {state.context.projectName ?? t('reportTab.title')}
            </h1>
            {state.context.clientName && (
              <p className="text-text-secondary text-base mt-1">
                Cliente: <span className="text-text-primary font-semibold">{state.context.clientName}</span>
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
              <Stat label={t('kpi.totalROI')} value={`${result.totalROIPct.toFixed(0)}%`} tone="positive" />
              <Stat
                label={t('kpi.payback')}
                value={`${result.paybackMonths.toFixed(1)} ${t('kpi.paybackUnit')}`}
                tone="accent"
              />
              <Stat
                label={t('kpi.annualSavings')}
                value={formatCurrency(result.annualSavings, state.context.currency, state.locale, {
                  compact: true,
                })}
                tone="positive"
              />
              <Stat
                label={t('kpi.netBenefit')}
                value={formatCurrency(result.fiveYearNetBenefit, state.context.currency, state.locale, {
                  compact: true,
                })}
                tone="positive"
              />
            </div>
          </div>
        </Card>

        {/* KPIs */}
        <KPIRow />

        {/* Active modules */}
        <Card className="p-5">
          <CardLabel className="mb-4">{t('reportTab.section.activeModules')}</CardLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {enabled.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-md border border-border bg-bg-base/50 p-3"
              >
                <ModuleIcon id={m.id} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary">
                    {t(`modules.${m.id}.name`)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {formatCurrency(m.annualSavings, state.context.currency, state.locale, { compact: true })} / año
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-accent tabular-nums">
                  {m.contributionPct.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-5">
            <CardLabel className="mb-3">{t('resultsTab.contribution')}</CardLabel>
            <DonutChart data={result.modules} />
            <div className="mt-3">
              <DonutLegend data={result.modules} />
            </div>
          </Card>
          <Card className="p-5">
            <CardLabel className="mb-3">{t('modulesTab.annualImpact')}</CardLabel>
            <ModuleSavingsBarChart data={result.modules} />
          </Card>
        </div>

        {/* Findings / Opportunities / Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Section icon={<Lightbulb className="h-4 w-4" />} title={t('reportTab.section.findings')} items={findings} />
          <Section
            icon={<Target className="h-4 w-4" />}
            title={t('reportTab.section.opportunities')}
            items={opportunities}
          />
          <Section
            icon={<ListChecks className="h-4 w-4" />}
            title={t('reportTab.section.recommendations')}
            items={recommendations}
          />
        </div>

        {/* Consultant note */}
        <Card className="p-5 border-accent/30 bg-accent/[0.02]">
          <CardLabel className="text-accent">{t('reportTab.section.consultantNote')}</CardLabel>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            {t('reportTab.consultantNote')}
          </p>
        </Card>
      </div>

      {/* Bottom nav */}
      <div className="flex justify-start gap-3 pt-2">
        <Button
          variant="ghost"
          iconLeft={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/results')}
        >
          {t('ui.back')}
        </Button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'accent' | 'positive' | 'neutral';
}) {
  const toneClass =
    tone === 'positive' ? 'text-positive' : tone === 'accent' ? 'text-accent' : 'text-text-primary';
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-text-muted">{label}</div>
      <div className={`kpi-number text-2xl mt-1 ${toneClass}`}>{value}</div>
    </div>
  );
}

function Section({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-3 text-accent">
        {icon}
        <CardLabel className="!mb-0">{title}</CardLabel>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
            <span className="text-accent mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
