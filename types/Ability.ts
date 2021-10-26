export type PowerUnit = {
  initialCost: number | null;
  multiplierForInitialCostBasedOnLevel: number | null;
  growth: number | number[] | null;
  growthDown?: boolean;
  multiplierForGrowthCostBasedOnLevel: number | null;
  shouldDoubleCostWhenUsedTwiceInARow: boolean;
  retrieve?: {
    initialPercentageValue: number;
    percentageGrowth: number | null;
    percentageWeakening: number | null;
  };
};

export type Ability = {
  id: number;
  name: string;
  mana: PowerUnit;
  energy: PowerUnit;
  cooldown: number;
  minLevel: number;
};
