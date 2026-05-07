import { Moon, Sun } from 'lucide-react';
import { useROIState } from '../../hooks/useROIState';
import { cn } from '../../lib/cn';

export function ThemeToggle() {
  const { state, setTheme } = useROIState();
  const isDark = state.theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'corporate' : 'dark')}
      title={isDark ? 'Switch to corporate theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex items-center justify-center h-9 w-9 rounded-md border border-border',
        'text-text-primary transition-all',
        'hover:border-accent hover:text-accent'
      )}
      aria-label="Toggle theme"
    >
      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
