export type Turn = {
  abilityName: string;
  currentMana: number;
  currentEnergy: number;
};

export type Simulation = {
  turns: Turn[];
  message: string;
};
