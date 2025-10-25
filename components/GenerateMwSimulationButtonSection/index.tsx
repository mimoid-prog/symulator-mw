import { Box, Button } from '@chakra-ui/react';
import { LuSettings } from 'react-icons/lu';

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
    size="lg"
    bgGradient="to-r"
    gradientFrom="{colors.brand.primary}"
    gradientTo="{colors.brand.secondary}"
    disabled={isAtLeastOneMwSlot === false}
    onClick={openMwSimulationModal}
    border="none"
   >
    Generuj symulację MW <LuSettings />
   </Button>
  </Box>
 );
};

export default GenerateMwSimulationButtonSection;
