import {
 Box,
 Text,
 IconButton,
 HStack,
 Select,
 Portal,
 createListCollection,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { LuArrowUp, LuArrowDown, LuX } from 'react-icons/lu';
import { useStore } from '@/lib/store-context';

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
  const store = useStore();
  const selectItems = [
   { label: 'Zwykły atak', value: '0' },
   ...store.activeAbilities.map((ability) => ({
    label: `${ability.name}${
     store.isAbilityDisabledAtSlot(index, ability.id) ? ' (odnawia się)' : ''
    }`,
    value: String(ability.id),
    disabled: store.isAbilityDisabledAtSlot(index, ability.id),
   })),
  ];

  const collection = createListCollection({
   items: selectItems,
   itemToString: (item) => item.label,
   itemToValue: (item) => item.value,
  });

  return (
   <Box padding={2}>
    <HStack>
     <Text>{index + 1}.</Text>
     <Select.Root
      size="sm"
      collection={collection}
      value={[String(abilityId)]}
      onValueChange={({ value }) => {
       const next = parseInt(value[0] ?? '0');
       changeMwSlotAbility(id, next);
      }}
     >
      <Select.HiddenSelect />
      <Select.Control>
       <Select.Trigger>
        <Select.ValueText placeholder="Wybierz" />
       </Select.Trigger>
       <Select.IndicatorGroup>
        <Select.Indicator />
       </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
       <Select.Positioner>
        <Select.Content
         bg={{ _light: 'white' }}
         borderWidth={{ _light: '1px' }}
         borderColor={{ _light: 'gray.300' }}
         rounded={{ _light: 'md' }}
         shadow={{ _light: 'lg' }}
        >
         {selectItems.map((item) => (
          <Select.Item item={item} key={item.value}>
           <Select.ItemText>{item.label}</Select.ItemText>
           <Select.ItemIndicator />
          </Select.Item>
         ))}
        </Select.Content>
       </Select.Positioner>
      </Portal>
     </Select.Root>
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
