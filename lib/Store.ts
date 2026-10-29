import { action, makeAutoObservable } from 'mobx';
import { computedFn } from 'mobx-utils';
import { nanoid } from 'nanoid';
import defaultAbility from '@/data/defaultAbility';
import proffesions from '@/data/proffesions';
import { AbilityWithState } from '@/types/AbilityWithState';
import { Basics } from '@/types/Basics';
import { BasicsFormValues } from '@/types/BasicsFormValues';
import { MwSlotType } from '@/types/MwSlotType';
import type { Simulation } from '@/types/Simulation';
import { simulateMw } from '@/lib/simulate';
import type { DecodedShareState } from '@/utils/share';

export class Store {
 basicsFormValues: BasicsFormValues = {
  level: '',
  mana: '',
  energy: '',
  manaRegen: '',
  energyRegen: '',
  proffesion: '',
 };

 basics: Basics = {
  level: 0,
  mana: 0,
  energy: 0,
  manaRegen: 0,
  energyRegen: 0,
  proffesion: '',
 };

 abilitiesWithState: AbilityWithState[] = [defaultAbility];

 mw: MwSlotType[] = [];
 mwTotalGold = 0;
 mwTotalCurrency = 0;
 mwSpentGoldAndCurrencyHistory: { gold: number; currency: number }[] = [];
 isMwSimulationInfinite = true;

 isMwSimulationModalOpen = false;
 simulation: Simulation | null = null;

 constructor(initial?: DecodedShareState) {
  makeAutoObservable(this, {
   saveBasics: action.bound,
   changeAbilityPoints: action.bound,
   addMwSlot: action.bound,
   removeMwSlot: action.bound,
   changeMwSlotOrder: action.bound,
   changeMwSlotAbility: action.bound,
   openMwSimulationModal: action.bound,
   closeMwSimulationModal: action.bound,
   changeMwInfinite: action.bound,
   generateMwSimulation: action.bound,
   setAbilityPointsBulk: action.bound,
   setMwFromAbilityIds: action.bound,
   hydrateFromShare: action.bound,
  });

  if (initial) {
   this.hydrateFromShare(initial);
  }
 }

 get activeAbilities() {
  return this.abilitiesWithState
   ? this.abilitiesWithState.filter(
      (abilityWithState) => abilityWithState.points > 0
     )
   : [];
 }

 get isAtLeastOneMwSlot() {
  return this.mw.length > 0;
 }

 get cooldownByAbilityId() {
  const map = new Map<number, number>();
  for (const ability of this.activeAbilities) {
   const cooldown =
    typeof ability.cooldown === 'number'
     ? ability.cooldown
     : ability.cooldown[ability.points - 1];
   map.set(ability.id, cooldown || 0);
  }
  return map;
 }

 get positionsByAbilityId() {
  const map = new Map<number, number[]>();
  this.mw.forEach((slot, i) => {
   if (!map.has(slot.abilityId)) {
    map.set(slot.abilityId, []);
   }
   map.get(slot.abilityId)!.push(i);
  });
  return map;
 }

 private calculateManaCost(ability: AbilityWithState, newPoints: number) {
  if (ability.mana.costMultipliersBySkillLevel) {
   return newPoints === 0
    ? 0
    : Math.round(
       this.basics.level * ability.mana.costMultipliersBySkillLevel[newPoints - 1]
      );
  }

  let newManaCost = 0;

  if (ability.mana.initialCost !== null) {
   if (newPoints === 0) {
    newManaCost = 0;
   } else if (newPoints === 1) {
    newManaCost = ability.mana.initialCost;
   } else if (ability.mana.growth !== null) {
    if (typeof ability.mana.growth === 'number') {
     newManaCost = !ability.mana.growthDown
      ? ability.mana.initialCost + (newPoints - 1) * ability.mana.growth
      : ability.mana.initialCost - (newPoints - 1) * ability.mana.growth;
    } else {
     newManaCost = !ability.mana.growthDown
      ? ability.mana.initialCost +
        ability.mana.growth
         .slice(0, newPoints - 1)
         .reduce((prev, curr) => prev + curr)
      : ability.mana.initialCost +
        ability.mana.growth
         .slice(0, newPoints - 1)
         .reduce((prev, curr) => prev + curr);
    }
   }
  } else if (
   ability.mana.multiplierForInitialCostBasedOnLevel &&
   ability.mana.multiplierForGrowthCostBasedOnLevel !== null
  ) {
   if (newPoints === 0) {
    newManaCost = 0;
   } else if (newPoints === 1) {
    newManaCost = Math.round(
     this.basics.level * ability.mana.multiplierForInitialCostBasedOnLevel
    );
   } else {
    const initialManaCost =
     this.basics.level * ability.mana.multiplierForInitialCostBasedOnLevel;

    newManaCost = Math.round(
     !ability.mana.growthDown
      ? initialManaCost +
         (newPoints - 1) *
          (this.basics.level * ability.mana.multiplierForGrowthCostBasedOnLevel)
      : initialManaCost -
         (newPoints - 1) *
          (this.basics.level * ability.mana.multiplierForGrowthCostBasedOnLevel)
    );
   }
  }

  return newManaCost;
 }

