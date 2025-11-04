'use client';
import { Box, Stack } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/lib/store-context';
import { AbilityItem } from './ability-item';

export const Abilities = observer(() => {
 const store = useStore();
 return (
  <Box>
   <Stack gap="12px">
    <Heading size="xl">Umiejętności do użycia</Heading>

    {store.abilitiesWithState.map((abilityWithState) => (
     <AbilityItem
      key={abilityWithState.id}
      abilityWithState={abilityWithState}
     />
    ))}
   </Stack>
  </Box>
 );
});
