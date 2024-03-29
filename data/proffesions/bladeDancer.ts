import { Proffesion } from '../../types/Proffesion';

const bladeDancer: Proffesion = {
  value: 'bladeDancer',
  label: 'Tancerz ostrzy',
  abilities: [
    {
      id: 1,
      name: 'Trujące pchnięcie',
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      energy: {
        initialCost: 24,
        multiplierForInitialCostBasedOnLevel: null,
        growth: 1,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 0,
      minLevel: 25,
    },
    {
      id: 2,
      name: 'Błyskawiczny cios',
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      energy: {
        initialCost: 16,
        multiplierForInitialCostBasedOnLevel: null,
        growth: 3,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 0,
      minLevel: 25,
    },
    {
      id: 3,
      name: 'Podstępne uderzenie',
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
        growth: 2,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 4,
      minLevel: 35,
    },
    {
      id: 4,
      name: 'Stłamszenie',
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      energy: {
        initialCost: 18,
        multiplierForInitialCostBasedOnLevel: null,
        growth: 2,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 2,
      minLevel: 35,
    },
    {
      id: 5,
      name: 'Zadziorny atak',
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      energy: {
        initialCost: 15,
        multiplierForInitialCostBasedOnLevel: null,
        growth: 2,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 0,
      minLevel: 35,
    },
    {
      id: 6,
      name: 'Rozpraszający atak',
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      energy: {
        initialCost: 16,
        multiplierForInitialCostBasedOnLevel: null,
        growth: [1, 1, 1, 1, 2, 2, 2, 2, 2],
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 0,
      minLevel: 50,
    },
    {
      id: 7,
      name: 'Wirujące ostrze',
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      energy: {
        initialCost: 11,
        multiplierForInitialCostBasedOnLevel: null,
        growth: 1,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 2,
      minLevel: 50,
    },
    {
      id: 8,
      name: 'Jadowity podmuch',
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      energy: {
        initialCost: 21,
        multiplierForInitialCostBasedOnLevel: null,
        growth: 1,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 0,
      minLevel: 50,
    },
    {
      id: 9,
      name: 'Furia',
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
        growth: 2,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 8,
      minLevel: 80,
    },
    {
      id: 10,
      name: 'Odetchnięcie',
      new: true,
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      energy: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
        retrieve: {
          initialPercentageValue: 32,
          percentageGrowth: 2,
          percentageWeakening: 10,
        },
      },
      cooldown: 0,
      minLevel: 80,
    },
    {
      id: 11,
      name: 'Opatrywanie ran',
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      energy: {
        initialCost: 40,
        multiplierForInitialCostBasedOnLevel: null,
        growth: 2,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 8,
      minLevel: 120,
    },
    {
      id: 12,
      name: 'Zamroczenie',
      new: true,
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
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
      cooldown: 12,
      minLevel: 170,
    },
    {
      id: 13,
      name: 'Amok',
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      energy: {
        initialCost: 32,
        multiplierForInitialCostBasedOnLevel: null,
        growth: 2,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 16,
      minLevel: 170,
    },
  ],
};

export default bladeDancer;