 private calculateEnergyCost(ability: AbilityWithState, newPoints: number) {
  if (ability.energy.costMultipliersBySkillLevel) {
   return newPoints === 0
    ? 0
    : Math.round(
       this.basics.level * ability.energy.costMultipliersBySkillLevel[newPoints - 1]
      );
  }

  let newEnergyCost = 0;

  if (ability.energy.initialCost !== null) {
   if (newPoints === 0) {
    newEnergyCost = 0;
   } else if (newPoints === 1) {
    newEnergyCost = ability.energy.initialCost;
   } else if (ability.energy.growth !== null) {
    if (typeof ability.energy.growth === 'number') {
     newEnergyCost = !ability.energy.growthDown
      ? ability.energy.initialCost + (newPoints - 1) * ability.energy.growth
      : ability.energy.initialCost - (newPoints - 1) * ability.energy.growth;
    } else {
     newEnergyCost = !ability.energy.growthDown
      ? ability.energy.initialCost +
        ability.energy.growth
         .slice(0, newPoints - 1)
         .reduce((prev, curr) => prev + curr)
      : ability.energy.initialCost +
        ability.energy.growth
         .slice(0, newPoints - 1)
         .reduce((prev, curr) => prev + curr);
    }
   }
  } else if (
   ability.energy.multiplierForInitialCostBasedOnLevel &&
   ability.energy.multiplierForGrowthCostBasedOnLevel !== null
  ) {
   if (newPoints === 0) {
    newEnergyCost = 0;
   } else if (newPoints === 1) {
    newEnergyCost = Math.round(
     this.basics.level * ability.energy.multiplierForInitialCostBasedOnLevel
    );
   } else {
    const initialEnergyCost =
     this.basics.level * ability.energy.multiplierForInitialCostBasedOnLevel;

    newEnergyCost = Math.round(
     !ability.energy.growthDown
      ? initialEnergyCost +
         (newPoints - 1) *
          (this.basics.level *
           ability.energy.multiplierForGrowthCostBasedOnLevel)
      : initialEnergyCost -
         (newPoints - 1) *
          (this.basics.level *
           ability.energy.multiplierForGrowthCostBasedOnLevel)
    );
   }
  }

  return newEnergyCost;
 }

