export type Ability = {
  id: number;
  name: string;
  mana: {
    initialCost: number | null;
    multiplierForInitialCostBasedOnLevel: number | null;
    growth: number | number[] | null;
    multiplierForGrowthCostBasedOnLevel: number | null;
  };
  energy: {
    initialCost: number | null;
    multiplierForInitialCostBasedOnLevel: number | null;
    growth: number | number[] | null;
    multiplierForGrowthCostBasedOnLevel: number | null;
  };
  cooldown: number;
  minLevel: number;
};
