import { action, makeAutoObservable } from "mobx";
import { nanoid } from "nanoid";
import proffesions from "./data/proffesions";
import { AbilityWithState } from "./types/AbilityWithState";
import { Basics } from "./types/Basics";
import { BasicsFormValues } from "./types/BasicsFormValues";
import { MwSlotType } from "./types/MwSlotType";
import { Simulation, Turn } from "./types/Simulation";

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

  abilitiesWithState: AbilityWithState[] | null = null;

  mw: MwSlotType[] = [];
  mwTotalGold = 0;
  mwTotalCurrency = 0;
  isMwSimulationInfinite = false;

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
    if (this.basicsFormValues.proffesion !== formValues.proffesion) {
      const proffesion = proffesions.find(
        (proffesion) => proffesion.value === formValues.proffesion
      );

      if (proffesion) {
        this.abilitiesWithState = proffesion.abilities.map((ability) => ({
          ...ability,
          points: 0,
          mana: 0,
          energy: 0,
        }));
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
        if (
          (shouldIncrease === false &&
            this.abilitiesWithState[indexOfAbility].points > 0) ||
          (shouldIncrease === true &&
            this.abilitiesWithState[indexOfAbility].points < 10)
        ) {
          const newPoints = shouldIncrease
            ? this.abilitiesWithState[indexOfAbility].points + 1
            : this.abilitiesWithState[indexOfAbility].points - 1;

          const newMana =
            newPoints === 0
              ? 0
              : newPoints === 1
              ? this.abilitiesWithState[indexOfAbility].initialManaCost
              : this.abilitiesWithState[indexOfAbility].initialManaCost +
                (newPoints - 1) *
                  this.abilitiesWithState[indexOfAbility].manaGrowth;

          const newEnergy =
            newPoints === 0
              ? 0
              : newPoints === 1
              ? this.abilitiesWithState[indexOfAbility].initialEnergyCost
              : this.abilitiesWithState[indexOfAbility].initialEnergyCost +
                (newPoints - 1) *
                  this.abilitiesWithState[indexOfAbility].energyGrowth;

          this.abilitiesWithState[indexOfAbility] = {
            ...this.abilitiesWithState[indexOfAbility],
            points: newPoints,
            mana: newMana,
            energy: newEnergy,
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

    this.mw.push({
      id: nanoid(),
      abilityId: 0,
    });
  }

  removeMwSlot(id: string) {
    //TODO odejmowanie kasy
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

    let turns: Turn[] = [];
    let message = "";

    let currentMana = this.basics.mana;
    let currentEnergy = this.basics.energy;

    while (shouldLoopRun) {
      for (const mwSlot of this.mw) {
        const abilityWithState = this.abilitiesWithState?.find(
          (abilityWithState) => abilityWithState.id === mwSlot.abilityId
        );

        //Perform ability
        if (abilityWithState) {
          if (currentMana - abilityWithState.mana < 0) {
            shouldLoopRun = false;
            message = `Nie starczyło many na ${abilityWithState.name}.`;
            break;
          } else if (currentEnergy - abilityWithState.energy < 0) {
            shouldLoopRun = false;
            message = `Nie starczyło energii na ${abilityWithState.name}.`;
            break;
          } else {
            currentMana -= abilityWithState.mana;
            currentEnergy -= abilityWithState.energy;
          }
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
          abilityName: abilityWithState ? abilityWithState.name : "Zwykły atak",
          currentMana,
          currentEnergy,
        });
      }

      if (this.isMwSimulationInfinite === false) {
        shouldLoopRun = false;
      }
    }

    this.simulation = {
      turns,
      message,
    };
  }
}

const store = new Store();

export default store;
