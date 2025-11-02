'use client';
import { Box, Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import store from '@/lib/Store';
import { wrapOnClickWithGa } from '@/lib/ga-react';

export const GenerateMwSimulationButtonSection = observer(() => {
 return (
  <Box position="fixed" bottom={4} left="50%" transform="translateX(-50%)">
   <Button
    size="2xl"
    bgGradient="to-r"
    gradientTo="{colors.brand.primary}"
    gradientFrom="{colors.brand.secondary}"
    disabled={store.isAtLeastOneMwSlot === false}
    onClick={wrapOnClickWithGa(
     store.openMwSimulationModal,
     'generate-simulation',
     { area: 'cta' }
    )}
    border="none"
    boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
    _dark={{
     boxShadow:
      '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    }}
    position="relative"
    overflow="hidden"
    css={{
     '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
       'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
      transition: 'left 0.6s ease',
      zIndex: 1,
      pointerEvents: 'none',
     },
     '&:hover:not(:disabled)::before': {
      left: '100%',
     },
    }}
   >
    <Box as="span" position="relative" zIndex={2}>
     Generuj symulację MW ⚡
    </Box>
   </Button>
  </Box>
 );
});
