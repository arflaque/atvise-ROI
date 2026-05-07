import type { ScenarioId } from '../types';

/**
 * Scenario multipliers — applied to each module's improvement %.
 * Conservative under-promises (good for board presentations);
 * Aggressive shows the upside ceiling (good for early-stage discovery).
 */
export const SCENARIO_MULTIPLIERS: Record<ScenarioId, number> = {
  conservative: 0.7,
  realistic: 1.0,
  aggressive: 1.3,
};

/** Confidence weight per scenario — higher when assumptions are conservative. */
export const SCENARIO_CONFIDENCE: Record<ScenarioId, number> = {
  conservative: 95,
  realistic: 80,
  aggressive: 60,
};

export const SCENARIO_IDS: ScenarioId[] = ['conservative', 'realistic', 'aggressive'];
