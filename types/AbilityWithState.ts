import { Ability } from "./Ability";

export type AbilityWithState = Ability & {
  points: number;
  manaCost: number;
  energyCost: number;
};
