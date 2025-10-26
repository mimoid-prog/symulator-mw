'use client';
import {
 Dialog,
 Button,
 Text,
 Box,
 Badge,
 HStack,
 Heading,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import shortenGold from '../utils/shortenGold';
import store from '@/lib/Store';

export const MwSimulationModal = observer(() => {
 return (
  <Dialog.Root
   open={store.isMwSimulationModalOpen}
   onOpenChange={(d) => !d.open && store.closeMwSimulationModal()}
  >
   <Dialog.Backdrop />
   <Dialog.Positioner>
    <Dialog.Content>
     <Dialog.Header>
      <Dialog.Title>Symulacja MW</Dialog.Title>
     </Dialog.Header>
     <Dialog.Body>
      <Text fontWeight={700}>
       Wydane złoto: {shortenGold(store.mwTotalGold)}
      </Text>
      <Text fontWeight={700}>Wydane SŁ: {store.mwTotalCurrency}</Text>

      {store.simulation && (
       <Box mt={3}>
        <Box maxHeight="400px" overflow="auto" paddingRight={3}>
         {store.simulation.rounds.map((round, roundI) => (
          <Box key={roundI} mb={2}>
           {round.turns.length > 0 && (
            <Badge mb={1}>Kolejka {roundI + 1}</Badge>
           )}

           {round.turns.map((turn, turnI) => (
            <Box key={turnI}>
             <Box display="flex" justifyContent="space-between">
              <Text>
               {turn.id + 1}. {turn.abilityWithState.name}{' '}
              </Text>
              <HStack>
               <Badge colorPalette="blue" width="90px">
                <Box display="flex" justifyContent="space-between">
                 <span>{turn.mana.current}</span>
                 <span>mana</span>
                </Box>
               </Badge>
               <Badge colorPalette="yellow" width="100px">
                <Box display="flex" justifyContent="space-between">
                 <span>{turn.energy.current}</span>
                 <span>energia</span>{' '}
                </Box>
               </Badge>
              </HStack>
             </Box>
            </Box>
           ))}
          </Box>
         ))}
        </Box>
        <Box mt={4}>
         <Heading size="sm">{store.simulation.message}</Heading>
         <Heading size="sm">
          Wykonane tury: {store.simulation.turnsCount}
         </Heading>
         {store.simulation.turnsCount >= 1000 && (
          <Text>Wystarczy bo zaraz ci komputer wybuchnie!</Text>
         )}
        </Box>
       </Box>
      )}
     </Dialog.Body>
     <Dialog.Footer>
      <Button colorPalette="blue" mr={3} onClick={store.closeMwSimulationModal}>
       Zamknij
      </Button>
     </Dialog.Footer>
     <Dialog.CloseTrigger />
    </Dialog.Content>
   </Dialog.Positioner>
  </Dialog.Root>
 );
});
