import mapping from '@/data/margonem-builds-mapping.json';
import proffesions from '@/data/proffesions';
import { Store } from '@/lib/Store';

export class SimulationInputError extends Error {
 constructor(public code: string, message: string, public path?: string) {
  super(message);
 }
}

function fail(code: string, message: string, path?: string): never {
 throw new SimulationInputError(code, message, path);
}

function object(value: unknown, path: string): Record<string, unknown> {
 if (value === null || typeof value !== 'object' || Array.isArray(value)) {
  fail('invalid_input', `${path} musi być obiektem JSON.`, path);
 }
 return value as Record<string, unknown>;
}

function keys(value: Record<string, unknown>, allowed: string[], path: string) {
 for (const key of Object.keys(value)) {
  if (!allowed.includes(key)) fail('invalid_input', `Nieznane pole ${path}.${key}.`, `${path}.${key}`);
 }
}

function integer(value: unknown, min: number, max: number, path: string): number {
 if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) {
  fail('invalid_input', `${path} musi być liczbą całkowitą od ${min} do ${max}.`, path);
 }
 return value;
}

const professionAliases: Record<string, string> = {
 wojownik: 'w', warrior: 'w', paladyn: 'p', paladin: 'p',
 'tancerz ostrzy': 'b', dancer: 'b', mag: 'm', mage: 'm',
 lowca: 'h', hunter: 'h', tropiciel: 't', tracker: 't',
};

type ProfessionCode = keyof typeof mapping.professions;
type SourceSkill = { name: string; active: boolean; simulatorName: string | null };

