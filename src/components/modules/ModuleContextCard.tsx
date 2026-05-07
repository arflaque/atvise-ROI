import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, CardLabel } from '../ui/Card';
import { ModuleIcon } from './ModuleIcon';
import type { ModuleDefinition } from '../../types';
import { Sparkles } from 'lucide-react';

interface Props {
  module: ModuleDefinition;
}

/** Educational card shown in the Context tab — explains the module + its 3 tools. */
export function ModuleContextCard({ module }: Props) {
  const { t } = useTranslation();
  const range = module.improvementRange;
  const midpoint = (range.min + range.max) / 2;

  return (
    <Card className="flex flex-col gap-4 p-5 hover:border-accent/40 transition-all">
      <CardHeader className="p-0 flex items-start gap-4">
        <ModuleIcon id={module.id} size="lg" />
        <div className="flex-1 min-w-0">
          <CardLabel>{t(`${module.i18nKey}.short`)}</CardLabel>
          <h3 className="heading-display text-xl text-text-primary">
            {t(`${module.i18nKey}.name`)}
          </h3>
        </div>
      </CardHeader>

      <p className="text-sm text-text-secondary leading-relaxed">
        {t(`${module.i18nKey}.description`)}
      </p>

      {/* Improvement range bar */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wider text-text-muted">
            {t('contextTab.improvementRange')}
          </span>
          <span className="font-mono text-positive text-sm font-bold tabular-nums">
            {range.min}–{range.max}%
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-bg-base overflow-hidden">
          <div
            className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-positive/40 to-positive"
            style={{
              left: `${range.min * 2}%`,
              width: `${(range.max - range.min) * 2}%`,
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-positive [box-shadow:0_0_8px_rgb(var(--positive)/0.7)]"
            style={{ left: `calc(${midpoint * 2}% - 6px)` }}
          />
        </div>
      </div>

      <CardBody className="p-0">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <h4 className="text-xs uppercase tracking-wider text-text-secondary font-semibold">
            {t('contextTab.suggestedTools')}
          </h4>
        </div>
        <ul className="space-y-2">
          {module.toolKeys.map((toolKey, i) => (
            <li
              key={toolKey}
              className="flex gap-3 rounded-md border border-border bg-bg-base/40 p-3 hover:border-accent/30 transition-colors"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent font-mono text-xs font-bold">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-text-primary text-sm">{t(toolKey)}</div>
                <div className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                  {t(`toolDesc.${toolKey.replace('tool.', '')}`)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
