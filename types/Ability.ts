export type PowerUnit = {
 initialCost: number | null;
 multiplierForInitialCostBasedOnLevel: number | null;
 growth:
  | number
  | [number, number, number, number, number, number, number, number, number]
  | null;
 growthDown?: boolean;
 multiplierForGrowthCostBasedOnLevel: number | null;
 multiplierForUsingAbilityTwiceInARow: number | null;
 retrieve?: {
  initialPercentageValue: number;
  percentageGrowth: number | null;
  percentageWeakening: number | null;
 };
};

export type Ability = {
 id: number;
 name: string;
 new?: boolean;
 cpAdd?: number;
 cpUse?: number;
 mana: PowerUnit;
 energy: PowerUnit;
 cooldown:
  | number
  | [
     number,
     number,
     number,
     number,
     number,
     number,
     number,
     number,
     number,
     number
    ];
 minLevel: number;
};
