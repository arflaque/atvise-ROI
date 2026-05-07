import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroBanner } from '../layout/HeroBanner';
import { ModuleContextCard } from '../modules/ModuleContextCard';
import { Button } from '../ui/Button';
import { CardLabel } from '../ui/Card';
import { MODULE_CATALOG } from '../../lib/modules';

export default function ContextTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <HeroBanner variant="full" />

      {/* Section header */}
      <div className="flex items-end justify-between gap-4 mb-6 mt-2">
        <div>
          <CardLabel>{t('contextTab.title')}</CardLabel>
          <h2 className="heading-display text-2xl sm:text-3xl text-text-primary">
            {t('contextTab.title')}
          </h2>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            {t('contextTab.subtitle')}
          </p>
        </div>
        <Button
          variant="ghost"
          iconRight={<ArrowRight className="h-4 w-4" />}
          onClick={() => navigate('/modules')}
          className="hidden sm:inline-flex"
        >
          {t('ui.next')}
        </Button>
      </div>

      {/* Module cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {MODULE_CATALOG.map((module) => (
          <ModuleContextCard key={module.id} module={module} />
        ))}
      </div>

      {/* Mobile next button */}
      <div className="mt-8 flex justify-center sm:hidden">
        <Button
          variant="primary"
          iconRight={<ArrowRight className="h-4 w-4" />}
          onClick={() => navigate('/modules')}
        >
          {t('ui.next')}
        </Button>
      </div>
    </div>
  );
}
