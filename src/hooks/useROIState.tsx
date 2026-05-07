import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AppState,
  ImpactLevel,
  Locale,
  ModuleId,
  ProjectContext,
  ROIResult,
  Theme,
} from '../types';
import i18next from 'i18next';
import { buildDefaultModuleStates, MODULE_IDS } from '../lib/modules';
import { calculateROI } from '../lib/calculations';
import { decodeStateFromURL, encodeStateToURL } from './useURLState';

const STORAGE_KEY = 'vester-roi-state-v1';

const DEFAULT_CONTEXT: ProjectContext = {
  industry: 'manufacturing',
  plantSize: 'large',
  currency: 'USD',
  investment: 350_000,
  scenario: 'realistic',
};

function buildInitialState(): AppState {
  // Priority: URL params → localStorage → defaults
  const fromUrl = decodeStateFromURL(window.location.search);
  if (fromUrl) return fromUrl;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      // Light validation — fall back to defaults if module shape changed
      if (parsed.context && parsed.modules && MODULE_IDS.every((id) => parsed.modules[id])) {
        return parsed;
      }
    }
  } catch {
    /* ignore */
  }

  return {
    context: DEFAULT_CONTEXT,
    modules: buildDefaultModuleStates(),
    locale: (navigator.language?.slice(0, 2) as Locale) ?? 'es',
    theme: 'dark',
  };
}

// =====================================================================
// Context
// =====================================================================

interface ROIStateValue {
  state: AppState;
  result: ROIResult;
  setContext: (patch: Partial<ProjectContext>) => void;
  toggleModule: (id: ModuleId) => void;
  setModuleEnabled: (id: ModuleId, enabled: boolean) => void;
  setModuleImpact: (id: ModuleId, impact: ImpactLevel) => void;
  setModuleValue: (id: ModuleId, key: string, value: number) => void;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  resetAll: () => void;
  shareableUrl: string;
}

const ROIStateContext = createContext<ROIStateValue | null>(null);

export function ROIStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(buildInitialState);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode — non-fatal */
    }
  }, [state]);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Sync i18next when locale changes
  useEffect(() => {
    if (i18next.language !== state.locale) {
      void i18next.changeLanguage(state.locale);
    }
    document.documentElement.setAttribute('lang', state.locale);
  }, [state.locale]);

  // Sync URL (replace, no history pollution)
  useEffect(() => {
    const params = encodeStateToURL(state);
    const newUrl = `${window.location.pathname}${params}${window.location.hash}`;
    window.history.replaceState(null, '', newUrl);
  }, [state]);

  const setContext = useCallback((patch: Partial<ProjectContext>) => {
    setState((s) => ({ ...s, context: { ...s.context, ...patch } }));
  }, []);

  const setModuleEnabled = useCallback((id: ModuleId, enabled: boolean) => {
    setState((s) => ({
      ...s,
      modules: { ...s.modules, [id]: { ...s.modules[id], enabled } },
    }));
  }, []);

  const toggleModule = useCallback((id: ModuleId) => {
    setState((s) => ({
      ...s,
      modules: {
        ...s.modules,
        [id]: { ...s.modules[id], enabled: !s.modules[id].enabled },
      },
    }));
  }, []);

  const setModuleImpact = useCallback((id: ModuleId, impact: ImpactLevel) => {
    setState((s) => ({
      ...s,
      modules: { ...s.modules, [id]: { ...s.modules[id], impact } },
    }));
  }, []);

  const setModuleValue = useCallback((id: ModuleId, key: string, value: number) => {
    setState((s) => ({
      ...s,
      modules: {
        ...s.modules,
        [id]: {
          ...s.modules[id],
          values: { ...s.modules[id].values, [key]: value },
        },
      },
    }));
  }, []);

  const setLocale = useCallback((locale: Locale) => {
    setState((s) => ({ ...s, locale }));
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setState((s) => ({ ...s, theme }));
  }, []);

  const resetAll = useCallback(() => {
    setState({
      context: DEFAULT_CONTEXT,
      modules: buildDefaultModuleStates(),
      locale: state.locale,
      theme: state.theme,
    });
  }, [state.locale, state.theme]);

  const result = useMemo(() => calculateROI(state), [state]);

  const shareableUrl = useMemo(() => {
    return `${window.location.origin}${window.location.pathname}${encodeStateToURL(state)}`;
  }, [state]);

  const value: ROIStateValue = {
    state,
    result,
    setContext,
    toggleModule,
    setModuleEnabled,
    setModuleImpact,
    setModuleValue,
    setLocale,
    setTheme,
    resetAll,
    shareableUrl,
  };

  return <ROIStateContext.Provider value={value}>{children}</ROIStateContext.Provider>;
}

export function useROIState(): ROIStateValue {
  const ctx = useContext(ROIStateContext);
  if (!ctx) throw new Error('useROIState must be used within <ROIStateProvider>');
  return ctx;
}
