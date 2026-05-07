// =====================================================================
// Vester ROI Platform — Domain types
// =====================================================================

export type ModuleId =
  | 'downtime'
  | 'energy'
  | 'maintenance'
  | 'production'
  | 'quality'
  | 'digitalization';

export type ImpactLevel = 'low' | 'medium' | 'high';

export type ScenarioId = 'conservative' | 'realistic' | 'aggressive';

export type Locale = 'es' | 'en' | 'pt' | 'fr';

export type Theme = 'dark' | 'corporate';

export type TabId = 'context' | 'modules' | 'results' | 'report';

export type Currency = 'USD' | 'EUR' | 'BRL' | 'MXN' | 'COP' | 'ARS' | 'CLP';

/** Catalog entry — static metadata about each ROI module. */
export interface ModuleDefinition {
  id: ModuleId;
  /** lucide-react icon name */
  icon: string;
  /** i18n key prefix — e.g. 'modules.downtime.name' */
  i18nKey: string;
  /** Estimated improvement range (percentage points). Used in Context tab. */
  improvementRange: { min: number; max: number };
  /** Default impact level when first activated. */
  defaultImpact: ImpactLevel;
  /** Suggested tools (i18n keys) shown in the Context tab. */
  toolKeys: [string, string, string];
  /** Field schema for the Modules tab. */
  inputs: ModuleInputSchema[];
}

export interface ModuleInputSchema {
  key: string;
  /** i18n key for the label */
  labelKey: string;
  /** i18n key for tooltip explanation */
  tooltipKey: string;
  unit: 'currency' | 'hours' | 'percent' | 'count' | 'kwh' | 'units';
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

/** Per-module user state in the Modules tab. */
export interface ModuleState {
  enabled: boolean;
  impact: ImpactLevel;
  /** Free-form input map keyed by ModuleInputSchema.key */
  values: Record<string, number>;
}

/** Top-level project context (configurable in the global config bar). */
export interface ProjectContext {
  industry: string;
  plantSize: 'small' | 'medium' | 'large' | 'enterprise';
  currency: Currency;
  investment: number;
  scenario: ScenarioId;
  /** Optional client/project label for the Executive Report */
  projectName?: string;
  clientName?: string;
}

/** Full app state — what gets serialized to URL params. */
export interface AppState {
  context: ProjectContext;
  modules: Record<ModuleId, ModuleState>;
  locale: Locale;
  theme: Theme;
}

// =====================================================================
// Calculation outputs
// =====================================================================

export interface ModuleResult {
  id: ModuleId;
  enabled: boolean;
  /** Annual savings in selected currency */
  annualSavings: number;
  /** % contribution to total ROI */
  contributionPct: number;
  /** Improvement % applied (resolves with scenario multiplier) */
  appliedImprovementPct: number;
  impact: ImpactLevel;
}

export interface ROIResult {
  modules: ModuleResult[];
  /** Total annual savings */
  annualSavings: number;
  /** 5-year cumulative net benefit */
  fiveYearNetBenefit: number;
  /** Payback period in months */
  paybackMonths: number;
  /** ROI % over 5 years */
  totalROIPct: number;
  /** NPV at 8% discount, 5-year horizon */
  npv: number;
  /** Approximate IRR */
  irrPct: number;
  /** Risk score reduction in % (qualitative composite) */
  riskReductionPct: number;
  /** 0–100 confidence score based on # of enabled modules + scenario */
  confidence: number;
  investment: number;
  currency: Currency;
}

// =====================================================================
// i18n
// =====================================================================

export interface LocaleDictionary {
  [key: string]: string | LocaleDictionary;
}
