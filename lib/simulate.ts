import type { AbilityWithState } from '@/types/AbilityWithState';
import type { Basics } from '@/types/Basics';
import type { Round, Simulation, Turn } from '@/types/Simulation';

// Shared by the website and the local CLI. Calculation order matches the original Store engine.
export function simulateMw({
 basics, abilities, sequence, repeat, maxTurns = 1000,
}: {
 basics: Basics;
 abilities: AbilityWithState[];
 sequence: Array<{ abilityId: number }>;
 repeat: boolean;
 maxTurns?: number;
}): Simulation {
 if (!Number.isSafeInteger(maxTurns) || maxTurns <= 0) {
  throw new Error('maxTurns musi być dodatnią bezpieczną liczbą całkowitą.');
 }
 const abilitiesById = new Map(abilities.map((ability) => [ability.id, ability]));
 for (const slot of sequence) {
  const ability = abilitiesById.get(slot.abilityId);
  if (!ability || (ability.id !== 0 && ability.points <= 0)) {
   throw new Error(`Nieznana lub nieprzydzielona akcja symulatora: ${slot.abilityId}.`);
  }
 }
 let terminationReason: Simulation['terminationReason'] = 'sequence_completed';
 let blockedAction: Simulation['blockedAction'];
 let noProgressReason: Simulation['noProgressReason'];
  let shouldLoopRun = true;

  let roundsCounter = 0;
  let turnsCounter = 0;

  const turns: Turn[] = [];
  let message = '';
  let currentMana = basics.mana;
  let currentEnergy = basics.energy;
  const activeEnergyBuffs: {
   sourceAbilityId: number;
   valuePerTurn: number;
   remainingTurns: number;
   isPendingFirstTick: boolean;
  }[] = [];

  // Determine combination points cap based on profession
  let combinationPointsCap = 3;
  if (basics.proffesion === 'warrior') {
   combinationPointsCap = 5;
  } else if (basics.proffesion === 'mage') {
   combinationPointsCap = 4;
  }

  let currentCombinationPoints = 0;

  if (sequence.length === 0) {
   shouldLoopRun = false;
   terminationReason = 'no_progress';
   noProgressReason = 'empty_sequence';
   message = 'Sekwencja MW jest pusta.';
  }

  while (shouldLoopRun) {
   const turnsBeforeRound = turns.length;
   for (const [sequenceIndex, mwSlot] of sequence.entries()) {
    // The limit counts executed actions, not skipped cooldown slots.
    if (turns.length >= maxTurns) {
     shouldLoopRun = false;
     terminationReason = 'turn_limit';
     message = 'Osiągnięto limit tur; to nie dowodzi działania w nieskończoność.';
     break;
    }

    //Get ability
    const abilityWithState = abilitiesById.get(mwSlot.abilityId);

    if (abilityWithState) {
     //Skip performing ability if it is on cooldown and move to the next turn
     let isAbilityOnCooldown = false;

     const cooldown =
      typeof abilityWithState.cooldown === 'number'
       ? abilityWithState.cooldown
       : abilityWithState.cooldown[abilityWithState.points - 1];

     if (cooldown > 0) {
      const turnsToCheckForCooldown = turns.slice(
       turnsCounter - cooldown < 0 ? 0 : turnsCounter - cooldown,
       turnsCounter
      );

      if (turnsToCheckForCooldown.length > 0) {
       for (const turnToCheck of turnsToCheckForCooldown) {
        if (turnToCheck.abilityWithState.id === abilityWithState.id) {
         isAbilityOnCooldown = true;
         break;
        }
       }
      }
     }

     if (isAbilityOnCooldown === false) {
      const manaBefore = currentMana;
      const energyBefore = currentEnergy;
      const combinationPointsBefore = currentCombinationPoints;
      let abilityManaCost = 0;
      let abilityEnergyCost = 0;

      //Dont perform ability if it is default ability (id 0)
      if (abilityWithState.id !== 0) {
       if (abilityWithState.manaCost || abilityWithState.energyCost) {
        //Default mana cost
        abilityManaCost = abilityWithState.manaCost;
        abilityEnergyCost = abilityWithState.energyCost;

        //Double cost if ability was used twice in a row
        if (
         abilityWithState.mana.multiplierForUsingAbilityTwiceInARow &&
         turns.length > 0 &&
         turns[turns.length - 1].abilityWithState.id === abilityWithState.id
        ) {
         abilityManaCost +=
          abilityManaCost *
          abilityWithState.mana.multiplierForUsingAbilityTwiceInARow;
        }

        if (
         abilityWithState.energy.multiplierForUsingAbilityTwiceInARow &&
         turns.length > 0 &&
         turns[turns.length - 1].abilityWithState.id === abilityWithState.id
        ) {
         abilityEnergyCost +=
          abilityEnergyCost *
          abilityWithState.energy.multiplierForUsingAbilityTwiceInARow;
        }

        //Substract mana and energy for ability usage
        if (currentMana - abilityManaCost < 0) {
         shouldLoopRun = false;
         message = `Nie starczyło many na ${abilityWithState.name}.`;
         terminationReason = 'insufficient_resources';
         blockedAction = {
          abilityId: abilityWithState.id, sequenceIndex, resource: 'mana',
          required: abilityManaCost, available: currentMana,
         };
         break;
        } else if (currentEnergy - abilityEnergyCost < 0) {
         shouldLoopRun = false;
         message = `Nie starczyło energii na ${abilityWithState.name}.`;
         terminationReason = 'insufficient_resources';
         blockedAction = {
          abilityId: abilityWithState.id, sequenceIndex, resource: 'energy',
          required: abilityEnergyCost, available: currentEnergy,
         };
         break;
        } else {
         currentMana -= Math.round(abilityManaCost);
         currentEnergy -= Math.round(abilityEnergyCost);
        }
       } else {
        //Retrieve mana
        if (abilityWithState.mana.retrieve) {
         const percentage = abilityWithState.mana.retrieve.percentageGrowth
          ? abilityWithState.mana.retrieve.initialPercentageValue +
            (abilityWithState.points - 1) *
             abilityWithState.mana.retrieve.percentageGrowth
          : abilityWithState.mana.retrieve.initialPercentageValue;

         let manaRetrieved = basics.mana * (percentage / 100);

         if (abilityWithState.mana.retrieve.percentageWeakening) {
          const abilityUsedCount = turns.filter(
           (turn) => turn.abilityWithState.id === abilityWithState.id
          ).length;

          for (let i = 0; i < abilityUsedCount; i++) {
           manaRetrieved =
            manaRetrieved -
            manaRetrieved *
             (abilityWithState.mana.retrieve.percentageWeakening / 100);
          }
         }

         currentMana += Math.round(manaRetrieved);
        }

        //Retrieve energy
        if (abilityWithState.energy.retrieve) {
         const percentage = abilityWithState.energy.retrieve.percentageGrowth
          ? abilityWithState.energy.retrieve.initialPercentageValue +
            (abilityWithState.points - 1) *
             abilityWithState.energy.retrieve.percentageGrowth
          : abilityWithState.energy.retrieve.initialPercentageValue;

         let energyRetrieved = basics.energy * (percentage / 100);

         if (abilityWithState.energy.retrieve.percentageWeakening) {
          const abilityUsedCount = turns.filter(
           (turn) => turn.abilityWithState.id === abilityWithState.id
          ).length;

          for (let i = 0; i < abilityUsedCount; i++) {
           energyRetrieved =
            energyRetrieved -
            energyRetrieved *
             (abilityWithState.energy.retrieve.percentageWeakening / 100);
          }
         }

         currentEnergy += Math.round(energyRetrieved);
        }
       }
      }

      if (
       abilityWithState.id !== 0 &&
       abilityWithState.effects?.energyPerTurn &&
       abilityWithState.points > 0
      ) {
       const energyPerTurnEffect = abilityWithState.effects.energyPerTurn;
       const progressionIndex = Math.min(
        abilityWithState.points - 1,
        energyPerTurnEffect.progression.length - 1
       );

       const valuePerTurn =
        energyPerTurnEffect.progression[progressionIndex] ?? 0;

       for (let i = activeEnergyBuffs.length - 1; i >= 0; i--) {
        if (activeEnergyBuffs[i].sourceAbilityId === abilityWithState.id) {
         activeEnergyBuffs.splice(i, 1);
        }
       }

       if (valuePerTurn > 0 && energyPerTurnEffect.duration > 0) {
        activeEnergyBuffs.push({
         sourceAbilityId: abilityWithState.id,
         valuePerTurn,
         remainingTurns: energyPerTurnEffect.duration,
         isPendingFirstTick: true,
        });
       }
      }

      // Apply cpEffect (combo points effects) before regen and CP reset
      if (
       abilityWithState.id !== 0 &&
       typeof abilityWithState.cpUse === 'number'
      ) {
       const cpEffect = (
        abilityWithState as unknown as {
         cpEffect?: {
          energy?: { percentageRetrieve: number | null };
          mana?: { percentageRetrieve: number | null };
         };
        }
       ).cpEffect;

       if (!cpEffect) {
        // no cpEffect defined for this ability
       } else {
        const cpSpent = Math.min(
         currentCombinationPoints,
         abilityWithState.cpUse
        );

        if (cpSpent > 0) {
         // Energy retrieve based on combo points spent
         if (
          cpEffect.energy &&
          cpEffect.energy.percentageRetrieve !== null &&
          cpEffect.energy.percentageRetrieve !== undefined
         ) {
          const totalPercentage = cpEffect.energy.percentageRetrieve * cpSpent;
          const energyRetrieved = Math.round(
           basics.energy * (totalPercentage / 100)
          );
          currentEnergy += energyRetrieved;
         }

         // Mana retrieve based on combo points spent
         if (
          cpEffect.mana &&
          cpEffect.mana.percentageRetrieve !== null &&
          cpEffect.mana.percentageRetrieve !== undefined
         ) {
          const totalPercentage = cpEffect.mana.percentageRetrieve * cpSpent;
          const manaRetrieved = Math.round(
           basics.mana * (totalPercentage / 100)
          );
          currentMana += manaRetrieved;
         }
        }
       }
      }

      let totalEnergyBuffGain = 0;

      for (const buff of activeEnergyBuffs) {
       if (buff.isPendingFirstTick) {
        buff.isPendingFirstTick = false;
        continue;
       }

       if (buff.remainingTurns > 0) {
        totalEnergyBuffGain += buff.valuePerTurn;
        buff.remainingTurns -= 1;
       }
      }

      for (let i = activeEnergyBuffs.length - 1; i >= 0; i--) {
       if (activeEnergyBuffs[i].remainingTurns <= 0) {
        activeEnergyBuffs.splice(i, 1);
       }
      }

      //Mana and energy regen
      if (currentMana + basics.manaRegen > basics.mana) {
       currentMana = basics.mana;
      } else {
       currentMana += basics.manaRegen;
      }

      const energyGainFromBuffsAndRegen =
       basics.energyRegen + totalEnergyBuffGain;

      if (energyGainFromBuffsAndRegen > 0) {
       const nextEnergy = currentEnergy + energyGainFromBuffsAndRegen;
       currentEnergy =
        nextEnergy > basics.energy ? basics.energy : nextEnergy;
      }

      // Update combination points after ability is used
      if (abilityWithState.id !== 0) {
       if (typeof abilityWithState.cpUse === 'number') {
        currentCombinationPoints = 0;
       } else if (
        typeof abilityWithState.cpAdd === 'number' &&
        abilityWithState.cpAdd > 0
       ) {
        // Ability adds CP - increment by cpAdd up to profession cap
        const next = currentCombinationPoints + abilityWithState.cpAdd;
        currentCombinationPoints =
         next > combinationPointsCap ? combinationPointsCap : next;
       }
      }

      turns.push({
       id: turnsCounter,
       roundId: roundsCounter,
       sequenceIndex,
       combinationPointsBefore,
       abilityWithState,
       mana: {
        before: manaBefore,
        current: currentMana,
        abilityCost: abilityManaCost,
       },
       energy: {
        before: energyBefore,
        current: currentEnergy,
        abilityCost: abilityEnergyCost,
       },
       combinationPoints: currentCombinationPoints,
      });

      turnsCounter++;
     }
    }
   }

   roundsCounter += 1;

   if (shouldLoopRun && repeat === false) {
    shouldLoopRun = false;
   } else if (shouldLoopRun && turns.length >= maxTurns) {
    shouldLoopRun = false;
    terminationReason = 'turn_limit';
    message = 'Osiągnięto limit tur; to nie dowodzi działania w nieskończoność.';
   } else if (shouldLoopRun && turns.length === turnsBeforeRound) {
    shouldLoopRun = false;
    terminationReason = 'no_progress';
    noProgressReason = 'all_actions_on_cooldown';
    message = 'Brak postępu: wszystkie akcje są na cooldownie, a pomijanie nie przesuwa czasu.';
   }
  }

  const rounds: Round[] = [];

  turns.forEach((turn, i) => {
   if (rounds.length === 0) {
    rounds.push({
     id: i,
     turns: [turn],
    });
   } else {
    if (rounds[rounds.length - 1].turns[0].roundId === turn.roundId) {
     rounds[rounds.length - 1].turns.push(turn);
    } else {
     rounds.push({
      id: i,
      turns: [turn],
     });
    }
   }
  });

  return {
   rounds,
   terminationReason,
   blockedAction,
   noProgressReason,
   finalMana: currentMana,
   finalEnergy: currentEnergy,
   finalCombinationPoints: currentCombinationPoints,
   message,
   turnsCount: turns.length,
   combinationPointsCap,
  };
 }