export function simulateBuild(input: unknown) {
 const request = object(input, 'input');
 keys(request, ['build', 'character', 'max_turns'], 'input');
 const build = object(request.build, 'build');
 keys(build, ['profession', 'level', 'skills', 'mastery', 'weapon_tags', 'name', 'goal', 'notes', 'data_version', 'snapshot_id'], 'build');
 if (typeof build.profession !== 'string') fail('invalid_input', 'build.profession musi być tekstem.', 'build.profession');
 const folded = build.profession.trim().toLowerCase().replaceAll('ł', 'l').normalize('NFKD').replace(/\p{M}/gu, '');
 const code = professionAliases[folded] ?? folded;
 if (!Object.hasOwn(mapping.professions, code)) fail('invalid_profession', 'Nieznana profesja; użyj w, p, b, m, h lub t.', 'build.profession');
 const profession = code as ProfessionCode;
 const catalog = mapping.professions[profession];
 const sourceSkills: Record<string, SourceSkill> = catalog.skills;
 const level = integer(build.level, 24, 500, 'build.level');
 const maxTurns = request.max_turns === undefined ? 1000 : integer(request.max_turns, 1, Number.MAX_SAFE_INTEGER, 'max_turns');

 for (const field of ['name', 'goal', 'notes', 'snapshot_id']) {
  if (build[field] !== undefined && typeof build[field] !== 'string') fail('invalid_input', `build.${field} musi być tekstem.`, `build.${field}`);
 }
 if (build.data_version !== undefined && build.data_version !== mapping.data_version) {
  fail('unsupported_data_version', `Mapowanie obsługuje data_version=${mapping.data_version}.`, 'build.data_version');
 }
 if (build.snapshot_id !== undefined && build.snapshot_id !== mapping.snapshot_id) {
  fail('unsupported_snapshot', `Mapowanie sprawdzono dla snapshotu ${mapping.snapshot_id}.`, 'build.snapshot_id');
 }
 const weaponTags = ['sw', '1h', '2h', 'bs', 'h', 'dis', 'sh', 'orb', 'fire', 'frost', 'light', 'poison', 'phydis', 'wound'];
 if (build.weapon_tags !== undefined && (!Array.isArray(build.weapon_tags) || build.weapon_tags.some((tag) => typeof tag !== 'string' || !weaponTags.includes(tag)))) {
  fail('invalid_input', 'build.weapon_tags musi być listą znanych tagów broni.', 'build.weapon_tags');
 }

 const ranks = object(build.skills, 'build.skills');
 for (const [id, rank] of Object.entries(ranks)) {
  if (!/^[1-9][0-9]*$/.test(id) || !Number.isSafeInteger(Number(id))) fail('invalid_input', `Nieprawidłowe ID umiejętności: ${id}.`, `build.skills.${id}`);
  integer(rank, 0, 10, `build.skills.${id}`);
  if (!Object.hasOwn(sourceSkills, id)) fail('unknown_skill', `ID ${id} nie należy do drzewka profesji ${profession} w zapisanym snapshocie.`, `build.skills.${id}`);
 }

 const mastery = build.mastery === undefined ? {} : object(build.mastery, 'build.mastery');
 keys(mastery, ['skills', 'repeat'], 'build.mastery');
 const sequence = mastery.skills === undefined ? [] : mastery.skills;
 if (!Array.isArray(sequence) || sequence.length > 20 || sequence.some((id) => !Number.isSafeInteger(id))) {
  fail('invalid_input', 'build.mastery.skills musi być listą maksymalnie 20 całkowitych ID.', 'build.mastery.skills');
 }
 const repeat = mastery.repeat === undefined ? true : mastery.repeat;
 if (typeof repeat !== 'boolean') fail('invalid_input', 'build.mastery.repeat musi być true lub false.', 'build.mastery.repeat');

 const character = object(request.character, 'character');
 const resourceFields = ['mana', 'energy', 'manaRegen', 'energyRegen'] as const;
 keys(character, [...resourceFields], 'character');
 const resources = {} as Record<typeof resourceFields[number], number>;
 for (const field of resourceFields) {
  const value = character[field];
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > Number.MAX_SAFE_INTEGER) {
   fail('invalid_input', `character.${field} musi być skończoną, nieujemną liczbą do ${Number.MAX_SAFE_INTEGER}.`, `character.${field}`);
  }
  resources[field] = value;
 }

 const simulatorProfession = proffesions.find((item) => item.value === catalog.simulatorProfession)!;
 const points = new Map<number, number>();
 const simulatorIds = sequence.map((id: number, index: number) => {
  const path = `build.mastery.skills[${index}]`;
  if (id === -1) return 0;
  if (id === -2) fail('unsupported_action', 'Krok do przodu (-2) nie jest obsługiwany przez symulator.', path);
  const source = Object.hasOwn(sourceSkills, String(id)) ? sourceSkills[String(id)] : undefined;
  if (!source) fail('unknown_action', `Nieznana akcja ${id} dla profesji ${profession}.`, path);
  if (!source.active) fail('passive_action', `${source.name} (${id}) jest umiejętnością pasywną, nie akcją MW.`, path);
  if (!source.simulatorName) fail('unsupported_action', `${source.name} (${id}) nie jest obsługiwana przez silnik symulatora.`, path);
  const rank = ranks[String(id)];
  if (typeof rank !== 'number' || rank <= 0) fail('unlearned_action', `Akcja ${source.name} (${id}) nie ma przydzielonej rangi.`, path);
  const matches = simulatorProfession.abilities.filter((ability) => ability.name === source.simulatorName);
  if (matches.length !== 1) throw new Error(`Niespójne mapowanie ${profession}/${id}: ${source.simulatorName}.`);
  const ability = matches[0];
  if (level < ability.minLevel) fail('action_level_locked', `${source.name} wymaga w symulatorze poziomu ${ability.minLevel}.`, path);
  points.set(ability.id, rank);
  return ability.id;
 });

 // Reuse the website's rank/level cost calculations. Passives never modify final resources.
 const store = new Store();
 store.saveBasics({
  proffesion: catalog.simulatorProfession, level: String(level),
  mana: String(resources.mana), energy: String(resources.energy),
  manaRegen: String(resources.manaRegen), energyRegen: String(resources.energyRegen),
 });
 // saveBasics parses the browser's integer text fields; preserve exact JSON numbers for the CLI.
 store.basics = { ...store.basics, ...resources };
 store.setAbilityPointsBulk([...points]);
 // IDs above have been checked before the website's permissive share-link importer is called.
 store.setMwFromAbilityIds(simulatorIds);
 store.isMwSimulationInfinite = repeat;
 const result = store.generateMwSimulation(maxTurns);
 const blocked = result.blockedAction;
 const turns = result.rounds.flatMap((round) => round.turns);
 const lastTurn = turns.at(-1);
 const terminationMessage = result.terminationReason === 'turn_limit'
  ? 'Osiągnięto limit tur; to nie dowodzi działania w nieskończoność.'
  : result.noProgressReason === 'empty_sequence'
   ? 'Sekwencja MW jest pusta.'
   : result.noProgressReason === 'all_actions_on_cooldown'
    ? 'Brak postępu: wszystkie akcje są na cooldownie, a pomijanie nie przesuwa czasu.'
    : result.message;

 return {
  ok: true as const,
  schema_version: 1,
  mapping: { snapshot_id: mapping.snapshot_id, data_version: mapping.data_version, source_sha256: mapping.source_sha256 },
  profession, level, repeat, max_turns: maxTurns,
  turns_executed: result.turnsCount,
  termination: {
   code: result.terminationReason,
   message: terminationMessage,
   ...(result.noProgressReason ? { detail: result.noProgressReason } : {}),
   ...(blocked ? { blocked_action: {
    action_id: sequence[blocked.sequenceIndex] as number,
    sequence_index: blocked.sequenceIndex,
    resource: blocked.resource, required: blocked.required, available: blocked.available,
   } } : {}),
  },
  final: {
   mana: lastTurn?.mana.current ?? resources.mana,
   energy: lastTurn?.energy.current ?? resources.energy,
   combination_points: lastTurn?.combinationPoints ?? 0,
  },
  combination_points_cap: result.combinationPointsCap,
  turns: turns.map((turn, index) => ({
   turn: turn.id + 1,
   round: turn.roundId + 1,
   sequence_index: turn.sequenceIndex,
   action_id: sequence[turn.sequenceIndex] as number,
   simulator_ability_id: turn.abilityWithState.id,
   name: turn.abilityWithState.name,
   rank: turn.abilityWithState.points,
   mana: { before: turns[index - 1]?.mana.current ?? resources.mana, cost: Math.round(turn.mana.abilityCost), after: turn.mana.current },
   energy: { before: turns[index - 1]?.energy.current ?? resources.energy, cost: Math.round(turn.energy.abilityCost), after: turn.energy.current },
   combination_points: { before: turns[index - 1]?.combinationPoints ?? 0, after: turn.combinationPoints },
  })),
 };
}
