'use client';
import { Box, Checkbox, Heading, Stack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import MwSlot from './MwSlot';
import MwSlotToBuy from './MwSlotToBuy';
import store from '@/lib/Store';

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

const Mw = observer(() => {
 const mwSlotsToBuy = allMwSlotsToBuy.slice(store.mw.length);

 return (
  <Box>
   <Box display="flex" justifyContent="space-between">
    <Heading size="xl">Mistrzostwo walk</Heading>
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
   </Box>

   <Box mt={3}>
    <Stack>
     {store.mw.map((mwItem, i) => {
      const abilities = store.activeAbilities.map((ability) => {
       const cooldown =
        typeof ability.cooldown === 'number'
         ? ability.cooldown
         : ability.cooldown[ability.points - 1];

       if (cooldown > 0) {
        const mwSlotsToCheck = store.mw.slice(
         i - cooldown < 0 ? 0 : i - cooldown,
         i
        );

        if (mwSlotsToCheck.length > 0) {
         let isAbilityOnCooldown = false;

         for (const mwSlotToCheck of mwSlotsToCheck) {
          if (mwSlotToCheck.abilityId === ability.id) {
           isAbilityOnCooldown = true;
           break;
          }
         }

         return {
          ...ability,
          disabled: isAbilityOnCooldown,
         };
        }
       }

       return {
        ...ability,
        disabled: false,
       };
      });

      return (
       <MwSlot
        key={mwItem.id}
        index={i}
        mwSlotsAmount={store.mw.length}
        id={mwItem.id}
        abilityId={mwItem.abilityId}
        abilities={abilities}
        removeMwSlot={store.removeMwSlot}
        changeMwSlotAbility={store.changeMwSlotAbility}
        changeMwSlotOrder={store.changeMwSlotOrder}
       />
      );
     })}

     {mwSlotsToBuy.map((mwSlotToBuy, i) => (
      <MwSlotToBuy
       key={i}
       isActive={i === 0 ? true : false}
       gold={mwSlotToBuy.gold}
       currency={mwSlotToBuy.currency}
       addMwSlot={store.addMwSlot}
      />
     ))}
    </Stack>
   </Box>
  </Box>
 );
});

export default Mw;
