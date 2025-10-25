'use client';
import { Box, Stack, Stat, Button, Tag } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { AbilityWithState } from '../../types/AbilityWithState';
import { MouseEvent } from 'react';

export type Props = {
 abilitiesWithState: AbilityWithState[];
 changeAbilityPoints: (
  shouldIncrease: boolean,
  id: number,
  shouldSetExtremumPoints: boolean
 ) => void;
};

const Abilities = observer(
 ({ abilitiesWithState, changeAbilityPoints }: Props) => {
  const handlePointsChange = (
   e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
   id: number
  ) => {
   e.preventDefault();

   if (e.button === 0) {
    changeAbilityPoints(true, id, e.ctrlKey ? true : false);
   } else if (e.button === 2) {
    changeAbilityPoints(false, id, e.ctrlKey ? true : false);
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

  return (
   <Box>
    <Stack gap="12px">
     <Heading size="xl">Umiejętności do użycia:</Heading>
     {abilitiesWithState.map((abilityWithState) => (
      <Button
       variant="outline"
       style={{
        height: '100%',
        paddingTop: '6px',
       }}
       key={abilityWithState.id}
       onClick={(e) => handlePointsChange(e, abilityWithState.id)}
       onContextMenu={(e) => handlePointsChange(e, abilityWithState.id)}
       borderColor={getBorderColor(
        abilityWithState.id,
        abilityWithState.points
       )}
       disabled={abilityWithState.id === 0}
      >
       {abilityWithState.new && (
        <Tag.Root
         colorPalette="blue"
         variant="outline"
         size="sm"
         style={{
          position: 'absolute',
          top: 8,
          left: 8,
         }}
        >
         <Tag.Label>Nowość</Tag.Label>
        </Tag.Root>
       )}

       <Tag.Root
        colorPalette="blue"
        size="sm"
        style={{
         position: 'absolute',
         top: 8,
         right: 8,
        }}
       >
        <Tag.Label>lvl: {abilityWithState.minLevel}</Tag.Label>
       </Tag.Root>

       <Box>
        <Stat.Root>
         <Stat.Label>{abilityWithState.name}</Stat.Label>
         {abilityWithState.id !== 0 && (
          <Stat.ValueText>{abilityWithState.points}/10</Stat.ValueText>
         )}
         <Stat.HelpText>
          Koszty | Mana: {abilityWithState.manaCost}, Energia{' '}
          {abilityWithState.energyCost}
         </Stat.HelpText>
        </Stat.Root>
       </Box>
      </Button>
     ))}
    </Stack>
   </Box>
  );
 }
);

export default Abilities;
