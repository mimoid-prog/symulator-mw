import type { Round, Simulation, Turn } from './Simulation';

// Additional diagnostics returned to the CLI; the website keeps its existing types.
export type SimulationTurn = Turn & {
 sequenceIndex: number;
};

export type SimulationRound = Omit<Round, 'turns'> & {
 turns: SimulationTurn[];
};

export type SimulationResult = Omit<Simulation, 'rounds'> & {
 rounds: SimulationRound[];
 terminationReason: 'sequence_completed' | 'insufficient_resources' | 'turn_limit' | 'no_progress';
 noProgressReason?: 'empty_sequence' | 'all_actions_on_cooldown';
 blockedAction?: {
  abilityId: number;
  sequenceIndex: number;
  resource: 'mana' | 'energy';
  required: number;
  available: number;
 };
};
