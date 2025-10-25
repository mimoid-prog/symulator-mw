import { Box, NativeSelect, Text, IconButton, HStack } from '@chakra-ui/react';
import { AbilityWithState } from '../../types/AbilityWithState';
import { LuArrowUp, LuArrowDown, LuX } from 'react-icons/lu';
import { ChangeEvent } from 'react';

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
 changeMwSlotOrder: (id: string, direction: 'up' | 'down') => void;
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
    <NativeSelect.Root size="sm">
     <NativeSelect.Field value={abilityId} onChange={handleMwSlotChange}>
      <option value={0}>Zwykły atak</option>
      {abilities.map((ability) => (
       <option value={ability.id} key={ability.id} disabled={ability.disabled}>
        {ability.name} {ability.disabled && '(odnawia się)'}
       </option>
      ))}
     </NativeSelect.Field>
     <NativeSelect.Indicator />
    </NativeSelect.Root>
    <IconButton
     aria-label="Do góry"
     size="xs"
     colorPalette="green"
     onClick={() => changeMwSlotOrder(id, 'up')}
     disabled={index === 0}
    >
     <LuArrowUp />
    </IconButton>
    <IconButton
     aria-label="Do dołu"
     size="xs"
     colorPalette="green"
     onClick={() => changeMwSlotOrder(id, 'down')}
     disabled={index === mwSlotsAmount - 1}
    >
     <LuArrowDown />
    </IconButton>
    <IconButton
     aria-label="Usuń"
     size="xs"
     colorPalette="red"
     onClick={() => removeMwSlot(id)}
    >
     <LuX />
    </IconButton>
   </HStack>
  </Box>
 );
};

export default MwSlot;
