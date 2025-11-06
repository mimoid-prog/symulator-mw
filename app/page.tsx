import { Grid, GridItem, Box, Container } from '@chakra-ui/react';
import { Abilities } from '../components/abilities';
import { BasicsForm } from '../components/basics-form';
import { GenerateMwSimulationButtonSection } from '../components/generate-mw-simulation-button-section';
import { Header } from '../components/header';
import { Mw } from '../components/mw/mw';
import { MwSimulationModal } from '../components/mw-simulation-modal';
import { StoreProvider } from '@/lib/store-context';

export default async function Home({
 searchParams,
}: {
 searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
 const sp = await searchParams;

 return (
  <StoreProvider initialSearchParams={sp}>
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
  </StoreProvider>
 );
}
