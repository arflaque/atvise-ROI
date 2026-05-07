import { useTranslation } from 'react-i18next';
import { Card, CardLabel } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import { Tooltip } from '../ui/Tooltip';
import { NumberInput } from '../ui/NumberInput';
import { ImpactDots } from '../ui/ImpactDots';
import { ModuleIcon } from './ModuleIcon';
import { useROIState } from '../../hooks/useROIState';
import { formatCurrency } from '../../lib/format';
import { cn } from '../../lib/cn';
import type {
  ImpactLevel,
  ModuleDefinition,
  ModuleResult,
} from '../../types';

interface Props {
  module: ModuleDefinition;
  result: ModuleResult;
}

const IMPACT_OPTIONS: ImpactLevel[] = ['low', 'medium', 'high'];

const UNIT_PREFIX: Record<string, string | undefined> = {
  currency: '$',
};

const UNIT_SUFFIX: Record<string, string | undefined> = {
  hours: 'h',
  percent: '%',
  count: '',
  kwh: 'kWh',
  units: 'u',
  currency: undefined,
};

export function ModuleConfigCard({ module, result }: Props) {
  const { t } = useTranslation();
  const { state, toggleModule, setModuleImpact, setModuleValue } = useROIState();
  const ms = state.modules[module.id];

  return (
    <Card
      active={ms.enabled}
      className={cn('flex flex-col gap-4 p-5 transition-opacity', !ms.enabled && 'opacity-60')}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <ModuleIcon id={module.id} size="lg" />
        <div className="flex-1 min-w-0">
          <CardLabel>{t(`${module.i18nKey}.short`)}</CardLabel>
          <h3 className="heading-display text-lg text-text-primary leading-tight">
            {t(`${module.i18nKey}.name`)}
          </h3>
        </div>
        <Toggle checked={ms.enabled} onChange={() => toggleModule(module.id)} />
      </div>

      {/* Impact selector */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-bg-base/50 border border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-text-muted">
            {t('impact.label')}
          </span>
          <ImpactDots impact={ms.impact} />
        </div>
        <div className="flex gap-1">
          {IMPACT_OPTIONS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              disabled={!ms.enabled}
              onClick={() => setModuleImpact(module.id, lvl)}
              className={cn(
                'px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider transition',
                ms.impact === lvl
                  ? 'bg-accent/20 text-accent [box-shadow:inset_0_0_0_1px_rgb(var(--accent)/0.4)]'
                  : 'text-text-secondary hover:bg-bg-elevated'
              )}
            >
              {t(`impact.${lvl}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        {module.inputs.map((inp) => {
          const value = ms.values[inp.key] ?? inp.defaultValue;
          return (
            <div key={inp.key}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-text-secondary">{t(inp.labelKey)}</label>
                <Tooltip content={t(inp.tooltipKey)} />
              </div>
              <NumberInput
                value={value}
                onChange={(next) => setModuleValue(module.id, inp.key, next)}
                min={inp.min}
                max={inp.max}
                step={inp.step}
                prefix={UNIT_PREFIX[inp.unit]}
                unit={UNIT_SUFFIX[inp.unit]}
                size="sm"
                ariaLabel={t(inp.labelKey)}
              />
            </div>
          );
        })}
      </div>

      {/* Footer: contribution + annual impact */}
      <div className="border-t border-border pt-3 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-text-secondary">{t('modulesTab.contributionToROI')}</span>
          <span className="font-mono text-sm font-bold text-accent tabular-nums">
            {result.enabled ? `${result.contributionPct.toFixed(0)}%` : '—'}
          </span>
        </div>
        <div className="relative h-1.5 rounded-full bg-bg-base overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/60 to-accent transition-all duration-500"
            style={{ width: `${Math.min(100, result.contributionPct)}%` }}
          />
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-xs text-text-secondary">{t('modulesTab.annualImpact')}</span>
          <span className="font-mono text-sm font-bold text-positive tabular-nums">
            {result.enabled
              ? formatCurrency(result.annualSavings, state.context.currency, state.locale)
              : '—'}
          </span>
        </div>
      </div>
    </Card>
  );
}
