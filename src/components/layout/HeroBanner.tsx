import { useTranslation } from 'react-i18next';
import { Factory, Sparkles } from 'lucide-react';
import { Card, CardLabel } from '../ui/Card';

interface Props {
  /** Show the big hero (Context tab). False on inner tabs gives a compact version. */
  variant?: 'full' | 'compact';
}

export function HeroBanner({ variant = 'full' }: Props) {
  const { t } = useTranslation();

  if (variant === 'compact') {
    return (
      <div className="mb-6">
        <CardLabel className="text-accent">{t('hero.label')}</CardLabel>
        <h1 className="heading-display text-2xl sm:text-3xl text-text-primary">
          {t('hero.titlePart1')}{' '}
          <span className="text-accent">{t('hero.titleHighlight')}</span>
        </h1>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden mb-6 relative">
      {/* Industrial backdrop — pure CSS so no external image required for GH Pages */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-bg grid-bg-animated opacity-40" />
        {/* Faux skyline */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-30"
          viewBox="0 0 800 200"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 200 L0 140 L40 140 L40 100 L80 100 L80 130 L120 130 L120 80 L160 80 L160 110 L200 110 L200 60 L220 50 L240 60 L240 120 L290 120 L290 90 L330 90 L330 130 L380 130 L380 70 L420 70 L420 110 L470 110 L470 140 L520 140 L520 90 L560 80 L560 130 L610 130 L610 100 L660 100 L660 150 L720 150 L720 110 L760 110 L760 140 L800 140 L800 200 Z"
            fill="url(#sky)"
          />
        </svg>
        {/* Particle dots */}
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_15%_20%,rgb(var(--accent)/0.4)_1px,transparent_1px),radial-gradient(circle_at_85%_30%,rgb(var(--info)/0.3)_1px,transparent_1px),radial-gradient(circle_at_45%_70%,rgb(var(--accent)/0.2)_1px,transparent_1px)] [background-size:200px_200px,300px_300px,250px_250px]" />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 p-8 lg:p-10">
        <div className="flex flex-col gap-5 max-w-2xl">
          <CardLabel className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            {t('hero.label')}
          </CardLabel>
          <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-text-primary">
            {t('hero.titlePart1')}{' '}
            <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">
              {t('hero.titleHighlight')}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative h-44 w-44 rounded-full border border-border bg-bg-elevated/50 backdrop-blur-sm flex items-center justify-center">
              <Factory className="h-20 w-20 text-accent" strokeWidth={1.2} />
            </div>
            {/* Orbit ring */}
            <div className="absolute inset-0 rounded-full border border-accent/20 animate-pulse-slow" />
          </div>
        </div>
      </div>
    </Card>
  );
}
