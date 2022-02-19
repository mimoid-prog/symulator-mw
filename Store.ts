import { action, makeAutoObservable } from "mobx";
import { nanoid } from "nanoid";
import defaultAbility from "./data/defaultAbility";
import proffesions from "./data/proffesions";
import { AbilityWithState } from "./types/AbilityWithState";
import { Basics } from "./types/Basics";
import { BasicsFormValues } from "./types/BasicsFormValues";
import { MwSlotType } from "./types/MwSlotType";
import { Round, Simulation, Turn } from "./types/Simulation";
import { COMBINATION_POINTS_MAX } from "./utils/constants";

export class Store {
  basicsFormValues: BasicsFormValues = {
    level: "",
    mana: "",
    energy: "",
    manaRegen: "",
    energyRegen: "",
    proffesion: "",
  };

  basics: Basics = {
    level: 0,
    mana: 0,
    energy: 0,
    manaRegen: 0,
    energyRegen: 0,
    proffesion: "",
  };

  abilitiesWithState: AbilityWithState[] = [defaultAbility];

  mw: MwSlotType[] = [];
  mwTotalGold = 0;
  mwTotalCurrency = 0;
  mwSpentGoldAndCurrencyHistory: { gold: number; currency: number }[] = [];
  isMwSimulationInfinite = true;

  isMwSimulationModalOpen = false;
  simulation: Simulation | null = null;

