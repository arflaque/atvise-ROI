import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { LanguagePicker } from '../ui/LanguagePicker';
import { ThemeToggle } from '../ui/ThemeToggle';
import { BrandLogos } from './BrandLogos';
import { cn } from '../../lib/cn';
import type { TabId } from '../../types';

const TABS: { id: TabId; path: string; labelKey: string }[] = [
  { id: 'context', path: '/context', labelKey: 'nav.context' },
  { id: 'modules', path: '/modules', labelKey: 'nav.modules' },
  { id: 'results', path: '/results', labelKey: 'nav.results' },
  { id: 'report', path: '/report', labelKey: 'nav.report' },
];

export function TopNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-base/85 backdrop-blur-md">
      <div className="flex items-center gap-6 px-6 h-16">
        {/* Brand — atvise + Vester lockup, theme-aware */}
        <div className="flex items-center gap-4">
          <BrandLogos size={26} />
          <span aria-hidden className="hidden lg:block h-6 w-px bg-border" />
          <span className="hidden lg:block text-[10px] font-label uppercase tracking-widest text-text-muted">
            {t('brand.product')}
          </span>
        </div>

        {/* Tabs */}
        <nav className="flex-1 flex justify-center gap-1 sm:gap-2">
          {TABS.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors',
                  'after:absolute after:left-3 after:right-3 after:bottom-0 after:h-0.5 after:rounded-full',
                  isActive
                    ? 'text-text-primary after:bg-accent after:[box-shadow:0_0_8px_rgb(var(--accent)/0.6)]'
                    : 'text-text-secondary hover:text-text-primary after:bg-transparent'
                )
              }
            >
              {t(tab.labelKey)}
            </NavLink>
          ))}
        </nav>

        {/* Right cluster: language + theme + primary action */}
        <div className="flex items-center gap-2">
          <LanguagePicker />
          <ThemeToggle />
          <Button
            variant="primary"
            iconLeft={<Sparkles className="h-4 w-4" />}
            onClick={() => navigate('/report')}
            className="hidden md:inline-flex"
          >
            {t('ui.generate')}
          </Button>
        </div>
      </div>
    </header>
  );
}
