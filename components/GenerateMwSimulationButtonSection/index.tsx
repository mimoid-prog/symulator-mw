import { Box, Button } from '@chakra-ui/react';

export type Props = {
 isAtLeastOneMwSlot: boolean;
 openMwSimulationModal: () => void;
};

const GenerateMwSimulationButtonSection = ({
 isAtLeastOneMwSlot,
 openMwSimulationModal,
}: Props) => {
 return (
  <Box position="fixed" bottom={4} left="50%" transform="translateX(-50%)">
   <Button
    size="2xl"
    bgGradient="to-r"
    gradientTo="{colors.brand.primary}"
    gradientFrom="{colors.brand.secondary}"
    disabled={isAtLeastOneMwSlot === false}
    onClick={openMwSimulationModal}
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
};

export default GenerateMwSimulationButtonSection;
