import { Proffesion } from '../../types/Proffesion';

const trailer: Proffesion = {
 value: 'trailer',
 label: 'Tropciciel',
 abilities: [
  {
   id: 1,
   name: 'Lodowa strzała',
   mana: {
    initialCost: 20,
    multiplierForInitialCostBasedOnLevel: null,
    growth: [3, 3, 4, 4, 4, 4, 4, 4, 5],
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   energy: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   cooldown: 0,
   minLevel: 25,
  },
  {
   id: 2,
   name: 'Płonąca strzała',
   mana: {
    initialCost: 30,
    multiplierForInitialCostBasedOnLevel: null,
    growth: 10,
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
   minLevel: 25,
  },
  {
   id: 3,
   name: 'Porażająca strzała',
   mana: {
    initialCost: 30,
    multiplierForInitialCostBasedOnLevel: null,
    growth: 5,
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
   minLevel: 25,
  },
  {
   id: 4,
   name: 'Podwójne trafienie',
   mana: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   energy: {
    initialCost: 25,
    multiplierForInitialCostBasedOnLevel: null,
    growth: 1,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   cooldown: 2,
   minLevel: 25,
  },
  {
   id: 5,
   name: 'Podwójny dech',
   mana: {
    initialCost: 30,
    multiplierForInitialCostBasedOnLevel: null,
    growth: 5,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   energy: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   cooldown: 6,
   minLevel: 35,
  },
  {
   id: 6,
   name: 'Strzała z niespodzianką',
   mana: {
    initialCost: 12,
    multiplierForInitialCostBasedOnLevel: null,
    growth: 2,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   energy: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   cooldown: 3,
   minLevel: 35,
  },
  {
   id: 7,
   name: 'Wycieńczająca strzała',
   mana: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   energy: {
    initialCost: 22,
    multiplierForInitialCostBasedOnLevel: null,
    growth: [2, 1, 2, 1, 2, 1, 2, 1, 2],
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   cooldown: 5,
   minLevel: 35,
  },
  {
   id: 8,
   name: 'Zaklęty grot',
   new: true,
   mana: {
    initialCost: 13,
    multiplierForInitialCostBasedOnLevel: null,
    growth: 2,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   energy: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   cooldown: 4,
   minLevel: 50,
  },
  {
   id: 9,
   name: 'Kojące ochłodzenie',
   mana: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: 1,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: 0.05,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   energy: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   cooldown: 6,
   minLevel: 50,
  },
  {
   id: 10,
   name: 'Przywracanie mocy',
   mana: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
    retrieve: {
     initialPercentageValue: 23,
     percentageGrowth: 3,
     percentageWeakening: 10,
    },
   },
   energy: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
    retrieve: {
     initialPercentageValue: 23,
     percentageGrowth: 3,
     percentageWeakening: 10,
    },
   },
   cooldown: 0,
   minLevel: 50,
  },
  {
   id: 11,
   name: 'Emanująca strzała',
   mana: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: 1,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: 0.05,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   energy: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   cooldown: 5,
   minLevel: 120,
  },
  {
   id: 12,
   name: 'Gwałtowny strzał',
   mana: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   energy: {
    initialCost: 30,
    multiplierForInitialCostBasedOnLevel: null,
    growth: [1, 1, 1, 1, 2, 2, 2, 2, 2],
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   cooldown: 5,
   minLevel: 120,
  },
  {
   id: 13,
   name: 'Śmierdzący ładunek',
   mana: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: 0.42,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: 0.02,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   energy: {
    initialCost: null,
    multiplierForInitialCostBasedOnLevel: null,
    growth: null,
    multiplierForGrowthCostBasedOnLevel: null,
    multiplierForUsingAbilityTwiceInARow: null,
   },
   cooldown: 7,
   minLevel: 170,
  },
 ],
};

export default trailer;
