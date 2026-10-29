import { AbilityWithState } from "./AbilityWithState";

export type Turn = {
  id: number;
  roundId: number;
  sequenceIndex: number;
  combinationPointsBefore: number;
  abilityWithState: AbilityWithState;
  mana: {
    before: number;
    current: number;
    abilityCost: number;
  };
  energy: {
    before: number;
    current: number;
    abilityCost: number;
  };
  combinationPoints: number;
};

export type Round = {
  id: number;
  turns: Turn[];
};

export type Simulation = {
  terminationReason: 'sequence_completed' | 'insufficient_resources' | 'turn_limit' | 'no_progress';
  noProgressReason?: 'empty_sequence' | 'all_actions_on_cooldown';
  blockedAction?: {
    abilityId: number;
    sequenceIndex: number;
    resource: 'mana' | 'energy';
    required: number;
    available: number;
  };
  finalMana: number;
  finalEnergy: number;
  finalCombinationPoints: number;
  rounds: Round[];
  turnsCount: number;
  message: string;
  combinationPointsCap: number;
};
