import type {
  AppState,
  ModuleId,
  ModuleResult,
  ModuleState,
  ROIResult,
  ScenarioId,
} from '../types';
import { MODULE_CATALOG, MODULE_IDS } from './modules';
import { SCENARIO_CONFIDENCE, SCENARIO_MULTIPLIERS } from './scenarios';

// =====================================================================
// Per-module annual savings — pure functions, fully deterministic.
// All formulas operate on the user's raw inputs + scenario multiplier.
// =====================================================================

const RISK_WEIGHT: Record<ModuleId, number> = {
  downtime: 0.30,
  energy: 0.10,
  maintenance: 0.25,
  production: 0.10,
  quality: 0.15,
  digitalization: 0.10,
};

const IMPACT_WEIGHT = { low: 0.7, medium: 1.0, high: 1.2 } as const;

function clampPct(p: number): number {
  return Math.max(0, Math.min(100, p)) / 100;
}

function calcModuleAnnualSavings(
  id: ModuleId,
  state: ModuleState,
  scenarioMultiplier: number
): { savings: number; appliedPct: number } {
  if (!state.enabled) return { savings: 0, appliedPct: 0 };

  const v = state.values;
  const impactMul = IMPACT_WEIGHT[state.impact];

  switch (id) {
    case 'downtime': {
      const reduction = clampPct((v.reductionPct ?? 0) * scenarioMultiplier);
      const annualLoss = (v.hoursPerMonth ?? 0) * (v.costPerHour ?? 0) * 12;
      return {
        savings: annualLoss * reduction * impactMul,
        appliedPct: reduction * 100,
      };
    }
    case 'energy': {
      const savings = clampPct((v.savingsPct ?? 0) * scenarioMultiplier);
      const annualEnergy = (v.kwhPerMonth ?? 0) * (v.costPerKwh ?? 0) * 12;
      return {
        savings: annualEnergy * savings * impactMul,
        appliedPct: savings * 100,
      };
    }
    case 'maintenance': {
      const improvement = clampPct((v.improvementPct ?? 0) * scenarioMultiplier);
      const annualCost = (v.monthlyCost ?? 0) * 12;
      return {
        savings: annualCost * improvement * impactMul,
        appliedPct: improvement * 100,
      };
    }
    case 'production': {
      const increase = clampPct((v.increasePct ?? 0) * scenarioMultiplier);
      const annualValue = (v.monthlyOutput ?? 0) * (v.unitMargin ?? 0) * 12;
      return {
        savings: annualValue * increase * impactMul,
        appliedPct: increase * 100,
      };
    }
    case 'quality': {
      const reduction = clampPct((v.reductionPct ?? 0) * scenarioMultiplier);
      const annualScrap = (v.monthlyScrapCost ?? 0) * 12;
      return {
        savings: annualScrap * reduction * impactMul,
        appliedPct: reduction * 100,
      };
    }
    case 'digitalization': {
      const improvement = clampPct((v.improvementPct ?? 0) * scenarioMultiplier);
      const visibilityValue = (v.connectedAssets ?? 0) * (v.valuePerAsset ?? 0);
      return {
        savings: visibilityValue * improvement * impactMul,
        appliedPct: improvement * 100,
      };
    }
  }
}

// =====================================================================
// Aggregate ROI — combines all modules into a single financial picture.
// =====================================================================

const DISCOUNT_RATE = 0.08; // 8% — standard industrial NPV rate
const HORIZON_YEARS = 5;

