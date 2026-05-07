import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

interface NumberInputProps {
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  prefix?: string;
  className?: string;
  ariaLabel?: string;
  /** Visual size — affects font + height */
  size?: 'sm' | 'md';
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  unit,
  prefix,
  className,
  ariaLabel,
  size = 'md',
}: NumberInputProps) {
  const { t } = useTranslation();
  const [raw, setRaw] = useState<string>(String(value));
  const [error, setError] = useState<string | null>(null);

  // Keep local raw in sync when the controlled value changes (e.g. URL load)
  useEffect(() => {
    setRaw(String(value));
  }, [value]);

  const validate = (next: number): string | null => {
    if (!isFinite(next)) return t('validation.invalidNumber');
    if (next < min) return t('validation.min', { min });
    if (next > max) return t('validation.max', { max });
    return null;
  };

  const handleBlur = () => {
    const parsed = parseFloat(raw.replace(',', '.'));
    const err = validate(parsed);
    setError(err);
    if (!err) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
      setRaw(String(clamped));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRaw(e.target.value);
    const parsed = parseFloat(e.target.value.replace(',', '.'));
    if (isFinite(parsed) && parsed >= min && parsed <= max) {
      onChange(parsed);
      setError(null);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex items-center rounded-md border border-border bg-bg-base/60 transition-all',
          'focus-within:border-accent focus-within:[box-shadow:0_0_0_3px_rgb(var(--accent)/0.15)]',
          error && 'border-negative focus-within:border-negative focus-within:[box-shadow:0_0_0_3px_rgb(var(--negative)/0.15)]',
          size === 'sm' ? 'h-9' : 'h-11'
        )}
      >
        {prefix && (
          <span className="pl-3 text-text-muted text-sm font-medium select-none">{prefix}</span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={raw}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label={ariaLabel}
          aria-invalid={!!error}
          step={step}
          className={cn(
            'flex-1 min-w-0 bg-transparent border-none px-3 outline-none',
            'font-mono tabular-nums text-text-primary placeholder:text-text-muted',
            size === 'sm' ? 'text-sm' : 'text-base'
          )}
        />
        {unit && (
          <span className="pr-3 text-text-muted text-xs uppercase tracking-wide select-none">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-negative">{error}</p>}
    </div>
  );
}
