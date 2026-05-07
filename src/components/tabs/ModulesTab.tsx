import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { HeroBanner } from '../layout/HeroBanner';
import { GlobalConfigBar } from '../layout/GlobalConfigBar';
import { ModuleConfigCard } from '../modules/ModuleConfigCard';
import { Button } from '../ui/Button';
import { CardLabel } from '../ui/Card';
import { ImpactDots } from '../ui/ImpactDots';
import { useROIState } from '../../hooks/useROIState';
import { MODULE_CATALOG } from '../../lib/modules';

export default function ModulesTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { result } = useROIState();

  return (
    <div className="animate-fade-in space-y-6">
      <HeroBanner variant="compact" />

      <GlobalConfigBar />

      {/* Section header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <CardLabel>{t('modulesHeader.title')}</CardLabel>
          <h2 className="heading-display text-2xl text-text-primary">{t('modulesTab.title')}</h2>
          <p className="text-sm text-text-secondary mt-1">{t('modulesTab.subtitle')}</p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs text-text-secondary">
          <span className="uppercase tracking-wider font-semibold">
            {t('modulesHeader.impactLegend')}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <ImpactDots impact="high" />
              <span>{t('impact.high')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ImpactDots impact="medium" />
              <span>{t('impact.medium')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ImpactDots impact="low" />
              <span>{t('impact.low')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {MODULE_CATALOG.map((module) => {
          const moduleResult = result.modules.find((r) => r.id === module.id)!;
          return <ModuleConfigCard key={module.id} module={module} result={moduleResult} />;
        })}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between gap-3 pt-4">
        <Button
          variant="ghost"
          iconLeft={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/context')}
        >
          {t('ui.back')}
        </Button>
        <Button
          variant="primary"
          iconRight={<ArrowRight className="h-4 w-4" />}
          onClick={() => navigate('/results')}
        >
          {t('ui.next')}
        </Button>
      </div>
    </div>
  );
}
