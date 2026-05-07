import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { NumberInput } from '../ui/NumberInput';
import { Tooltip } from '../ui/Tooltip';
import { useROIState } from '../../hooks/useROIState';
import type { Currency, ProjectContext, ScenarioId } from '../../types';
import { SCENARIO_IDS } from '../../lib/scenarios';
import { cn } from '../../lib/cn';

const CURRENCY_OPTIONS: Currency[] = ['USD', 'EUR', 'BRL', 'MXN', 'COP', 'ARS', 'CLP'];

const INDUSTRY_OPTIONS = [
  'manufacturing',
  'foodBeverage',
  'automotive',
  'energy',
  'waterUtilities',
  'pharma',
  'miningMetals',
  'chemical',
  'other',
];

const PLANT_SIZES: ProjectContext['plantSize'][] = ['small', 'medium', 'large', 'enterprise'];

export function GlobalConfigBar() {
  const { t } = useTranslation();
  const { state, setContext } = useROIState();
  const ctx = state.context;

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      {/* Row 1 — Project context (4 fields) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Field label={t('context.industry')}>
          <Select
            value={ctx.industry}
            onChange={(v) => setContext({ industry: v })}
            options={INDUSTRY_OPTIONS.map((i) => ({ value: i, label: t(`industry.${i}`) }))}
            size="sm"
          />
        </Field>

        <Field label={t('context.plantSize')}>
          <Select
            value={ctx.plantSize}
            onChange={(v) => setContext({ plantSize: v as ProjectContext['plantSize'] })}
            options={PLANT_SIZES.map((s) => ({ value: s, label: t(`plantSize.${s}`) }))}
            size="sm"
          />
        </Field>

        <Field label={t('context.currency')}>
          <Select
            value={ctx.currency}
            onChange={(v) => setContext({ currency: v as Currency })}
            options={CURRENCY_OPTIONS.map((c) => ({ value: c, label: c }))}
            size="sm"
          />
        </Field>

        <Field
          label={t('context.investment')}
          tooltip="CAPEX + integración + licencias para los módulos seleccionados."
        >
          <NumberInput
            value={ctx.investment}
            onChange={(v) => setContext({ investment: v })}
            min={0}
            max={1_000_000_000}
            step={1000}
            prefix="$"
            size="sm"
            ariaLabel={t('context.investment')}
          />
        </Field>
      </div>

      {/* Row 2 — Scenario picker, full width with breathing room */}
      <Field label={t('scenarios.label')}>
        <ScenarioPicker
          value={ctx.scenario}
          onChange={(s) => setContext({ scenario: s })}
        />
      </Field>
    </Card>
  );
}

function Field({
  label,
  tooltip,
  children,
}: {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="label-tag text-text-secondary">{label}</label>
        {tooltip && <Tooltip content={tooltip} />}
      </div>
      {children}
    </div>
  );
}

function ScenarioPicker({
  value,
  onChange,
}: {
  value: ScenarioId;
  onChange: (s: ScenarioId) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-3 rounded-md border border-border bg-bg-base/40 p-1 gap-1 h-11">
      {SCENARIO_IDS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={cn(
            'rounded-md text-sm font-semibold uppercase tracking-wide transition-all',
            value === s
              ? 'bg-accent/15 text-accent [box-shadow:inset_0_0_0_1px_rgb(var(--accent)/0.4)]'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
          )}
        >
          {t(`scenarios.${s}`)}
        </button>
      ))}
    </div>
  );
}
