import { Grid, GridItem, Box, Container } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { Abilities } from '../components/abilities';
import { BasicsForm } from '../components/basics-form';
import { GenerateMwSimulationButtonSection } from '../components/generate-mw-simulation-button-section';
import { Header } from '../components/header';
import { Mw } from '../components/mw/mw';
import { MwSimulationModal } from '../components/mw-simulation-model';

const Home: NextPage = () => {
 return (
  <Box mt={8} mb={24}>
   <Container maxW="1280px">
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
