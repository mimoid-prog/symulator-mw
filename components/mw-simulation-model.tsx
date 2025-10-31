'use client';
import {
 Dialog,
 Button,
 Text,
 Box,
 Badge,
 HStack,
 Heading,
 CloseButton,
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
     <Dialog.CloseTrigger asChild>
      <CloseButton size="md" />
     </Dialog.CloseTrigger>
     <Dialog.Header>
      <Dialog.Title fontSize="xl">Symulacja MW</Dialog.Title>
     </Dialog.Header>
     <Dialog.Body>
      <Text fontWeight={700} fontSize="md">
       Wydane złoto: {shortenGold(store.mwTotalGold)}
      </Text>
      <Text fontWeight={700} fontSize="md">
       Wydane SŁ: {store.mwTotalCurrency}
      </Text>

      {store.simulation && (
       <Box mt={3}>
        <Box
         maxHeight="400px"
         overflow="auto"
         paddingRight={3}
         display="flex"
         flexDirection="column"
         gap={1}
        >
         {store.simulation.rounds.map((round, roundI) => (
          <Box key={roundI} mb={2}>
           {round.turns.length > 0 && (
            <Badge
             mb={2}
             fontSize="smaller"
             textTransform="uppercase"
             fontWeight={700}
             variant="solid"
            >
             Kolejka {roundI + 1}
            </Badge>
           )}

           <Box display="flex" flexDirection="column" gap={1}>
            {round.turns.map((turn) => (
             <Box key={turn.id}>
              <Box display="flex" justifyContent="space-between">
               <Text fontSize="md">
                {turn.id + 1}. {turn.abilityWithState.name}{' '}
               </Text>
               <HStack>
                <Badge colorPalette="blue" variant="solid" width="90px">
                 <Box
                  display="flex"
                  justifyContent="space-between"
                  textTransform="uppercase"
                  width="100%"
                 >
                  <span>{turn.mana.current}</span>
                  <span>mana</span>
                 </Box>
                </Badge>
                <Badge colorPalette="yellow" variant="solid" width="95px">
                 <Box
                  display="flex"
                  justifyContent="space-between"
                  textTransform="uppercase"
                  width="100%"
                 >
                  <span>{turn.energy.current}</span>
                  <span>energia</span>{' '}
                 </Box>
                </Badge>
               </HStack>
              </Box>
             </Box>
            ))}
           </Box>
          </Box>
         ))}
        </Box>
        <Box mt={4}>
         <Heading size="md">{store.simulation.message}</Heading>
         <Heading size="md">
          Wykonane tury: {store.simulation.turnsCount}
         </Heading>
         {store.simulation.turnsCount >= 1000 && (
          <Text>Wystarczy bo zaraz ci komputer wybuchnie!</Text>
         )}
        </Box>
       </Box>
      )}
     </Dialog.Body>

     <Dialog.CloseTrigger />
    </Dialog.Content>
   </Dialog.Positioner>
  </Dialog.Root>
 );
});
