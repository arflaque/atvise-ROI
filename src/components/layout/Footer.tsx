import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border bg-bg-surface/50 backdrop-blur-sm">
      <div className="flex items-center justify-end gap-3 px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<Download className="h-3.5 w-3.5" />}
          onClick={() => navigate('/report')}
        >
          {t('ui.download')}
        </Button>
      </div>
    </footer>
  );
}
