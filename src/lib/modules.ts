import type { ModuleDefinition, ModuleId, ModuleState } from '../types';

// =====================================================================
// Module Catalog — static metadata for the 6 ROI driver modules.
// i18n keys resolve through src/locales/*.ts via t('modules.<id>.<key>').
// =====================================================================

export const MODULE_CATALOG: ModuleDefinition[] = [
  {
    id: 'downtime',
    icon: 'Timer',
    i18nKey: 'modules.downtime',
    improvementRange: { min: 15, max: 30 },
    defaultImpact: 'high',
    toolKeys: ['tool.scada', 'tool.smartAlarms', 'tool.eventAnalytics'],
    inputs: [
      {
        key: 'hoursPerMonth',
        labelKey: 'modules.downtime.input.hoursPerMonth',
        tooltipKey: 'modules.downtime.tip.hoursPerMonth',
        unit: 'hours',
        min: 0,
        max: 500,
        step: 1,
        defaultValue: 40,
      },
      {
        key: 'costPerHour',
        labelKey: 'modules.downtime.input.costPerHour',
        tooltipKey: 'modules.downtime.tip.costPerHour',
        unit: 'currency',
        min: 0,
        max: 100000,
        step: 100,
        defaultValue: 2500,
      },
      {
        key: 'reductionPct',
        labelKey: 'modules.downtime.input.reductionPct',
        tooltipKey: 'modules.downtime.tip.reductionPct',
        unit: 'percent',
        min: 0,
        max: 60,
        step: 1,
        defaultValue: 22,
      },
    ],
  },
  {
    id: 'energy',
    icon: 'Zap',
    i18nKey: 'modules.energy',
    improvementRange: { min: 10, max: 20 },
    defaultImpact: 'high',
    toolKeys: ['tool.energyMonitoring', 'tool.energyDashboards', 'tool.consumptionAnalytics'],
    inputs: [
      {
        key: 'kwhPerMonth',
        labelKey: 'modules.energy.input.kwhPerMonth',
        tooltipKey: 'modules.energy.tip.kwhPerMonth',
        unit: 'kwh',
        min: 0,
        max: 10_000_000,
        step: 1000,
        defaultValue: 250_000,
      },
      {
        key: 'costPerKwh',
        labelKey: 'modules.energy.input.costPerKwh',
        tooltipKey: 'modules.energy.tip.costPerKwh',
        unit: 'currency',
        min: 0,
        max: 5,
        step: 0.01,
        defaultValue: 0.18,
      },
      {
        key: 'savingsPct',
        labelKey: 'modules.energy.input.savingsPct',
        tooltipKey: 'modules.energy.tip.savingsPct',
        unit: 'percent',
        min: 0,
        max: 40,
        step: 1,
        defaultValue: 15,
      },
    ],
  },
  {
    id: 'maintenance',
    icon: 'Wrench',
    i18nKey: 'modules.maintenance',
    improvementRange: { min: 10, max: 25 },
    defaultImpact: 'medium',
    toolKeys: ['tool.predictiveMaintenance', 'tool.iotSensors', 'tool.conditionAnalytics'],
    inputs: [
      {
        key: 'monthlyCost',
        labelKey: 'modules.maintenance.input.monthlyCost',
        tooltipKey: 'modules.maintenance.tip.monthlyCost',
        unit: 'currency',
        min: 0,
        max: 5_000_000,
        step: 500,
        defaultValue: 35_000,
      },
      {
        key: 'failuresPerMonth',
        labelKey: 'modules.maintenance.input.failuresPerMonth',
        tooltipKey: 'modules.maintenance.tip.failuresPerMonth',
        unit: 'count',
        min: 0,
        max: 1000,
        step: 1,
        defaultValue: 12,
      },
      {
        key: 'improvementPct',
        labelKey: 'modules.maintenance.input.improvementPct',
        tooltipKey: 'modules.maintenance.tip.improvementPct',
        unit: 'percent',
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 18,
      },
    ],
  },
  {
    id: 'production',
    icon: 'TrendingUp',
    i18nKey: 'modules.production',
    improvementRange: { min: 8, max: 18 },
    defaultImpact: 'medium',
    toolKeys: ['tool.oee', 'tool.mes', 'tool.operationalTraceability'],
    inputs: [
      {
        key: 'monthlyOutput',
        labelKey: 'modules.production.input.monthlyOutput',
        tooltipKey: 'modules.production.tip.monthlyOutput',
        unit: 'units',
        min: 0,
        max: 10_000_000,
        step: 100,
        defaultValue: 25_000,
      },
      {
        key: 'unitMargin',
        labelKey: 'modules.production.input.unitMargin',
        tooltipKey: 'modules.production.tip.unitMargin',
        unit: 'currency',
        min: 0,
        max: 100_000,
        step: 0.1,
        defaultValue: 12,
      },
      {
        key: 'increasePct',
        labelKey: 'modules.production.input.increasePct',
        tooltipKey: 'modules.production.tip.increasePct',
        unit: 'percent',
        min: 0,
        max: 30,
        step: 1,
        defaultValue: 12,
      },
    ],
  },
  {
    id: 'quality',
    icon: 'Award',
    i18nKey: 'modules.quality',
    improvementRange: { min: 5, max: 15 },
    defaultImpact: 'medium',
    toolKeys: ['tool.spc', 'tool.qualityTraceability', 'tool.scrapAnalytics'],
    inputs: [
      {
        key: 'monthlyScrapCost',
        labelKey: 'modules.quality.input.monthlyScrapCost',
        tooltipKey: 'modules.quality.tip.monthlyScrapCost',
        unit: 'currency',
        min: 0,
        max: 5_000_000,
        step: 500,
        defaultValue: 18_000,
      },
      {
        key: 'reworkRatePct',
        labelKey: 'modules.quality.input.reworkRatePct',
        tooltipKey: 'modules.quality.tip.reworkRatePct',
        unit: 'percent',
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 3.8,
      },
      {
        key: 'reductionPct',
        labelKey: 'modules.quality.input.reductionPct',
        tooltipKey: 'modules.quality.tip.reductionPct',
        unit: 'percent',
        min: 0,
        max: 40,
        step: 1,
        defaultValue: 10,
      },
    ],
  },
  {
    id: 'digitalization',
    icon: 'Network',
    i18nKey: 'modules.digitalization',
    improvementRange: { min: 10, max: 20 },
    defaultImpact: 'low',
    toolKeys: ['tool.historian', 'tool.opcua', 'tool.enterpriseDashboards'],
    inputs: [
      {
        key: 'connectedAssets',
        labelKey: 'modules.digitalization.input.connectedAssets',
        tooltipKey: 'modules.digitalization.tip.connectedAssets',
        unit: 'count',
        min: 0,
        max: 100_000,
        step: 10,
        defaultValue: 250,
      },
      {
        key: 'valuePerAsset',
        labelKey: 'modules.digitalization.input.valuePerAsset',
        tooltipKey: 'modules.digitalization.tip.valuePerAsset',
        unit: 'currency',
        min: 0,
        max: 100_000,
        step: 50,
        defaultValue: 600,
      },
      {
        key: 'improvementPct',
        labelKey: 'modules.digitalization.input.improvementPct',
        tooltipKey: 'modules.digitalization.tip.improvementPct',
        unit: 'percent',
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 15,
      },
    ],
  },
];

// =====================================================================
// Helpers
// =====================================================================

export function getModuleDefinition(id: ModuleId): ModuleDefinition {
  const def = MODULE_CATALOG.find((m) => m.id === id);
  if (!def) throw new Error(`Unknown module id: ${id}`);
  return def;
}

export function buildDefaultModuleState(id: ModuleId): ModuleState {
  const def = getModuleDefinition(id);
  const values: Record<string, number> = {};
  for (const input of def.inputs) {
    values[input.key] = input.defaultValue;
  }
  return {
    enabled: true,
    impact: def.defaultImpact,
    values,
  };
}

export function buildDefaultModuleStates(): Record<ModuleId, ModuleState> {
  return Object.fromEntries(
    MODULE_CATALOG.map((m) => [m.id, buildDefaultModuleState(m.id)])
  ) as Record<ModuleId, ModuleState>;
}

export const MODULE_IDS: ModuleId[] = MODULE_CATALOG.map((m) => m.id);
