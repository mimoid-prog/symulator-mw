import assert from 'node:assert/strict';
import test from 'node:test';
import proffesions from '@/data/proffesions';
import { Store } from '@/lib/Store';
import { decodeShareState, encodeShareState } from '@/utils/share';

function createStore(proffesion: string, level = 300) {
 const store = new Store();
 store.saveBasics({
  proffesion,
  level: String(level),
  mana: '10000',
  energy: '1000',
  manaRegen: '0',
  energyRegen: '0',
 });
 store.isMwSimulationInfinite = false;
 return store;
}

function findAbility(store: Store, name: string) {
 const ability = store.abilitiesWithState.find((item) => item.name === name);
 assert.ok(ability, `Missing ability: ${name}`);
 return ability;
}

function learn(store: Store, name: string, points = 1) {
 const ability = findAbility(store, name);
 store.setAbilityPointsBulk([[ability.id, points]]);
 return store.abilitiesWithState.find((item) => item.id === ability.id)!;
}

function simulate(store: Store, ids: number[]) {
 store.setMwFromAbilityIds(ids);
 store.generateMwSimulation();
 assert.ok(store.simulation);
 return store.simulation.rounds.flatMap((round) => round.turns);
}

test('Srebrzysty blask uses the new mana progression through both allocation paths', () => {
 const multipliers = [0.8, 0.85, 0.9, 0.95, 1, 1.15, 1.3, 1.45, 1.6, 1.75];
 for (const level of [50, 83, 217, 300]) {
  const store = createStore('paladin', level);
  const abilityId = learn(store, 'Srebrzysty blask', 0).id;
  for (let points = 1; points <= 10; points++) {
   store.changeAbilityPoints(true, abilityId, false);
   assert.equal(
    store.abilitiesWithState.find((item) => item.id === abilityId)!.manaCost,
    Math.round(level * multipliers[points - 1])
   );
  }
  store.changeAbilityPoints(false, abilityId, true);
  assert.equal(store.abilitiesWithState.find((item) => item.id === abilityId)!.manaCost, 0);
  for (let points = 0; points <= 10; points++) {
   const ability = learn(store, 'Srebrzysty blask', points);
   assert.equal(ability.manaCost, points === 0 ? 0 : Math.round(level * multipliers[points - 1]));
  }
 }
});

test('Srebrzysty blask regenerates energy on the following eight turns at every skill level', () => {
 const gains = [2, 2, 2, 2, 2, 3, 3, 4, 4, 5];
 for (let points = 1; points <= 10; points++) {
  const store = createStore('paladin');
  store.basics.energy = 100;
  const attack = findAbility(store, 'Szybki atak');
  const glow = findAbility(store, 'Srebrzysty blask');
  store.setAbilityPointsBulk([[attack.id, 10], [glow.id, points]]);
  const turns = simulate(store, [attack.id, glow.id, ...Array<number>(9).fill(0)]);
  assert.equal(turns[0].energy.current, 54);
  assert.equal(turns[1].energy.current, 54);
  for (let tick = 1; tick <= 8; tick++) {
   assert.equal(turns[tick + 1].energy.current, 54 + gains[points - 1] * tick);
  }
  assert.equal(turns[10].energy.current, turns[9].energy.current);
 }
});

test('updated energy costs apply to all ten ranks', () => {
 for (const [profession, name, costs] of [
  ['paladin', 'Szybki atak', [19, 22, 25, 28, 31, 34, 37, 40, 43, 46]],
  ['hunter', 'Dziki zapał', [26, 30, 34, 38, 42, 46, 50, 54, 58, 62]],
 ] as const) {
  const store = createStore(profession);
  costs.forEach((cost, index) => {
   const ability = learn(store, name, index + 1);
   assert.equal(ability.energyCost, cost);
   assert.equal(simulate(store, [ability.id])[0].energy.abilityCost, cost);
  });
 }
});

test('updated cooldowns agree between MW validation and simulated turns', () => {
 const cases: Array<[string, string, number, number]> = [
  ['trailer', 'Podwójne trafienie', 1, 3],
  ['trailer', 'Kojące ochłodzenie', 10, 8],
  ['paladin', 'Srebrzysty blask', 10, 8],
  ['warrior', 'Agresywny atak', 10, 16],
  ['hunter', 'Zdradziecki grot', 10, 16],
  ...Array.from({ length: 10 }, (_, index): [string, string, number, number] =>
   ['warrior', 'Ogłuszający cios', index + 1, index < 3 ? 2 : 1]
  ),
 ];
 for (const [profession, name, points, cooldown] of cases) {
  const store = createStore(profession);
  const ability = learn(store, name, points);
  const turns = simulate(store, [
   ability.id,
   ...Array<number>(cooldown - 1).fill(0),
   ability.id,
   0,
   ability.id,
  ]);
  const uses = turns.filter((turn) => turn.abilityWithState.id === ability.id);
  assert.deepEqual(uses.map((turn) => turn.id), [0, cooldown + 1], name);
  assert.equal(store.cooldownByAbilityId.get(ability.id), cooldown);
  assert.equal(store.isAbilityDisabledAtSlot(cooldown, ability.id), true);
  // Start a fresh MW to check availability immediately after cooldown expiry.
  store.setMwFromAbilityIds([ability.id, ...Array<number>(cooldown).fill(0)]);
  assert.equal(store.isAbilityDisabledAtSlot(cooldown + 1, ability.id), false);
 }
});

