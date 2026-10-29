import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import mapping from '@/data/margonem-builds-mapping.json';
import proffesions from '@/data/proffesions';
import { simulateBuild } from '@/lib/simulate-build';

test('mapping covers every simulator action exactly once in its own profession', () => {
 let mapped = 0;
 const unsupported: string[] = [];
 for (const [code, catalog] of Object.entries(mapping.professions)) {
  const simulator = proffesions.find((p) => p.value === catalog.simulatorProfession)!;
  const names: string[] = [];
  for (const [id, skill] of Object.entries(catalog.skills)) {
   if (skill.simulatorName === null) {
    if (skill.active) unsupported.push(`${code}/${id}`);
    continue;
   }
   assert.equal(skill.active, true);
   assert.equal(simulator.abilities.filter((a) => a.name === skill.simulatorName).length, 1);
   names.push(skill.simulatorName);
   // Exercise actual ID translation and cost setup for every mapped action.
   const result = simulateBuild({
    build: { profession: code, level: 300, skills: { [id]: 10 }, mastery: { skills: [Number(id)], repeat: false } },
    character: { mana: 100000, energy: 100000, manaRegen: 0, energyRegen: 0 },
   });
   assert.equal(result.turns_executed, 1);
   assert.equal(result.turns[0].name, skill.simulatorName);
   assert.equal(result.turns[0].rank, 10);
   mapped++;
  }
  assert.deepEqual(names.sort(), simulator.abilities.map((a) => a.name).sort());
 }
 assert.equal(mapped, 80);
 assert.deepEqual(unsupported, ['h/238']);
});

const reference = process.env.MARGONEM_BUILDS_DIR;
test('mapping agrees with the actual local margonem-builds snapshot (opt-in, offline)', { skip: !reference }, () => {
 const current = JSON.parse(readFileSync(join(reference!, 'data/current.json'), 'utf8'));
 assert.equal(current.snapshot_id, mapping.snapshot_id);
 const bytes = readFileSync(join(reference!, 'data/snapshots', current.snapshot_id, 'skills.json'));
 assert.equal(createHash('sha256').update(bytes).digest('hex'), mapping.source_sha256);
 const source = JSON.parse(bytes.toString('utf8'));
 assert.equal(source.version, mapping.data_version);
 const skills = new Map<number, { name: string; attrs: number }>(source.skills.map((s: { id: number; name: string; attrs: number }) => [s.id, s]));
 for (const [code, catalog] of Object.entries(mapping.professions)) {
  const ids: number[] = source.skillTrees[code].flat();
  assert.deepEqual(Object.keys(catalog.skills).map(Number).sort((a, b) => a - b), [...ids].sort((a, b) => a - b));
  for (const [id, skill] of Object.entries(catalog.skills)) {
   assert.equal(skill.name, skills.get(Number(id))!.name);
   assert.equal(skill.active, Boolean(skills.get(Number(id))!.attrs & 1));
  }
 }
});