export function calculateROI(state: AppState): ROIResult {
  const scenario: ScenarioId = state.context.scenario;
  const multiplier = SCENARIO_MULTIPLIERS[scenario];
  const investment = Math.max(0, state.context.investment);

  const moduleResults: ModuleResult[] = MODULE_IDS.map((id) => {
    const ms = state.modules[id];
    const { savings, appliedPct } = calcModuleAnnualSavings(id, ms, multiplier);
    return {
      id,
      enabled: ms.enabled,
      annualSavings: savings,
      contributionPct: 0, // filled below
      appliedImprovementPct: appliedPct,
      impact: ms.impact,
    };
  });

  const annualSavings = moduleResults.reduce((sum, m) => sum + m.annualSavings, 0);

  // Contribution % per module (relative to total)
  if (annualSavings > 0) {
    moduleResults.forEach((m) => {
      m.contributionPct = (m.annualSavings / annualSavings) * 100;
    });
  }

  // 5-year cumulative net benefit (no discounting — for hero KPI)
  const fiveYearGrossSavings = annualSavings * HORIZON_YEARS;
  const fiveYearNetBenefit = fiveYearGrossSavings - investment;

  // Payback in months
  const paybackMonths = annualSavings > 0 ? (investment / annualSavings) * 12 : Infinity;

  // Total ROI % over horizon
  const totalROIPct = investment > 0 ? (fiveYearNetBenefit / investment) * 100 : 0;

  // NPV @ 8% over 5 years (treats annual savings as end-of-period cash flows)
  let npv = -investment;
  for (let year = 1; year <= HORIZON_YEARS; year++) {
    npv += annualSavings / Math.pow(1 + DISCOUNT_RATE, year);
  }

  // IRR — bisection on NPV(rate) = 0
  const irrPct = annualSavings > 0 && investment > 0
    ? approximateIRR(investment, annualSavings, HORIZON_YEARS) * 100
    : 0;

  // Risk reduction — weighted average across enabled modules
  let totalRiskWeight = 0;
  let weightedRiskReduction = 0;
  moduleResults.forEach((m) => {
    if (!m.enabled) return;
    const w = RISK_WEIGHT[m.id];
    totalRiskWeight += w;
    weightedRiskReduction += w * m.appliedImprovementPct;
  });
  const riskReductionPct =
    totalRiskWeight > 0 ? weightedRiskReduction / totalRiskWeight : 0;

  // Confidence — base scenario weight, dampened if too few modules enabled
  const enabledCount = moduleResults.filter((m) => m.enabled).length;
  const breadthFactor = Math.min(1, enabledCount / 4); // 4+ modules → full confidence
  const confidence = Math.round(SCENARIO_CONFIDENCE[scenario] * breadthFactor);

  return {
    modules: moduleResults,
    annualSavings,
    fiveYearNetBenefit,
    paybackMonths: Math.min(paybackMonths, 600),
    totalROIPct,
    npv,
    irrPct,
    riskReductionPct: Math.min(100, riskReductionPct),
    confidence,
    investment,
    currency: state.context.currency,
  };
}

// =====================================================================
// IRR via bisection — robust for typical industrial cash flow shapes.
// =====================================================================

function approximateIRR(
  investment: number,
  annualSavings: number,
  years: number
): number {
  const npvAt = (rate: number): number => {
    let n = -investment;
    for (let y = 1; y <= years; y++) n += annualSavings / Math.pow(1 + rate, y);
    return n;
  };

  let low = -0.5;
  let high = 5; // 500% — covers extreme cases
  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2;
    const v = npvAt(mid);
    if (Math.abs(v) < 1) return mid;
    if (v > 0) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

// =====================================================================
// Year-by-year accumulated savings — used by Results timeline chart.
// =====================================================================

export function buildAccumulatedSavings(
  result: ROIResult,
  years = HORIZON_YEARS
): { year: number; cumulative: number; net: number }[] {
  const out = [];
  for (let y = 1; y <= years; y++) {
    const cumulative = result.annualSavings * y;
    const net = cumulative - result.investment;
    out.push({ year: y, cumulative, net });
  }
  return out;
}

// =====================================================================
// Waterfall data — baseline cost → module reductions → investment → net.
// =====================================================================

export function buildWaterfallData(
  result: ROIResult
): { label: string; value: number; type: 'baseline' | 'positive' | 'negative' | 'total' }[] {
  const enabled = result.modules.filter((m) => m.enabled && m.annualSavings > 0);
  const fiveYearTotal = result.annualSavings * HORIZON_YEARS;
  const items: { label: string; value: number; type: 'baseline' | 'positive' | 'negative' | 'total' }[] = [
    { label: 'baseline', value: -result.investment, type: 'baseline' },
    ...enabled.map((m) => ({
      label: m.id,
      value: m.annualSavings * HORIZON_YEARS,
      type: 'positive' as const,
    })),
    { label: 'investment', value: -result.investment, type: 'negative' },
    { label: 'net', value: fiveYearTotal - result.investment, type: 'total' },
  ];
  return items;
}
