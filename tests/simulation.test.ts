import assert from 'node:assert/strict';
import test from 'node:test';
import { Store } from '@/lib/Store';
import { simulateBuild, SimulationInputError } from '@/lib/simulate-build';

function request(sequence = [23, 22, -1], repeat = false) {
 return {
  build: { profession: 'w', level: 50, skills: { '23': 10, '72': 10, '22': 6 } as Record<string, number>, mastery: { skills: sequence, repeat } },
  character: { mana: 0, energy: 100, manaRegen: 0, energyRegen: 5 },
  max_turns: 1000,
 };
}

test('finite sequence translates IDs, applies costs/regen and resets combo points', () => {
 const result = simulateBuild(request());
 assert.equal(result.termination.code, 'sequence_completed');
 assert.equal(result.turns_executed, 3);
 assert.deepEqual(result.turns.map((t) => t.action_id), [23, 22, -1]);
 assert.deepEqual(result.turns.map((t) => t.energy), [
  { before: 100, cost: 34, after: 71 },
  { before: 71, cost: 40, after: 36 },
  { before: 36, cost: 0, after: 41 },
 ]);
 assert.deepEqual(result.turns.map((t) => t.combination_points), [
  { before: 0, after: 1 }, { before: 1, after: 0 }, { before: 0, after: 0 },
 ]);
 assert.deepEqual(result.final, { mana: 0, energy: 41, combination_points: 0 });
 assert.equal(result.turns[2].simulator_ability_id, 0);
});

test('repetition stops before the unaffordable action and reports the exact resource', () => {
 const result = simulateBuild(request(undefined, true));
 assert.equal(result.termination.code, 'insufficient_resources');
 assert.equal(result.turns_executed, 4);
 assert.deepEqual(result.termination.blocked_action, {
  action_id: 22, sequence_index: 1, resource: 'energy', required: 40, available: 12,
 });
 assert.equal(result.final.energy, 12);
});

test('mana exhaustion does not grant a turn or regeneration', () => {
 const input = { build: { profession: 'm', level: 50, skills: { '58': 1 }, mastery: { skills: [58], repeat: true } },
  character: { mana: 22, energy: 0, manaRegen: 100, energyRegen: 0 } };
 const result = simulateBuild(input);
 assert.equal(result.turns_executed, 0);
 assert.equal(result.termination.code, 'insufficient_resources');
 assert.equal(result.termination.blocked_action?.resource, 'mana');
 assert.equal(result.final.mana, 22);
});

test('turn limit is distinct from sequence completion, including exact boundaries', () => {
 const input = request([-1], true);
 input.max_turns = 7;
 const limited = simulateBuild(input);
 assert.equal(limited.turns_executed, 7);
 assert.equal(limited.termination.code, 'turn_limit');
 input.max_turns = 1;
 input.build.mastery.repeat = false;
 assert.equal(simulateBuild(input).termination.code, 'sequence_completed');
 input.build.mastery.skills = [-1, -1];
 assert.equal(simulateBuild(input).termination.code, 'turn_limit');
 const defaultLimit = request([-1], true);
 delete (defaultLimit as { max_turns?: number }).max_turns;
 assert.equal(simulateBuild(defaultLimit).turns_executed, 1000);
 assert.equal(simulateBuild(defaultLimit).termination.code, 'turn_limit');
});

test('empty MW is safe in either repeat mode and in the website Store', () => {
 for (const repeat of [false, true]) {
  const result = simulateBuild(request([], repeat));
  assert.equal(result.turns_executed, 0);
  assert.equal(result.termination.code, 'no_progress');
  assert.equal(result.termination.detail, 'empty_sequence');
  assert.equal(result.final.energy, 100);
 }
 const store = new Store();
 const result = store.generateMwSimulation();
 assert.equal(result.terminationReason, 'no_progress');
 assert.deepEqual(Object.keys(store.simulation!).sort(), ['combinationPointsCap', 'message', 'rounds', 'turnsCount']);
});

test('all cooldowns blocked stops without advancing time or granting regeneration', () => {
 const input = request([271], true);
 input.build.skills = { '271': 1 };
 const result = simulateBuild(input);
 assert.equal(result.turns_executed, 1);
 assert.equal(result.termination.code, 'no_progress');
 assert.equal(result.termination.detail, 'all_actions_on_cooldown');
 assert.equal(result.final.energy, 100);
});

test('cooldown slots are skipped; normal attacks advance cooldowns and regenerate', () => {
 const input = request([22, 22, -1, 22], false);
 const result = simulateBuild(input);
 assert.deepEqual(result.turns.map((t) => t.sequence_index), [0, 2, 3]);
 assert.deepEqual(result.turns.map((t) => t.energy.after), [65, 70, 35]);
 assert.equal(result.termination.code, 'sequence_completed');
});

test('passive allocations never modify supplied final resources or active costs', () => {
 const input = request([23], true);
 const base = simulateBuild(input);
 Object.assign(input.build.skills, { '234': 10, '263': 10, '119': 10 });
 assert.deepEqual(simulateBuild(input), base);
});

test('restoration and repeated-use weakening preserve existing calculation order', () => {
 const result = simulateBuild({
  build: { profession: 'w', level: 50, skills: { '23': 10, '73': 1 }, mastery: { skills: [23, 73, 23, 73], repeat: false } },
  character: { mana: 0, energy: 100, manaRegen: 0, energyRegen: 0 },
 });
 assert.deepEqual(result.turns.map((t) => t.energy.after), [66, 89, 55, 76]);
});

