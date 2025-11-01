import { Box, NativeSelect, Text, IconButton, HStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { LuArrowUp, LuArrowDown, LuX } from 'react-icons/lu';
import { ChangeEvent } from 'react';
import store from '@/lib/Store';

export type Props = {
 index: number;
 mwSlotsAmount: number;
 id: string;
 abilityId: number;
 removeMwSlot: (id: string) => void;
 changeMwSlotAbility: (id: string, abilityId: number) => void;
 changeMwSlotOrder: (id: string, direction: 'up' | 'down') => void;
};

export const MwSlot = observer(
 ({
  index,
  mwSlotsAmount,
  id,
  abilityId,
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
       {store.activeAbilities.map((ability) => {
        const isDisabled = store.isAbilityDisabledAtSlot(index, ability.id);
        return (
         <option value={ability.id} key={ability.id} disabled={isDisabled}>
          {ability.name} {isDisabled && '(odnawia się)'}
         </option>
        );
       })}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
     </NativeSelect.Root>
     <IconButton
      aria-label="Do góry"
      size="xs"
      colorPalette="green"
      rounded="full"
      onClick={() => changeMwSlotOrder(id, 'up')}
      disabled={index === 0}
     >
      <LuArrowUp />
     </IconButton>
     <IconButton
      aria-label="Do dołu"
      size="xs"
      colorPalette="green"
      rounded="full"
      onClick={() => changeMwSlotOrder(id, 'down')}
      disabled={index === mwSlotsAmount - 1}
     >
      <LuArrowDown />
     </IconButton>
     <IconButton
      aria-label="Usuń"
      size="xs"
      colorPalette="red"
      rounded="full"
      onClick={() => removeMwSlot(id)}
     >
      <LuX />
     </IconButton>
    </HStack>
   </Box>
  );
 }
);
