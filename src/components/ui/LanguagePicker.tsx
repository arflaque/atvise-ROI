import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useROIState } from '../../hooks/useROIState';
import type { Locale } from '../../types';
import { cn } from '../../lib/cn';

const LOCALES: { id: Locale; label: string; native: string }[] = [
  { id: 'es', label: 'ES', native: 'Español' },
  { id: 'en', label: 'EN', native: 'English' },
  { id: 'pt', label: 'PT', native: 'Português' },
  { id: 'fr', label: 'FR', native: 'Français' },
];

export function LanguagePicker() {
  const { state, setLocale } = useROIState();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = LOCALES.find((l) => l.id === state.locale) ?? LOCALES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1.5 h-9 px-2.5 rounded-md border border-border',
          'text-xs font-semibold text-text-primary transition-colors',
          'hover:border-accent hover:text-accent',
          open && 'border-accent text-accent'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="font-mono tabular-nums">{current.label}</span>
        <ChevronDown
          className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 w-44 rounded-md border border-border bg-bg-elevated shadow-card overflow-hidden z-50 animate-fade-in"
        >
          {LOCALES.map((l) => {
            const active = l.id === state.locale;
            return (
              <li key={l.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLocale(l.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 text-sm text-left transition-colors',
                    active
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-primary hover:bg-bg-hover'
                  )}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-xs tabular-nums w-6">{l.label}</span>
                    <span>{l.native}</span>
                  </span>
                  {active && <Check className="h-3.5 w-3.5" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
