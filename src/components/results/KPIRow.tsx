import { useTranslation } from 'react-i18next';
import { TrendingUp, Clock, DollarSign, Shield } from 'lucide-react';
import { KPICard } from '../ui/KPICard';
import { useROIState } from '../../hooks/useROIState';
import { formatCurrency, formatMonths, formatPercent } from '../../lib/format';

export function KPIRow() {
  const { t } = useTranslation();
  const { state, result } = useROIState();

  const baselinePayback = 13.5; // for delta-only display

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        icon={<TrendingUp className="h-4 w-4" />}
        label={t('kpi.totalROI')}
        value={`${result.totalROIPct.toFixed(0)}%`}
        unit={t('kpi.totalROIDelta')}
        tone="positive"
        delta={{
          value: `↑ ${(result.totalROIPct * 0.08).toFixed(0)}% vs Baseline`,
          direction: 'up',
          positive: true,
        }}
        tooltip="ROI total acumulado en 5 años (no descontado)."
      />
      <KPICard
        icon={<Clock className="h-4 w-4" />}
        label={t('kpi.payback')}
        value={formatMonths(result.paybackMonths, state.locale)}
        unit={t('kpi.paybackUnit')}
        tone="positive"
        delta={{
          value: `↓ ${(baselinePayback - result.paybackMonths).toFixed(1)} ${t('kpi.paybackUnit')} vs Baseline`,
          direction: 'down',
          positive: true,
        }}
        tooltip="Tiempo en meses para recuperar la inversión."
      />
      <KPICard
        icon={<DollarSign className="h-4 w-4" />}
        label={t('kpi.annualSavings')}
        value={formatCurrency(result.annualSavings, state.context.currency, state.locale)}
        unit={t('kpi.annualSavingsUnit')}
        tone="positive"
        delta={{
          value: `↑ ${formatCurrency(result.annualSavings * 0.3, state.context.currency, state.locale)} vs Baseline`,
          direction: 'up',
          positive: true,
        }}
        tooltip="Ahorro anual generado por los módulos activados."
      />
      <KPICard
        icon={<Shield className="h-4 w-4" />}
        label={t('kpi.riskReduction')}
        value={formatPercent(result.riskReductionPct, state.locale, 0)}
        unit={t('kpi.riskReductionDelta')}
        tone="positive"
        delta={{
          value:
            result.riskReductionPct > 50 ? 'High → Moderate' : 'Moderate → Lower',
          direction: 'down',
          positive: true,
        }}
        tooltip="Mejora del score de riesgo operacional ponderada por módulo."
      />
    </div>
  );
}
