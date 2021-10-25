const proffesions = [
  {
    value: "trailer",
    label: "Tropciciel",
    abilities: [
      {
        id: 1,
        name: "Lodowa strzała",
        initialManaCost: 20,
        manaGrowth: 3,
        initialEnergyCost: 0,
        energyGrowth: 0,
      },
      {
        id: 2,
        name: "Płonąca strzała",
        initialManaCost: 30,
        manaGrowth: 20,
        initialEnergyCost: 0,
        energyGrowth: 0,
      },
      {
        id: 3,
        name: "Porażająca strzała",
        initialManaCost: 30,
        manaGrowth: 10,
        initialEnergyCost: 0,
        energyGrowth: 0,
      },
      {
        id: 4,
        name: "Podwójne trafienie",
        initialManaCost: 0,
        manaGrowth: 0,
        initialEnergyCost: 31,
        energyGrowth: 1,
      },
    ],
  },
  {
    value: "mage",
    label: "Mag",
    abilities: [],
  },
  {
    value: "paladin",
    label: "Paladyn",
    abilities: [],
  },
  {
    value: "warrior",
    label: "Wojownik",
    abilities: [],
  },
  {
    value: "hunter",
    label: "Łowca",
    abilities: [],
  },
  {
    value: "bladeDancer",
    label: "Tancerz ostrzy",
    abilities: [],
  },
];

export default proffesions;
