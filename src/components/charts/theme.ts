/**
 * Resolves CSS variable colors at runtime so Recharts (which needs literal colors)
 * stays in sync with the active theme.
 */
export function readThemeColor(name: string): string {
  if (typeof window === 'undefined') return '#64ffda';
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!v) return '#64ffda';
  // CSS vars are stored as "r g b" → convert to "rgb(...)"
  if (/^\d/.test(v)) return `rgb(${v})`;
  return v;
}

export function rgba(name: string, alpha: number): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!v) return `rgba(100,255,218,${alpha})`;
  return `rgba(${v.replace(/\s+/g, ',')},${alpha})`;
}

export const MODULE_COLORS: Record<string, { var: string; fallback: string }> = {
  downtime:       { var: '--accent',   fallback: '#64ffda' },
  energy:         { var: '--warning',  fallback: '#facc15' },
  maintenance:    { var: '--info',     fallback: '#3b82f6' },
  production:     { var: '--positive', fallback: '#22c55e' },
  quality:        { var: '--negative', fallback: '#ef4444' },
  digitalization: { var: '--text-secondary', fallback: '#94a3c3' },
};

export function getModuleColor(id: string): string {
  const m = MODULE_COLORS[id];
  if (!m) return '#64ffda';
  return readThemeColor(m.var) || m.fallback;
}
