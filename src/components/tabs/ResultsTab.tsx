import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { HeroBanner } from '../layout/HeroBanner';
import { KPIRow } from '../results/KPIRow';
import { ROIStory } from '../results/ROIStory';
import { ExecutiveSummaryPanel } from '../results/ExecutiveSummaryPanel';
import { ModuleSavingsBarChart } from '../charts/BarChart';
import { AccumulatedSavings } from '../charts/AccumulatedSavings';
import { Button } from '../ui/Button';
import { Card, CardLabel } from '../ui/Card';
import { useROIState } from '../../hooks/useROIState';

export default function ResultsTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, result } = useROIState();

  return (
    <div className="animate-fade-in space-y-6">
      <HeroBanner variant="compact" />

      {/* Two-column layout: main results + side panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
        <div className="space-y-6 min-w-0">
          <KPIRow />

          <Card className="p-5">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <CardLabel>{t('resultsTab.title')}</CardLabel>
                <h3 className="heading-display text-lg text-text-primary">
                  {t('modulesTab.annualImpact')}
                </h3>
              </div>
            </div>
            <ModuleSavingsBarChart data={result.modules} />
          </Card>

          <Card className="p-5">
            <div className="flex items-baseline justify-between mb-2">
              <CardLabel>{t('resultsTab.fiveYearAccumulated')}</CardLabel>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">
                {state.context.currency}
              </span>
            </div>
            <AccumulatedSavings result={result} locale={state.locale} />
          </Card>

          <ROIStory />
        </div>

        <ExecutiveSummaryPanel />
      </div>

      {/* Nav */}
      <div className="flex justify-between gap-3 pt-4">
        <Button
          variant="ghost"
          iconLeft={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/modules')}
        >
          {t('ui.back')}
        </Button>
        <Button
          variant="primary"
          iconRight={<ArrowRight className="h-4 w-4" />}
          onClick={() => navigate('/report')}
        >
          {t('nav.report')}
        </Button>
      </div>
    </div>
  );
}
