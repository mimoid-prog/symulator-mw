'use client';
import {
 Box,
 Checkbox,
 Heading,
 Stack,
 IconButton,
 Separator,
 Text,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { MwSlot } from './mw-slot';
import { MwSlotToBuy } from './mw-slot-to-buy';
import { useStore } from '@/lib/store-context';
import { Tooltip } from '@/components/ui/tooltip';
import { LuDollarSign } from 'react-icons/lu';
import { wrapOnClickWithGa } from '@/lib/ga-react';

const allMwSlotsToBuy = [
 {
  gold: 250000,
  currency: 25,
 },
 {
  gold: 500000,
  currency: 50,
 },
 {
  gold: 1000000,
  currency: 75,
 },
 {
  gold: 2000000,
  currency: 100,
 },
 {
  gold: 3000000,
  currency: 125,
 },
 ...Array.from(Array(15)).map(() => ({
  gold: 5000000,
  currency: 150,
 })),
];

export const Mw = observer(() => {
 const store = useStore();
 const mwSlotsToBuy = allMwSlotsToBuy.slice(store.mw.length);

 return (
  <Box>
   <Box display="flex" justifyContent="space-between">
    <Heading size="xl">Mistrzostwo walk</Heading>
    <Box display="flex" alignItems="center" gap={2}>
     <Checkbox.Root
      checked={store.isMwSimulationInfinite}
      onCheckedChange={store.changeMwInfinite}
     >
      <Checkbox.HiddenInput />
      <Checkbox.Control>
       <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>Powtarzaj</Checkbox.Label>
     </Checkbox.Root>

     <Separator orientation="vertical" height="4" />

     <Tooltip content="Kup wszystkie na raz">
      <IconButton
       aria-label="Kup wszystkie na raz"
       size="xs"
       variant="solid"
       onClick={wrapOnClickWithGa(
        () => {
         mwSlotsToBuy.forEach((slot) => {
          store.addMwSlot({ currency: slot.currency });
         });
        },
        'mw-buy-all',
        { area: 'mw' }
       )}
      >
       <LuDollarSign />
      </IconButton>
     </Tooltip>
    </Box>
   </Box>

   <Box mt={3}>
    <Stack>
     {store.mw.slice(0, 20).map((mwItem, i) => (
      <MwSlot
       key={mwItem.id}
       index={i}
       mwSlotsAmount={store.mw.length}
       id={mwItem.id}
       abilityId={mwItem.abilityId}
       removeMwSlot={store.removeMwSlot}
       changeMwSlotAbility={store.changeMwSlotAbility}
       changeMwSlotOrder={store.changeMwSlotOrder}
      />
     ))}

     {mwSlotsToBuy.slice(0, 20).map((mwSlotToBuy, i) => (
      <MwSlotToBuy
       key={i}
       isActive={i === 0 ? true : false}
       gold={mwSlotToBuy.gold}
       currency={mwSlotToBuy.currency}
       addMwSlot={store.addMwSlot}
      />
     ))}

     {store.mw.length >= 20 && (
      <>
       <Separator />
       <Text fontSize="sm">
        W Margonem możesz mieć max 20 tur w MW, ale jak chcesz potestować to
        dokup sobie więcej:
       </Text>
       <Separator />

       {store.mw.slice(20).map((mwItem, i) => (
        <MwSlot
         key={mwItem.id}
         index={i + 20}
         mwSlotsAmount={store.mw.length}
         id={mwItem.id}
         abilityId={mwItem.abilityId}
         removeMwSlot={store.removeMwSlot}
         changeMwSlotAbility={store.changeMwSlotAbility}
         changeMwSlotOrder={store.changeMwSlotOrder}
        />
       ))}

       <MwSlotToBuy
        isActive={true}
        gold={5000000}
        currency={150}
        addMwSlot={store.addMwSlot}
       />
      </>
     )}
    </Stack>
   </Box>
  </Box>
 );
});
