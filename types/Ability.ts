export type SkillProgression = [
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

export type PowerUnit = {
 initialCost: number | null;
 multiplierForInitialCostBasedOnLevel: number | null;
 // Character level multiplied by the entry for the allocated skill points.
 costMultipliersBySkillLevel?: SkillProgression;
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

export type EnergyPerTurnEffect = {
 progression: [
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
 duration: number;
};

export type Ability = {
 id: number;
 name: string;
 new?: boolean;
 cpAdd?: number;
 cpUse?: number;
 cpEffect?: {
  energy?: {
   percentageRetrieve: number;
  };
  mana?: {
   percentageRetrieve: number;
  };
 };
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
 effects?: {
  energyPerTurn?: EnergyPerTurnEffect;
 };
};