 isAbilityDisabledAtSlot = computedFn(
  (slotIndex: number, abilityId: number): boolean => {
   const cooldown = this.cooldownByAbilityId.get(abilityId) ?? 0;
   if (cooldown <= 0) return false;

   const positions = this.positionsByAbilityId.get(abilityId);
   if (!positions || positions.length === 0) return false;

   // Binary search for the last position < slotIndex
   let lo = 0;
   let hi = positions.length - 1;
   let last = -1;

   while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (positions[mid] < slotIndex) {
     last = positions[mid];
     lo = mid + 1;
    } else {
     hi = mid - 1;
    }
   }

   if (last === -1) return false;
   return slotIndex - last <= cooldown;
  }
 );

 saveBasics(formValues: BasicsFormValues) {
  if (
   this.basicsFormValues.proffesion !== formValues.proffesion ||
   this.basicsFormValues.level !== formValues.level
  ) {
   const proffesion = proffesions.find(
    (proffesion) => proffesion.value === formValues.proffesion
   );

   if (proffesion) {
    this.abilitiesWithState = [
     defaultAbility,
     ...proffesion.abilities
      .filter((ability) => parseInt(formValues.level) >= ability.minLevel)
      .map((ability) => ({
       ...ability,
       points: 0,
       manaCost: 0,
       energyCost: 0,
      })),
    ];
   }
  }

  this.basicsFormValues = {
   ...formValues,
  };

  this.basics = {
   level: parseInt(formValues.level),
   mana: parseInt(formValues.mana),
   energy: parseInt(formValues.energy),
   manaRegen: parseInt(formValues.manaRegen),
   energyRegen: parseInt(formValues.energyRegen),
   proffesion: formValues.proffesion,
  };
 }

 clearBasics() {
  this.basicsFormValues = {
   level: '',
   mana: '',
   energy: '',
   manaRegen: '',
   energyRegen: '',
   proffesion: 'trailer',
  };

  this.basics = {
   level: 0,
   mana: 0,
   energy: 0,
   manaRegen: 0,
   energyRegen: 0,
   proffesion: 'trailer',
  };
 }

 changeAbilityPoints(
  shouldIncrease: boolean,
  id: number,
  shouldSetExtremumPoints: boolean
 ) {
  if (!this.abilitiesWithState) return;

  const indexOfAbility = this.abilitiesWithState.findIndex(
   (abilityWithState) => abilityWithState.id === id
  );

  if (indexOfAbility === -1 || indexOfAbility === undefined) return;

  const ability = {
   ...this.abilitiesWithState[indexOfAbility],
  };

  if (
   (shouldIncrease === false &&
    this.abilitiesWithState[indexOfAbility].points > 0) ||
   (shouldIncrease === true &&
    this.abilitiesWithState[indexOfAbility].points < 10)
  ) {
   let newPoints: number;

   if (shouldIncrease) {
    if (shouldSetExtremumPoints) {
     newPoints = 10;
    } else {
     newPoints = this.abilitiesWithState[indexOfAbility].points + 1;
    }
   } else {
    if (shouldSetExtremumPoints) {
     newPoints = 0;
    } else {
     newPoints = this.abilitiesWithState[indexOfAbility].points - 1;
    }
   }

   const newManaCost = this.calculateManaCost(ability, newPoints);
   const newEnergyCost = this.calculateEnergyCost(ability, newPoints);

   this.abilitiesWithState[indexOfAbility] = {
    ...this.abilitiesWithState[indexOfAbility],
    points: newPoints,
    manaCost: newManaCost,
    energyCost: newEnergyCost,
   };

   if (newPoints === 0) {
    this.exchangeNonActiveAbilityFromMw(id);
   }
  }
 }

 setAbilityPointsBulk(entries: Array<[number, number]>) {
  const pointsMap = new Map<number, number>(entries);

  const zeroedAbilityIds: number[] = [];

  this.abilitiesWithState = this.abilitiesWithState.map((ability) => {
   const targetPoints = pointsMap.get(ability.id) ?? 0;
   const manaCost = this.calculateManaCost(ability, targetPoints);
   const energyCost = this.calculateEnergyCost(ability, targetPoints);

   if (ability.id !== 0 && ability.points > 0 && targetPoints === 0) {
    zeroedAbilityIds.push(ability.id);
   }

   return {
    ...ability,
    points: targetPoints,
    manaCost,
    energyCost,
   };
  });

  zeroedAbilityIds.forEach((abilityId) =>
   this.exchangeNonActiveAbilityFromMw(abilityId)
  );
 }

 setMwFromAbilityIds(ids: number[]) {
  const idsTyped = ids as number[];
  const normalizedIds = idsTyped.map((abilityId) => {
   if (abilityId === 0) {
    return 0;
   }

   const ability = this.abilitiesWithState?.find(
    (abilityWithState) => abilityWithState.id === abilityId
   );

   if (!ability || ability.points <= 0) {
    return 0;
   }

   return abilityId;
  });

  this.mw = normalizedIds.map((abilityId) => ({
   id: nanoid(),
   abilityId,
  }));

  this.mwTotalGold = 0;
  this.mwTotalCurrency = 0;
  this.mwSpentGoldAndCurrencyHistory = normalizedIds.map(() => ({
   gold: 0,
   currency: 0,
  }));
 }

 hydrateFromShare(payload: DecodedShareState) {
  const decoded = payload as DecodedShareState;
  const proffesion = proffesions[decoded.pIndex];
  if (!proffesion) {
   return;
  }

  const basicsFormValues: BasicsFormValues = {
   level: String(decoded.basics.level),
   mana: String(decoded.basics.mana),
   energy: String(decoded.basics.energy),
   manaRegen: String(decoded.basics.manaRegen),
   energyRegen: String(decoded.basics.energyRegen),
   proffesion: proffesion.value,
  };

  this.saveBasics(basicsFormValues);
  this.setAbilityPointsBulk(decoded.abilityPoints);
  this.setMwFromAbilityIds(decoded.mw);
  this.isMwSimulationModalOpen = false;
  this.simulation = null;
 }

 addMwSlot({ gold, currency }: { gold?: number; currency?: number }) {
  if (gold) {
   this.mwTotalGold += gold;
  }

  if (currency) {
   this.mwTotalCurrency += currency;
  }

  this.mwSpentGoldAndCurrencyHistory.push({
   gold: gold || 0,
   currency: currency || 0,
  });

  this.mw.push({
   id: nanoid(),
   abilityId: 0,
  });
 }

 removeMwSlot(id: string) {
  //Substract spent money and currency
  if (
   this.mwSpentGoldAndCurrencyHistory[
    this.mwSpentGoldAndCurrencyHistory.length - 1
   ].gold
  ) {
   this.mwTotalGold -=
    this.mwSpentGoldAndCurrencyHistory[
     this.mwSpentGoldAndCurrencyHistory.length - 1
    ].gold;
  } else {
   this.mwTotalCurrency -=
    this.mwSpentGoldAndCurrencyHistory[
     this.mwSpentGoldAndCurrencyHistory.length - 1
    ].currency;
  }

  this.mwSpentGoldAndCurrencyHistory.pop();

  //Remove mw slot
  const index = this.mw.findIndex((mw) => mw.id === id);
  if (index !== -1) {
   this.mw.splice(index, 1);
  }
 }

 changeMwSlotAbility(id: string, abilityId: number) {
  const index = this.mw.findIndex((mwItem) => mwItem.id === id);
  if (index !== -1) {
   this.mw[index].abilityId = abilityId;
  }
 }

 changeMwSlotOrder(id: string, direction: 'up' | 'down') {
  const mwSlotIndex = this.mw.findIndex((mwSlot) => mwSlot.id === id);

  if (mwSlotIndex !== -1) {
   const temporaryMwSlotIndex =
    direction === 'up' ? mwSlotIndex - 1 : mwSlotIndex + 1;

   const temporaryMwSlot = {
    ...this.mw[temporaryMwSlotIndex],
   };

   this.mw[temporaryMwSlotIndex] = this.mw[mwSlotIndex];
   this.mw[mwSlotIndex] = temporaryMwSlot;
  }
 }

 exchangeNonActiveAbilityFromMw(abilityId: number) {
  for (let i = 0; i < this.mw.length; i++) {
   if (this.mw[i].abilityId === abilityId) {
    this.mw[i].abilityId = 0;
   }
  }
 }

 changeMwInfinite() {
  this.isMwSimulationInfinite = !this.isMwSimulationInfinite;
 }

 openMwSimulationModal() {
  this.isMwSimulationModalOpen = true;
  this.generateMwSimulation();
 }

 closeMwSimulationModal() {
  this.isMwSimulationModalOpen = false;
 }

 generateMwSimulation(maxTurns = 1000) {
  this.simulation = simulateMw({
   basics: this.basics,
   abilities: this.abilitiesWithState,
   sequence: this.mw,
   repeat: this.isMwSimulationInfinite,
   maxTurns,
  });
 }

}

export function createStore(initialState?: DecodedShareState) {
 return new Store(initialState);
}
