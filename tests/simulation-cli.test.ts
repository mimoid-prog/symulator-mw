import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const cli = fileURLToPath(new URL('../cli/simulate.mjs', import.meta.url));
const example = readFileSync(new URL('../examples/simulation-input.json', import.meta.url), 'utf8');

function run(input: string) {
 // A real Node subprocess, using stdin and a cwd outside the repository.
 const result = spawnSync(process.execPath, [cli], { input, cwd: tmpdir(), encoding: 'utf8', timeout: 10000 });
 assert.ifError(result.error);
 assert.equal(result.signal, null);
 assert.equal(result.stderr, '');
 assert.equal(result.stdout.trim().split('\n').length, 1);
 return { status: result.status, output: JSON.parse(result.stdout) };
}

test('plain Node CLI reads the example from stdin without a website, from any cwd', () => {
 const { status, output } = run(example);
 assert.equal(status, 0);
 assert.equal(output.ok, true);
 assert.equal(output.turns_executed, 4);
 assert.equal(output.termination.code, 'insufficient_resources');
 assert.equal(output.final.energy, 12);
});

test('CLI returns one JSON error and nonzero exit for malformed or invalid input', () => {
 for (const input of ['', '{', '{} {}', '{}', 'null', JSON.stringify({ ...JSON.parse(example), max_turns: 0 })]) {
  const { status, output } = run(input);
  assert.equal(status, 2);
  assert.equal(output.ok, false);
  assert.equal(typeof output.error.code, 'string');
  assert.equal(typeof output.error.message, 'string');
  assert.equal(output.turns, undefined);
 }
});

test('CLI detects empty/cooldown loops and reports the turn limit', () => {
 for (const [sequence, limit, expected, count] of [
  [[], 1000, 'no_progress', 0], [[271], 1000, 'no_progress', 1], [[-1], 3, 'turn_limit', 3],
 ] as const) {
  const input = JSON.parse(example);
  input.build.skills['271'] = 1;
  input.build.mastery.skills = sequence;
  input.max_turns = limit;
  const { status, output } = run(JSON.stringify(input));
  assert.equal(status, 0);
  assert.equal(output.termination.code, expected);
  assert.equal(output.turns_executed, count);
 }
});
