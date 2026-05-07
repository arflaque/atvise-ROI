import type {
  AppState,
  Currency,
  Locale,
  ProjectContext,
  ScenarioId,
  Theme,
} from '../types';
import { buildDefaultModuleStates, getModuleDefinition, MODULE_IDS } from '../lib/modules';

// =====================================================================
// URL ↔ AppState codec
//
// Encoding philosophy: keep query params short and human-readable so links
// shared with prospects look reasonable. Each enabled module becomes one
// param `m_<id>=<impact>:v1,v2,v3` where v1..vN follow the input schema.
// Disabled modules are omitted entirely.
// =====================================================================

const IMPACT_CODE = { low: 'l', medium: 'm', high: 'h' } as const;
const IMPACT_FROM_CODE: Record<string, 'low' | 'medium' | 'high'> = {
  l: 'low',
  m: 'medium',
  h: 'high',
};

const SCENARIO_CODE: Record<ScenarioId, string> = {
  conservative: 'c',
  realistic: 'r',
  aggressive: 'a',
};
const SCENARIO_FROM_CODE: Record<string, ScenarioId> = {
  c: 'conservative',
  r: 'realistic',
  a: 'aggressive',
};

// =====================================================================

export function encodeStateToURL(state: AppState): string {
  const params = new URLSearchParams();

  // Context
  if (state.context.industry !== 'manufacturing') params.set('ind', state.context.industry);
  if (state.context.plantSize !== 'large') params.set('size', state.context.plantSize);
  if (state.context.currency !== 'USD') params.set('cur', state.context.currency);
  if (state.context.investment !== 350_000) params.set('inv', String(state.context.investment));
  params.set('scn', SCENARIO_CODE[state.context.scenario]);
  if (state.context.projectName) params.set('p', state.context.projectName);
  if (state.context.clientName) params.set('cli', state.context.clientName);

  // Locale + theme
  if (state.locale !== 'es') params.set('lng', state.locale);
  if (state.theme !== 'dark') params.set('th', state.theme);

  // Modules — only enabled
  for (const id of MODULE_IDS) {
    const ms = state.modules[id];
    if (!ms.enabled) continue;
    const def = getModuleDefinition(id);
    const values = def.inputs.map((inp) => ms.values[inp.key] ?? inp.defaultValue).join(',');
    const impactCode = IMPACT_CODE[ms.impact];
    params.set(`m_${id}`, `${impactCode}:${values}`);
  }

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

// =====================================================================

export function decodeStateFromURL(search: string): AppState | null {
  if (!search || search === '?') return null;
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

  // Empty string means "no real config in URL"
  if (Array.from(params.keys()).length === 0) return null;

  const context: ProjectContext = {
    industry: params.get('ind') ?? 'manufacturing',
    plantSize: (params.get('size') ?? 'large') as ProjectContext['plantSize'],
    currency: (params.get('cur') ?? 'USD') as Currency,
    investment: numberOr(params.get('inv'), 350_000),
    scenario: SCENARIO_FROM_CODE[params.get('scn') ?? 'r'] ?? 'realistic',
    projectName: params.get('p') ?? undefined,
    clientName: params.get('cli') ?? undefined,
  };

  const locale = (params.get('lng') ?? 'es') as Locale;
  const theme = (params.get('th') ?? 'dark') as Theme;

  // Build modules — start from defaults, then override based on URL params
  const modules = buildDefaultModuleStates();

  // Anything not present in URL → disabled (the URL is the source of truth)
  let anyModuleParam = false;
  for (const id of MODULE_IDS) {
    const raw = params.get(`m_${id}`);
    if (!raw) {
      modules[id].enabled = false;
      continue;
    }
    anyModuleParam = true;
    const def = getModuleDefinition(id);
    const [impactCode, valuesStr = ''] = raw.split(':');
    modules[id].enabled = true;
    modules[id].impact = IMPACT_FROM_CODE[impactCode] ?? def.defaultImpact;
    const values = valuesStr.split(',');
    def.inputs.forEach((inp, idx) => {
      const v = parseFloat(values[idx]);
      modules[id].values[inp.key] = isFinite(v) ? v : inp.defaultValue;
    });
  }

  // If URL has neither modules nor any override params, treat as empty
  if (!anyModuleParam && !params.get('scn') && !params.get('inv')) return null;

  return { context, modules, locale, theme };
}

function numberOr(raw: string | null, fallback: number): number {
  if (!raw) return fallback;
  const n = parseFloat(raw);
  return isFinite(n) ? n : fallback;
}
