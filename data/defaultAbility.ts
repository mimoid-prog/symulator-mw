import { AbilityWithState } from "../types/AbilityWithState";

const defaultAbility: AbilityWithState = {
  id: 0,
  name: "Zwykły atak",
  mana: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: 1,
  },
  energy: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
  },
  cooldown: 0,
  minLevel: 0,
  points: 0,
  manaCost: 0,
  energyCost: 0,
};

export default defaultAbility;
