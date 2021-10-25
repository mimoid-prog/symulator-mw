import { Ability } from "./Ability";

export type AbilityWithState = Ability & {
  points: number;
  mana: number;
  energy: number;
};
