import { AbilityWithState } from "./AbilityWithState";

export type Turn = {
  id: number;
  roundId: number;
  abilityWithState: AbilityWithState;
  mana: {
    current: number;
    abilityCost: number;
  };
  energy: {
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
  rounds: Round[];
  turnsCount: number;
  message: string;
};
