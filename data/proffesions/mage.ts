import { Proffesion } from "../../types/Proffesion";

const mage: Proffesion = {
  value: "mage",
  label: "Mag",
  abilities: [
    {
      id: 1,
      name: "Kula ognia",
      mana: {
        initialCost: 35,
        multiplierForInitialCostBasedOnLevel: null,
        growth: [10, 10, 10, 10, 10, 15, 20, 20, 20],
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
      id: 2,
      name: "Lodowy pocisk",
      mana: {
        initialCost: 24,
        multiplierForInitialCostBasedOnLevel: null,
        growth: [2, 2, 2, 3, 4, 4, 6, 6, 7],
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
      id: 3,
      name: "Porażenie",
      mana: {
        initialCost: 30,
        multiplierForInitialCostBasedOnLevel: null,
        growth: 8,
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
      name: "Fuzja żywiołów",
      mana: {
        initialCost: 19,
        multiplierForInitialCostBasedOnLevel: null,
        growth: 3,
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
      id: 5,
      name: "Łańcuch piorunów",
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: 0.82,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: 0.07,
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
      minLevel: 35,
    },
    {
      id: 6,
      name: "Ściana ognia",
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: 0.72,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: 0.07,
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
      minLevel: 35,
    },
    {
      id: 7,
      name: "Leczenie ran",
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: 1.1,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: 0.1,
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
      minLevel: 35,
    },
    {
      id: 8,
      name: "Szadź",
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: 0.65,
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
      cooldown: 4,
      minLevel: 35,
    },
    {
      id: 9,
      name: "Chwila skupienia",
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
        retrieve: {
          initialPercentageValue: 44,
          percentageGrowth: 4,
          percentageWeakening: 10,
        },
      },
      energy: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: null,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: null,
        multiplierForUsingAbilityTwiceInARow: null,
      },
      cooldown: 0,
      minLevel: 50,
    },
    {
      id: 10,
      name: "Zdrowa atmosfera",
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: 1.1,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: 0.1,
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
      minLevel: 50,
    },
    {
      id: 11,
      name: "Duszący pocisk",
      mana: {
        initialCost: 24,
        multiplierForInitialCostBasedOnLevel: null,
        growth: 4,
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
      minLevel: 50,
    },
    {
      id: 12,
      name: "Krytyczna potęga",
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: 0.55,
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
      cooldown: 7,
      minLevel: 80,
    },
    {
      id: 13,
      name: "Tarcza odporności",
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
      id: 14,
      name: "Magiczna bariera",
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: 0.3,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: 0.04,
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
    {
      id: 15,
      name: "Klątwa",
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: 1.1,
        growth: null,
        multiplierForGrowthCostBasedOnLevel: 0.1,
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
    {
      id: 16,
      name: "Śmierdzący pocisk",
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: 0.15,
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
      cooldown: 0,
      minLevel: 170,
    },
    {
      id: 17,
      name: "Wewnętrzny spokój",
      mana: {
        initialCost: null,
        multiplierForInitialCostBasedOnLevel: 2,
        growth: null,
        growthDown: true,
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
      minLevel: 230,
    },
  ],
};

export default mage;
