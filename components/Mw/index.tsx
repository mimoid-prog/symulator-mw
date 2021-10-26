import { Box, Checkbox } from "@chakra-ui/react";
import { Heading, Stack } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { MwSlotType } from "../../types/MwSlotType";
import MwSlot from "./MwSlot";
import MwSlotToBuy from "./MwSlotToBuy";
import { AbilityWithState } from "../../types/AbilityWithState";

const allMwSlotsToBuy = [
  {
    gold: 250000,
    currency: 25,
  },
  {
    gold: 500000,
    currency: 50,
  },
  {
    gold: 1000000,
    currency: 75,
  },
  {
    gold: 2000000,
    currency: 100,
  },
  {
    gold: 3000000,
    currency: 125,
  },
  ...Array.from(Array(15)).map((x) => ({
    gold: 5000000,
    currency: 150,
  })),
];

export type Props = {
  mw: MwSlotType[];
  addMwSlot: (arg: { gold?: number; currency?: number }) => void;
  activeAbilities: AbilityWithState[];
  removeMwSlot: (id: string) => void;
  changeMwSlotAbility: (id: string, abilityId: number) => void;
  changeMwSlotOrder: (id: string, direction: "up" | "down") => void;
  isMwSimulationInfinite: boolean;
  changeMwInfinite: () => void;
};

const Mw = observer(
  ({
    mw,
    addMwSlot,
    activeAbilities,
    removeMwSlot,
    changeMwSlotAbility,
    changeMwSlotOrder,
    isMwSimulationInfinite,
    changeMwInfinite,
  }: Props) => {
    const mwSlotsToBuy = allMwSlotsToBuy.slice(mw.length);

    return (
      <Box>
        <Box display="flex" justifyContent="space-between">
          <Heading size="md">Mistrzostwo walk:</Heading>
          <Checkbox
            isChecked={isMwSimulationInfinite}
            onChange={changeMwInfinite}
          >
            Powtarzaj
          </Checkbox>
        </Box>

        <Box mt={3}>
          <Stack>
            {mw.map((mwItem, i) => {
              const abilities = activeAbilities.map((ability) => {
                if (ability.cooldown > 0) {
                  const mwSlotsToCheck = mw.slice(
                    i - ability.cooldown < 0 ? 0 : i - ability.cooldown,
                    i
                  );

                  if (mwSlotsToCheck.length > 0) {
                    let isAbilityOnCooldown = false;

                    for (const mwSlotToCheck of mwSlotsToCheck) {
                      if (mwSlotToCheck.abilityId === ability.id) {
                        isAbilityOnCooldown = true;
                        break;
                      }
                    }

                    return {
                      ...ability,
                      disabled: isAbilityOnCooldown,
                    };
                  }
                }

                return {
                  ...ability,
                  disabled: false,
                };
              });

              return (
                <MwSlot
                  key={mwItem.id}
                  index={i}
                  mwSlotsAmount={mw.length}
                  id={mwItem.id}
                  abilityId={mwItem.abilityId}
                  abilities={abilities}
                  removeMwSlot={removeMwSlot}
                  changeMwSlotAbility={changeMwSlotAbility}
                  changeMwSlotOrder={changeMwSlotOrder}
                />
              );
            })}

            {mwSlotsToBuy.map((mwSlotToBuy, i) => (
              <MwSlotToBuy
                key={i}
                isActive={i === 0 ? true : false}
                gold={mwSlotToBuy.gold}
                currency={mwSlotToBuy.currency}
                addMwSlot={addMwSlot}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    );
  }
);

export default Mw;