test('Zdradziecki grot can be used with no energy at any rank', () => {
 const store = createStore('hunter');
 store.basics.energy = 0;
 for (let points = 1; points <= 10; points++) {
  const ability = learn(store, 'Zdradziecki grot', points);
  assert.equal(ability.energyCost, 0);
  const turns = simulate(store, [ability.id]);
  assert.equal(turns.length, 1);
  assert.equal(turns[0].energy.current, 0);
  assert.equal(store.simulation!.message, '');
 }
});

test('Agresywny atak generates a combination point', () => {
 const store = createStore('warrior');
 const attack = findAbility(store, 'Agresywny atak');
 const stun = findAbility(store, 'Ogłuszający cios');
 store.setAbilityPointsBulk([[attack.id, 1], [stun.id, 1]]);
 const turns = simulate(store, [attack.id, stun.id]);
 assert.equal(turns[0].combinationPoints, 1);
 assert.equal(turns[1].combinationPoints, 0);
});

test('moved active skills become available at their new level boundaries', () => {
 for (const [profession, name, minLevel] of [
  ['bladeDancer', 'Opatrywanie ran', 80],
  ['warrior', 'Agresywny atak', 120],
  ['paladin', 'Kula światłości', 170],
 ] as const) {
  assert.equal(createStore(profession, minLevel - 1).abilitiesWithState.some((item) => item.name === name), false);
  assert.equal(createStore(profession, minLevel).abilitiesWithState.some((item) => item.name === name), true);
 }
});

test('removed, passive and ally-only skills cannot be placed in a personal MW', () => {
 for (const [profession, name] of [
  ['paladin', 'Aura szybkości'],
  ['mage', 'Magiczna osłona'],
  ['hunter', 'Oczyszczenie'],
 ]) {
  assert.equal(createStore(profession).abilitiesWithState.some((item) => item.name === name), false);
 }
});

test('abilities have unique IDs and are ordered by required level', () => {
 const abilities = proffesions.flatMap((profession) => profession.abilities);
 assert.equal(new Set(abilities.map((ability) => ability.id)).size, abilities.length);
 for (const profession of proffesions) {
  const levels = profession.abilities.map((ability) => ability.minLevel);
  assert.deepEqual(levels, [...levels].sort((a, b) => a - b), profession.value);
 }
});

test('share links restore skills, points and MW for all six professions', () => {
 for (const profession of proffesions) {
  const store = createStore(profession.value);
  const ids = profession.abilities.map((ability) => ability.id);
  store.setAbilityPointsBulk(ids.map((id) => [id, 10]));
  store.setMwFromAbilityIds(ids);
  const encoded = encodeShareState(store);
  assert.ok(encoded);
  const decoded = decodeShareState(encoded);
  assert.ok(decoded);
  const restored = new Store(decoded);
  assert.equal(restored.basics.proffesion, profession.value);
  assert.deepEqual(restored.mw.map((slot) => slot.abilityId), store.mw.map((slot) => slot.abilityId));
  for (const id of ids) {
   assert.equal(restored.abilitiesWithState.find((ability) => ability.id === id)?.points, 10);
  }
  if (profession.value === 'paladin') {
   assert.equal(findAbility(restored, 'Srebrzysty blask').manaCost, 525);
  }
 }
});

test('shares below level 120 replace Agresywny atak with a normal attack', () => {
 const store = createStore('warrior');
 const attack = findAbility(store, 'Agresywny atak');
 const stun = findAbility(store, 'Ogłuszający cios');
 store.setAbilityPointsBulk([[attack.id, 10], [stun.id, 3]]);
 store.setMwFromAbilityIds([attack.id, stun.id]);
 const encoded = encodeShareState(store);
 assert.ok(encoded);
 const decoded = decodeShareState(encoded);
 assert.ok(decoded);
 decoded.basics.level = 83;
 const restored = new Store(decoded);
 assert.deepEqual(restored.mw.map((slot) => slot.abilityId), [0, stun.id]);
 assert.equal(findAbility(restored, 'Ogłuszający cios').points, 3);
});
