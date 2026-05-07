import type { Currency, Locale } from '../types';

const LOCALE_TAG: Record<Locale, string> = {
  es: 'es-419',
  en: 'en-US',
  pt: 'pt-BR',
  fr: 'fr-FR',
};

/**
 * Compact currency format — adapts to magnitude:
 *   $4.82M / $750K / $1,250 / $0.18
 */
export function formatCurrency(
  amount: number,
  currency: Currency,
  locale: Locale = 'en',
  options: { compact?: boolean; minDecimals?: number } = {}
): string {
  if (!isFinite(amount)) return '—';
  const { compact = true, minDecimals = 0 } = options;

  const tag = LOCALE_TAG[locale];
  const abs = Math.abs(amount);

  if (compact && abs >= 1_000_000) {
    return new Intl.NumberFormat(tag, {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 2,
    }).format(amount);
  }

  if (compact && abs >= 1_000) {
    return new Intl.NumberFormat(tag, {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(amount);
  }

  return new Intl.NumberFormat(tag, {
    style: 'currency',
    currency,
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(
  n: number,
  locale: Locale = 'en',
  options: Intl.NumberFormatOptions = {}
): string {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat(LOCALE_TAG[locale], options).format(n);
}

export function formatPercent(p: number, locale: Locale = 'en', decimals = 1): string {
  if (!isFinite(p)) return '—';
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(p / 100);
}

export function formatMonths(m: number, locale: Locale = 'en'): string {
  if (!isFinite(m)) return '—';
  return formatNumber(m, locale, { maximumFractionDigits: 1 });
}

/**
 * Compact number with sign — e.g. 1_580_000 → "1.6M", -350_000 → "-350K".
 * No currency prefix, suitable for tight chart labels where the surrounding
 * context already conveys the unit.
 */
export function formatCompactSigned(n: number, locale: Locale = 'en'): string {
  if (!isFinite(n) || n === 0) return n === 0 ? '0' : '—';
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    notation: 'compact',
    compactDisplay: 'short',
    signDisplay: 'auto',
    maximumFractionDigits: 1,
  }).format(n);
}
