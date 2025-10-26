'use client';
import { Box, Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import store from '@/lib/Store';

export const GenerateMwSimulationButtonSection = observer(() => {
 return (
  <Box position="fixed" bottom={4} left="50%" transform="translateX(-50%)">
   <Button
    size="2xl"
    bgGradient="to-r"
    gradientTo="{colors.brand.primary}"
    gradientFrom="{colors.brand.secondary}"
    disabled={store.isAtLeastOneMwSlot === false}
    onClick={store.openMwSimulationModal}
    border="none"
    transition="all 0.3s ease"
    shadow="xl"
    _hover={{
     '& .settings-icon': {
      animation: 'spin 0.6s ease-in-out',
     },
    }}
   >
    Generuj symulację MW ⚡
   </Button>
  </Box>
 );
});
