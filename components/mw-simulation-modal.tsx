'use client';
import { Dialog, Button, Text, Box, CloseButton } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import shortenGold from '../utils/shortenGold';
import store from '@/lib/Store';
import { SimulationContent } from './simulation-content';

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

      {store.simulation && <SimulationContent simulation={store.simulation} />}
     </Dialog.Body>

     <Dialog.CloseTrigger />
    </Dialog.Content>
   </Dialog.Positioner>
  </Dialog.Root>
 );
});
