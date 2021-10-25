import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";

export type Props = {
  isAtLeastOneMwSlot: boolean;
  openMwSimulationModal: () => void;
};

const GenerateMwSimulationButtonSection = ({
  isAtLeastOneMwSlot,
  openMwSimulationModal,
}: Props) => {
  return (
    <Box
      position="fixed"
      bottom={4}
      left="50%"
      transform="translateX(-50%)"
      background="linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.3785889355742297) 100%)"
    >
      <Button
        size="lg"
        colorScheme="teal"
        disabled={isAtLeastOneMwSlot === false}
        rightIcon={<SettingsIcon />}
        onClick={openMwSimulationModal}
      >
        Generuj symulację MW
      </Button>
    </Box>
  );
};

export default GenerateMwSimulationButtonSection;
