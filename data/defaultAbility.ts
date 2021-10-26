import { Ability } from "../types/Ability";

const defaultAbility: Ability = {
  id: 0,
  name: "Zwykły atak",
  mana: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    shouldDoubleCostWhenUsedTwiceInARow: true,
  },
  energy: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    shouldDoubleCostWhenUsedTwiceInARow: false,
  },
  cooldown: 0,
  minLevel: 0,
};

export default defaultAbility;