  constructor() {
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
    });
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
      level: "",
      mana: "",
      energy: "",
      manaRegen: "",
      energyRegen: "",
      proffesion: "trailer",
    };

    this.basics = {
      level: 0,
      mana: 0,
      energy: 0,
      manaRegen: 0,
      energyRegen: 0,
      proffesion: "trailer",
    };
  }

  changeAbilityPoints(shouldIncrease: boolean, id: number) {
    if (this.abilitiesWithState) {
      const indexOfAbility = this.abilitiesWithState.findIndex(
        (abilityWithState) => abilityWithState.id === id
      );

      if (indexOfAbility !== -1 && indexOfAbility !== undefined) {
        const ability = {
          ...this.abilitiesWithState[indexOfAbility],
        };

        if (
          (shouldIncrease === false &&
            this.abilitiesWithState[indexOfAbility].points > 0) ||
          (shouldIncrease === true &&
            this.abilitiesWithState[indexOfAbility].points < 10)
        ) {
          const newPoints = shouldIncrease
            ? this.abilitiesWithState[indexOfAbility].points + 1
            : this.abilitiesWithState[indexOfAbility].points - 1;

          let newManaCost = 0;

          if (ability.mana.initialCost !== null) {
            ability.mana.initialCost + 4;
            if (newPoints === 0) {
              newManaCost = 0;
            } else if (newPoints === 1) {
              newManaCost = ability.mana.initialCost;
            } else {
              if (ability.mana.growth !== null) {
                if (typeof ability.mana.growth === "number") {
                  newManaCost = !ability.mana.growthDown
                    ? ability.mana.initialCost +
                      (newPoints - 1) * ability.mana.growth
                    : ability.mana.initialCost -
                      (newPoints - 1) * ability.mana.growth;
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
            }
          } else if (
            ability.mana.multiplierForInitialCostBasedOnLevel &&
            ability.mana.multiplierForGrowthCostBasedOnLevel !== null
          ) {
            if (newPoints === 0) {
              newManaCost = 0;
            } else if (newPoints === 1) {
              newManaCost = Math.round(
                this.basics.level *
                  ability.mana.multiplierForInitialCostBasedOnLevel
              );
            } else {
              const initialManaCost =
                this.basics.level *
                ability.mana.multiplierForInitialCostBasedOnLevel;

              newManaCost = Math.round(
                !ability.mana.growthDown
                  ? initialManaCost +
                      (newPoints - 1) *
                        (this.basics.level *
                          ability.mana.multiplierForGrowthCostBasedOnLevel)
                  : initialManaCost -
                      (newPoints - 1) *
                        (this.basics.level *
                          ability.mana.multiplierForGrowthCostBasedOnLevel)
              );
            }
          }

          let newEnergyCost = 0;

          if (ability.energy.initialCost !== null) {
            ability.energy.initialCost + 4;
            if (newPoints === 0) {
              newEnergyCost = 0;
            } else if (newPoints === 1) {
              newEnergyCost = ability.energy.initialCost;
            } else {
              if (ability.energy.growth !== null) {
                if (typeof ability.energy.growth === "number") {
                  newEnergyCost = !ability.energy.growthDown
                    ? ability.energy.initialCost +
                      (newPoints - 1) * ability.energy.growth
                    : ability.energy.initialCost -
                      (newPoints - 1) * ability.energy.growth;
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
            }
          } else if (
            ability.energy.multiplierForInitialCostBasedOnLevel &&
            ability.energy.multiplierForGrowthCostBasedOnLevel !== null
          ) {
            if (newPoints === 0) {
              newEnergyCost = 0;
            } else if (newPoints === 1) {
              newEnergyCost = Math.round(
                this.basics.level *
                  ability.energy.multiplierForInitialCostBasedOnLevel
              );
            } else {
              const initialEnergyCost =
                this.basics.level *
                ability.energy.multiplierForInitialCostBasedOnLevel;

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
    }
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
    this.mw = this.mw.filter((mw) => mw.id !== id);
  }

  changeMwSlotAbility(id: string, abilityId: number) {
    this.mw = this.mw.map((mwItem) =>
      mwItem.id === id
        ? {
            ...mwItem,
            abilityId,
          }
        : mwItem
    );
  }

  changeMwSlotOrder(id: string, direction: "up" | "down") {
    const mwSlotIndex = this.mw.findIndex((mwSlot) => mwSlot.id === id);

    if (mwSlotIndex !== -1) {
      const temporaryMwSlotIndex =
        direction === "up" ? mwSlotIndex - 1 : mwSlotIndex + 1;

      const temporaryMwSlot = {
        ...this.mw[temporaryMwSlotIndex],
      };

      this.mw[temporaryMwSlotIndex] = this.mw[mwSlotIndex];
      this.mw[mwSlotIndex] = temporaryMwSlot;
    }
  }

  exchangeNonActiveAbilityFromMw(abilityId: number) {
    this.mw = this.mw.map((mwItem) =>
      mwItem.abilityId === abilityId
        ? {
            ...mwItem,
            abilityId: 0,
          }
        : mwItem
    );
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

  generateMwSimulation() {
    let shouldLoopRun = true;

    let roundsCounter = 0;
    let turnsCounter = 0;

    let turns: Turn[] = [];
    let message = "";
    let currentMana = this.basics.mana;
    let currentEnergy = this.basics.energy;
    let combinationPoints = 0;

    while (shouldLoopRun) {
      for (const mwSlot of this.mw) {
        //Finish loop if more than 1000 turns
        if (turns.length >= 1000) {
          shouldLoopRun = false;
          break;
        }

        //Get ability
        const abilityWithState = this.abilitiesWithState?.find(
          (abilityWithState) => abilityWithState.id === mwSlot.abilityId
        );

        if (abilityWithState) {
          //Skip performing ability if it is on cooldown and move to the next turn
          let isAbilityOnCooldown = false;

          if (abilityWithState.cooldown) {
            const turnsToCheckForCooldown = turns.slice(
              turnsCounter - abilityWithState.cooldown < 0
                ? 0
                : turnsCounter - abilityWithState.cooldown,
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
                  turns[turns.length - 1].abilityWithState.id ===
                    abilityWithState.id
                ) {
                  abilityManaCost +=
                    abilityManaCost *
                    abilityWithState.mana.multiplierForUsingAbilityTwiceInARow;
                }

                if (
                  abilityWithState.energy
                    .multiplierForUsingAbilityTwiceInARow &&
                  turns.length > 0 &&
                  turns[turns.length - 1].abilityWithState.id ===
                    abilityWithState.id
                ) {
                  abilityEnergyCost +=
                    abilityEnergyCost *
                    abilityWithState.energy
                      .multiplierForUsingAbilityTwiceInARow;
                }

                //Substract mana and energy for ability usage
                if (currentMana - abilityManaCost < 0) {
                  shouldLoopRun = false;
                  message = `Nie starczyło many na ${abilityWithState.name}.`;
                  break;
                } else if (currentEnergy - abilityEnergyCost < 0) {
                  shouldLoopRun = false;
                  message = `Nie starczyło energii na ${abilityWithState.name}.`;
                  break;
                } else {
                  currentMana -= Math.round(abilityManaCost);
                  currentEnergy -= Math.round(abilityEnergyCost);
                }
              } else {
                //Retrieve mana
                if (abilityWithState.mana.retrieve) {
                  const percentage = abilityWithState.mana.retrieve
                    .percentageGrowth
                    ? abilityWithState.mana.retrieve.initialPercentageValue +
                      (abilityWithState.points - 1) *
                        abilityWithState.mana.retrieve.percentageGrowth
                    : abilityWithState.mana.retrieve.initialPercentageValue;

                  let manaRetrieved = this.basics.mana * (percentage / 100);

                  if (abilityWithState.mana.retrieve.percentageWeakening) {
                    const abilityUsedCount = turns.filter(
                      (turn) => turn.abilityWithState.id === abilityWithState.id
                    ).length;

                    for (let i = 0; i < abilityUsedCount; i++) {
                      manaRetrieved =
                        manaRetrieved -
                        manaRetrieved *
                          (abilityWithState.mana.retrieve.percentageWeakening /
                            100);
                    }
                  }

                  currentMana += Math.round(manaRetrieved);
                }

                //Retrieve energy
                if (abilityWithState.energy.retrieve) {
                  const percentage = abilityWithState.energy.retrieve
                    .percentageGrowth
                    ? abilityWithState.energy.retrieve.initialPercentageValue +
                      (abilityWithState.points - 1) *
                        abilityWithState.energy.retrieve.percentageGrowth
                    : abilityWithState.energy.retrieve.initialPercentageValue;

                  let energyRetrieved = this.basics.energy * (percentage / 100);

                  if (abilityWithState.energy.retrieve.percentageWeakening) {
                    const abilityUsedCount = turns.filter(
                      (turn) => turn.abilityWithState.id === abilityWithState.id
                    ).length;

                    for (let i = 0; i < abilityUsedCount; i++) {
                      energyRetrieved =
                        energyRetrieved -
                        energyRetrieved *
                          (abilityWithState.energy.retrieve
                            .percentageWeakening /
                            100);
                    }
                  }

                  currentEnergy += Math.round(energyRetrieved);
                }
              }
            }

            //Combination points gain
            if (
              combinationPoints < COMBINATION_POINTS_MAX &&
              abilityWithState?.combinationPoints?.gain !== undefined
            ) {
              combinationPoints += abilityWithState.combinationPoints.gain;
            }

            //Combination points usage
            if (abilityWithState?.combinationPoints?.usage !== undefined) {
              if (abilityWithState.combinationPoints.energyRetrievePercentage) {
                //
              }

              const newCombinationPoints =
                combinationPoints - abilityWithState.combinationPoints.usage;

              combinationPoints =
                newCombinationPoints < 0 ? 0 : newCombinationPoints;
            }

            //Mana and energy regen
            if (currentMana + this.basics.manaRegen > this.basics.mana) {
              currentMana = this.basics.mana;
            } else {
              currentMana += this.basics.manaRegen;
            }
            if (currentEnergy + this.basics.energyRegen > this.basics.energy) {
              currentEnergy = this.basics.energy;
            } else {
              currentEnergy += this.basics.energyRegen;
            }

            turns.push({
              id: turnsCounter,
              roundId: roundsCounter,
              abilityWithState,
              mana: {
                current: currentMana,
                abilityCost: abilityManaCost,
              },
              energy: {
                current: currentEnergy,
                abilityCost: abilityEnergyCost,
              },
              combinationPoints,
            });

            turnsCounter++;
          }
        }
      }

      roundsCounter += 1;

      if (this.isMwSimulationInfinite === false) {
        shouldLoopRun = false;
      }
    }

    let rounds: Round[] = [];

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

    this.simulation = {
      rounds,
      message,
      turnsCount: turns.length,
    };
  }
}

const store = new Store();

export default store;
