'use client';
import { Text, Button, Tag, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { MouseEvent } from 'react';
import { useStore } from '@/lib/store-context';
import { AbilityWithState } from '@/types/AbilityWithState';

export const AbilityItem = observer(
 ({ abilityWithState }: { abilityWithState: AbilityWithState }) => {
  const store = useStore();
  const handlePointsChange = (
   e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
   id: number
  ) => {
   e.preventDefault();

   if (e.button === 0) {
    store.changeAbilityPoints(true, id, e.ctrlKey ? true : false);
   } else if (e.button === 2) {
    store.changeAbilityPoints(false, id, e.ctrlKey ? true : false);
   }
  };

  const getBorderColor = (abilityId: number, points: number) => {
   return abilityId === 0
    ? 'green.400'
    : points === 0
    ? 'red.400'
    : points === 10
    ? 'green.400'
    : 'yellow.600';
  };

  const cooldownValue = (() => {
   const { cooldown, points } = abilityWithState;

   if (typeof cooldown === 'number') {
    return cooldown || 0;
   }

   if (points <= 0) {
    return cooldown[0] || 0;
   }

   const index = Math.min(points - 1, cooldown.length - 1);
   return cooldown[index] || 0;
  })();

  return (
   <Button
    variant="outline"
    py="6px"
    height="100%"
    key={abilityWithState.id}
    onClick={(e) => handlePointsChange(e, abilityWithState.id)}
    onContextMenu={(e) => handlePointsChange(e, abilityWithState.id)}
    borderColor={getBorderColor(abilityWithState.id, abilityWithState.points)}
    disabled={abilityWithState.id === 0}
   >
    <Flex position="absolute" top="8px" left="8px" gap="2">
     {abilityWithState.new && (
      <Tag.Root colorPalette="blue" variant="outline" size="sm">
       <Tag.Label>Nowość</Tag.Label>
      </Tag.Root>
     )}
    </Flex>

    <Flex
     direction="column"
     alignItems="flex-end"
     position="absolute"
     top="8px"
     right="8px"
     gap="1.5"
    >
     <Tag.Root colorPalette="blue" size="sm">
      <Tag.Label>lvl: {abilityWithState.minLevel}</Tag.Label>
     </Tag.Root>

     {cooldownValue > 0 && (
      <Tag.Root
       colorPalette="purple"
       variant="outline"
       size="sm"
       width="fit-content"
      >
       <Tag.Label>cd: {cooldownValue}</Tag.Label>
      </Tag.Root>
     )}
    </Flex>

    <Flex direction="column" gap="1">
     <Text fontWeight="600">{abilityWithState.name}</Text>
     {abilityWithState.id !== 0 && (
      <Text fontSize="2xl">{abilityWithState.points}/10</Text>
     )}
     <Text fontWeight="500" color={{ _dark: 'rgba(255,255,255, 0.8)' }}>
      Koszty | Mana: {abilityWithState.manaCost}, Energia{' '}
      {abilityWithState.energyCost}
     </Text>
    </Flex>
   </Button>
  );
 }
);
