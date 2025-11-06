import proffesions from '@/data/proffesions';
import type { Store } from '@/lib/Store';

export const SHARE_VERSION = 1;

export type ShareBasics = {
 level: number;
 mana: number;
 energy: number;
 manaRegen: number;
 energyRegen: number;
};

export type ShareAbilityEntry = [abilityId: number, points: number];

export type DecodedShareState = {
 version: number;
 pIndex: number;
 basics: ShareBasics;
 abilityPoints: ShareAbilityEntry[];
 mw: number[];
};

const isIntegerLike = (value: string) => /^-?\d+$/.test(value);

const parseInteger = (value: string): number | null => {
 if (!isIntegerLike(value)) {
  return null;
 }

 const parsed = Number.parseInt(value, 10);

 if (!Number.isSafeInteger(parsed)) {
  return null;
 }

 return parsed;
};

const joinAbilityEntries = (entries: ShareAbilityEntry[]) =>
 entries
  .map(([abilityId, points]) => `${abilityId}_${points}`)
  .join('.');

const joinNumberList = (values: number[]) => values.join('.');

export const encodeShareState = (store: Store): string | null => {
 const pIndex = proffesions.findIndex(
  (proffesion) => proffesion.value === store.basics.proffesion
 );

 if (pIndex < 0) {
  return null;
 }

 const basicsSegments = [
  store.basics.level,
  store.basics.mana,
  store.basics.energy,
  store.basics.manaRegen,
  store.basics.energyRegen,
 ].map((value) => {
  if (!Number.isFinite(value) || value < 0) {
   return 0;
  }

  return Math.round(value);
 });

 const abilityEntries: ShareAbilityEntry[] = store.abilitiesWithState
  .filter((ability) => ability.points > 0)
  .map((ability) => [ability.id, ability.points]);

 const mwEntries = store.mw.map((slot) => slot.abilityId);

 const basicsSection = basicsSegments.join('.');
 const abilitiesSection = joinAbilityEntries(abilityEntries);
 const mwSection = joinNumberList(mwEntries);

 const sections = [
  SHARE_VERSION,
  pIndex,
  basicsSection,
  abilitiesSection,
  mwSection,
 ];

 return sections.join('~');
};

export const decodeShareState = (value: string): DecodedShareState | null => {
 if (!value) {
  return null;
 }

 const sections = value.split('~');

 if (sections.length !== 5) {
  return null;
 }

 const [versionRaw, pIndexRaw, basicsRaw, abilityRaw, mwRaw] = sections;

 const version = parseInteger(versionRaw);
 if (version === null || version !== SHARE_VERSION) {
  return null;
 }

 const pIndex = parseInteger(pIndexRaw);
 if (pIndex === null || pIndex < 0 || pIndex >= proffesions.length) {
  return null;
 }

 const basicsParts = basicsRaw.split('.');
 if (basicsParts.length !== 5) {
  return null;
 }

 const basicsNumbers = basicsParts.map(parseInteger);
 if (basicsNumbers.some((part) => part === null || part < 0)) {
  return null;
 }

 const [level, mana, energy, manaRegen, energyRegen] = basicsNumbers as number[];

 const abilityPoints: ShareAbilityEntry[] = [];

 if (abilityRaw.length > 0) {
  const abilitySegments = abilityRaw.split('.');
  for (const segment of abilitySegments) {
   if (!segment) continue;
   const [abilityIdRaw, pointsRaw] = segment.split('_');
   const abilityId = parseInteger(abilityIdRaw ?? '');
   const points = parseInteger(pointsRaw ?? '');

   if (
    abilityId === null ||
    points === null ||
    abilityId < 0 ||
    points <= 0
   ) {
    return null;
   }

   abilityPoints.push([abilityId, points]);
  }
 }

 const mw: number[] = [];

 if (mwRaw.length > 0) {
  const mwSegments = mwRaw.split('.');
  for (const segment of mwSegments) {
   if (!segment) continue;
   const abilityId = parseInteger(segment);
   if (abilityId === null || abilityId < 0) {
    return null;
   }
   mw.push(abilityId);
  }
 }

 return {
  version,
  pIndex,
  basics: {
   level,
   mana,
   energy,
   manaRegen,
   energyRegen,
  },
  abilityPoints,
  mw,
 };
};

