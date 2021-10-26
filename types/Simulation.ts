import { AbilityWithState } from "./AbilityWithState";

export type Turn = {
  abilityWithState: AbilityWithState;
  currentMana: number;
  currentEnergy: number;
};

export type Simulation = {
  turns: Turn[];
  message: string;
};
