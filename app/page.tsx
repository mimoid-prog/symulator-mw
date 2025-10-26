import { Grid, GridItem, Box, Container } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Abilities from '../components/Abilities';
import { TopHoriozntalAd } from '../components/Ads/TopHorizontalAd';
import BasicsForm from '../components/BasicsForm';
import GenerateMwSimulationButtonSection from '../components/GenerateMwSimulationButtonSection';
import Header from '../components/Header';
import Mw from '../components/Mw';
import MwSimulationModal from '../components/MwSimulationModal';

const Home: NextPage = () => {
 return (
  <Box mt={8} mb={24}>
   <Container maxW="1280px">
    <div>
     <TopHoriozntalAd />
    </div>
    <Header />
    <Box mt={8}>
     <Grid templateColumns="repeat(3,1fr)" gap={6}>
      <GridItem>
       <BasicsForm />
      </GridItem>
      <GridItem>
       <Abilities />
      </GridItem>
      <GridItem>
       <Mw />
      </GridItem>
     </Grid>
    </Box>
   </Container>
   <GenerateMwSimulationButtonSection />
   <MwSimulationModal />
  </Box>
 );
};

export default Home;
