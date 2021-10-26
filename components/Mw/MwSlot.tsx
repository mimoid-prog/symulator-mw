import { Box } from "@chakra-ui/layout";
import { Select, Text, IconButton, HStack } from "@chakra-ui/react";
import { AbilityWithState } from "../../types/AbilityWithState";
import { ArrowUpIcon, ArrowDownIcon, CloseIcon } from "@chakra-ui/icons";
import { ChangeEvent } from "react";

export type Props = {
  index: number;
  mwSlotsAmount: number;
  id: string;
  abilityId: number;
  abilities: (AbilityWithState & {
    disabled: boolean;
  })[];
  removeMwSlot: (id: string) => void;
  changeMwSlotAbility: (id: string, abilityId: number) => void;
  changeMwSlotOrder: (id: string, direction: "up" | "down") => void;
};

const MwSlot = ({
  index,
  mwSlotsAmount,
  id,
  abilityId,
  abilities,
  removeMwSlot,
  changeMwSlotAbility,
  changeMwSlotOrder,
}: Props) => {
  const handleMwSlotChange = (e: ChangeEvent<HTMLSelectElement>) => {
    changeMwSlotAbility(id, parseInt(e.target.value));
  };

  return (
    <Box padding={2}>
      <HStack>
        <Text>{index + 1}.</Text>
        <Select size="sm" value={abilityId} onChange={handleMwSlotChange}>
          <option value={0}>Zwykły atak</option>
          {abilities.map((ability) => (
            <option
              value={ability.id}
              key={ability.id}
              disabled={ability.disabled}
            >
              {ability.name}
            </option>
          ))}
        </Select>
        <IconButton
          aria-label="Do góry"
          icon={<ArrowUpIcon />}
          size="xs"
          colorScheme="green"
          onClick={() => changeMwSlotOrder(id, "up")}
          disabled={index === 0}
        />
        <IconButton
          aria-label="Do dołu"
          icon={<ArrowDownIcon />}
          size="xs"
          colorScheme="green"
          onClick={() => changeMwSlotOrder(id, "down")}
          disabled={index === mwSlotsAmount - 1}
        />
        <IconButton
          aria-label="Usuń"
          icon={<CloseIcon />}
          size="xs"
          colorScheme="red"
          onClick={() => removeMwSlot(id)}
        />
      </HStack>
    </Box>
  );
};

export default MwSlot;