test('repeated casting multiplier and resource caps preserve the existing rules', () => {
 const result = simulateBuild({
  build: { profession: 'm', level: 50, skills: { '70': 1 }, mastery: { skills: [70, 70], repeat: false } },
  character: { mana: 100, energy: 0, manaRegen: 10, energyRegen: 5 },
 });
 assert.deepEqual(result.turns.map((t) => t.mana), [
  { before: 100, cost: 25, after: 85 }, { before: 85, cost: 50, after: 45 },
 ]);
 assert.equal(result.final.energy, 0);
});

test('combo points respect profession caps and can restore resources', () => {
 for (const [profession, id, cap] of [['w', 23, 5], ['m', 58, 4], ['t', 14, 3]] as const) {
  const result = simulateBuild({
   build: { profession, level: 300, skills: { [id]: 1 }, mastery: { skills: Array(8).fill(id), repeat: false } },
   character: { mana: 1000, energy: 1000, manaRegen: 0, energyRegen: 0 },
  });
  assert.equal(result.combination_points_cap, cap);
  assert.equal(result.final.combination_points, cap);
 }
 const result = simulateBuild({
  build: { profession: 'h', level: 50, skills: { '97': 1, '85': 1 }, mastery: { skills: [97, 85], repeat: false } },
  character: { mana: 0, energy: 100, manaRegen: 0, energyRegen: 0 },
 });
 assert.equal(result.final.energy, 82); // 100 - 23 + 5% from one CP.
 assert.equal(result.final.combination_points, 0);
});

test('explicit name alias and profession names resolve without guessing IDs', () => {
 const result = simulateBuild({
  build: { profession: 'Tropiciel', level: 120, skills: { '244': 1 }, mastery: { skills: [244], repeat: false } },
  character: { mana: 100, energy: 0, manaRegen: 0, energyRegen: 0 },
 });
 assert.equal(result.profession, 't');
 assert.equal(result.turns[0].name, 'Emanująca strzała');
 assert.equal(result.turns[0].action_id, 244);
 assert.equal(result.turns[0].mana.cost, 40);
});

test('fractional final resources are not truncated by the browser form parser', () => {
 const input = request([23, -1]);
 input.character.energy = 100.5;
 input.character.energyRegen = 0.25;
 const result = simulateBuild(input);
 assert.equal(result.turns[0].energy.before, 100.5);
 assert.equal(result.final.energy, 67);
});

test('invalid and unsupported data are controlled errors, never normal attacks', () => {
 const cases: Array<[unknown, string]> = [
  [null, 'invalid_input'],
  [{ ...request(), extra: 1 }, 'invalid_input'],
  [{ ...request(), max_turns: 0 }, 'invalid_input'],
  [{ ...request(), max_turns: -1 }, 'invalid_input'],
  [{ ...request(), max_turns: 1.5 }, 'invalid_input'],
  [{ ...request(), max_turns: null }, 'invalid_input'],
  [{ ...request(), max_turns: Infinity }, 'invalid_input'],
  [{ ...request(), max_turns: Number.MAX_SAFE_INTEGER + 1 }, 'invalid_input'],
  [{ ...request(), character: { ...request().character, mana: '0' } }, 'invalid_input'],
  [{ ...request(), character: { ...request().character, energy: -1 } }, 'invalid_input'],
  [{ ...request(), character: { ...request().character, mana: NaN } }, 'invalid_input'],
  [{ ...request(), character: {} }, 'invalid_input'],
  [{ ...request(), character: { ...request().character, energy_regen: 1 } }, 'invalid_input'],
 ];
 const buildCases: Array<[Record<string, unknown>, string]> = [
  [{ profession: 'x' }, 'invalid_profession'], [{ level: 23 }, 'invalid_input'],
  [{ level: 501 }, 'invalid_input'], [{ level: '50' }, 'invalid_input'],
  [{ skills: { '23': 11 } }, 'invalid_input'], [{ skills: { '23': true } }, 'invalid_input'],
  [{ skills: { '023': 1 } }, 'invalid_input'], [{ skills: { '58': 1 } }, 'unknown_skill'],
  [{ skills: { '99999': 1 } }, 'unknown_skill'], [{ skills: [] }, 'invalid_input'],
  [{ mastery: { skills: [-2] } }, 'unsupported_action'], [{ mastery: { skills: [99999] } }, 'unknown_action'],
  [{ mastery: { skills: [0] } }, 'unknown_action'], [{ mastery: { skills: [72] } }, 'passive_action'],
  [{ mastery: { skills: [204] } }, 'unlearned_action'], [{ skills: { '23': 0 } }, 'unlearned_action'],
  [{ mastery: { skills: ['23'] } }, 'invalid_input'], [{ mastery: { skills: Array(21).fill(-1) } }, 'invalid_input'],
  [{ mastery: { repeat: 1 } }, 'invalid_input'], [{ mastery: { typo: true } }, 'invalid_input'],
  [{ weapon_tags: ['unknown'] }, 'invalid_input'], [{ notes: 1 }, 'invalid_input'],
  [{ data_version: 3 }, 'unsupported_data_version'], [{ snapshot_id: 'another' }, 'unsupported_snapshot'],
  [{ profession: 'h', level: 300, skills: { '238': 1 }, mastery: { skills: [238] } }, 'unsupported_action'],
  [{ level: 24 }, 'action_level_locked'],
 ];
 for (const [fields, code] of buildCases) cases.push([{ ...request(), build: { ...request().build, ...fields } }, code]);
 for (const [input, code] of cases) {
  assert.throws(() => simulateBuild(input), (error: unknown) => error instanceof SimulationInputError && error.code === code, JSON.stringify(input));
 }
});
