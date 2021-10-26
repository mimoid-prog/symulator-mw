import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  OrderedList,
  ListItem,
  Badge,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Simulation } from "../../types/Simulation";
import shortenGold from "../../utils/shortenGold";

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  mwTotalGold: number;
  mwTotalCurrency: number;
  simulation: Simulation | null;
};

const MwSimulationModal = observer(
  ({ isOpen, onClose, mwTotalGold, mwTotalCurrency, simulation }: Props) => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Symulacja MW</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight={700}>
              Wydane złoto: {shortenGold(mwTotalGold)}
            </Text>
            <Text fontWeight={700}>Wydane smocze łuski: {mwTotalCurrency}</Text>

            {simulation && (
              <Box mt={3}>
                <Box maxHeight="400px" overflow="auto" paddingRight={2}>
                  {simulation.turns.map((turn, i) => (
                    <Box key={i}>
                      <Box display="flex" justifyContent="space-between">
                        <Text>
                          {i + 1}. {turn.abilityWithState.name}
                        </Text>
                        <HStack>
                          <Badge colorScheme="blue">
                            mana: {turn.currentMana}
                          </Badge>
                          <Badge colorScheme="yellow">
                            energia: {turn.currentEnergy}
                          </Badge>
                        </HStack>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box mt={4}>
                  <Heading size="sm">{simulation.message}</Heading>
                  <Heading size="sm">
                    Wykonane tury: {simulation.turns.length}
                  </Heading>
                </Box>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Zamknij
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

export default MwSimulationModal;
