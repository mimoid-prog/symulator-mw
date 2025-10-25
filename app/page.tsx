import { Grid, GridItem, Box, Container } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import type { NextPage } from 'next';
import Abilities from '../components/Abilities';
import { TopHoriozntalAd } from '../components/Ads/TopHorizontalAd';
import BasicsForm from '../components/BasicsForm';
import GenerateMwSimulationButtonSection from '../components/GenerateMwSimulationButtonSection';
import Header from '../components/Header';
import Mw from '../components/Mw';
import MwSimulationModal from '../components/MwSimulationModal';
import store from '../lib/Store';

const Home: NextPage = observer(() => {
 return (
  <Box mt={8} mb={20}>
   <Container maxW="container.xl">
    <div>
     <TopHoriozntalAd />
    </div>
    <Header />
    <Box mt={8}>
     <Grid templateColumns="repeat(3,1fr)" gap={6}>
      <GridItem>
       <BasicsForm
        defaultFormValues={store.basicsFormValues}
        saveBasics={store.saveBasics}
       />
      </GridItem>
      <GridItem>
       <Abilities
        abilitiesWithState={store.abilitiesWithState}
        changeAbilityPoints={store.changeAbilityPoints}
       />
      </GridItem>
      <GridItem>
       <Mw
        mw={store.mw}
        addMwSlot={store.addMwSlot}
        removeMwSlot={store.removeMwSlot}
        activeAbilities={store.activeAbilities}
        changeMwSlotAbility={store.changeMwSlotAbility}
        changeMwSlotOrder={store.changeMwSlotOrder}
        isMwSimulationInfinite={store.isMwSimulationInfinite}
        changeMwInfinite={store.changeMwInfinite}
       />
      </GridItem>
     </Grid>
    </Box>
   </Container>
   <GenerateMwSimulationButtonSection
    isAtLeastOneMwSlot={store.isAtLeastOneMwSlot}
    openMwSimulationModal={store.openMwSimulationModal}
   />
   <MwSimulationModal
    isOpen={store.isMwSimulationModalOpen}
    onClose={store.closeMwSimulationModal}
    mwTotalGold={store.mwTotalGold}
    mwTotalCurrency={store.mwTotalCurrency}
    simulation={store.simulation}
   />
  </Box>
 );
});

export default Home;
