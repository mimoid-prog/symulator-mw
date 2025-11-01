'use client';
import { Box, Stack } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import store from '@/lib/Store';
import { AbilityItem } from './ability-item';

export const Abilities = observer(() => {
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
