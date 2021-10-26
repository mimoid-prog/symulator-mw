import {
  Box,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
} from "@chakra-ui/react";
import { Heading, Text } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { AbilityWithState } from "../../types/AbilityWithState";
import { MouseEvent } from "react";

export type Props = {
  abilitiesWithState: AbilityWithState[] | null;
  changeAbilityPoints: (shouldIncrease: boolean, id: number) => void;
};

const Abilities = observer(
  ({ abilitiesWithState, changeAbilityPoints }: Props) => {
    const handlePointsChange = (
      e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
      id: number
    ) => {
      e.preventDefault();

      if (e.button === 0) {
        changeAbilityPoints(true, id);
      } else if (e.button === 2) {
        changeAbilityPoints(false, id);
      }
    };

    return (
      <Box>
        <Stack spacing="12px">
          <Heading size="md">Umiejętności do użycia:</Heading>

          {abilitiesWithState ? (
            <>
              {abilitiesWithState.map((abilityWithState) => (
                <Button
                  variant="outline"
                  style={{
                    height: "100%",
                    paddingTop: "6px",
                  }}
                  key={abilityWithState.id}
                  onClick={(e) => handlePointsChange(e, abilityWithState.id)}
                  onContextMenu={(e) =>
                    handlePointsChange(e, abilityWithState.id)
                  }
                  borderColor={
                    abilityWithState.points === 0
                      ? "red.400"
                      : abilityWithState.points === 10
                      ? "green.400"
                      : "yellow.600"
                  }
                >
                  <Box>
                    <Stat>
                      <StatLabel>{abilityWithState.name}</StatLabel>
                      <StatNumber>{abilityWithState.points}/10</StatNumber>
                      <StatHelpText>
                        Koszt many: {abilityWithState.manaCost}, koszt energii:{" "}
                        {abilityWithState.energyCost}
                      </StatHelpText>
                    </Stat>
                  </Box>
                </Button>
              ))}
            </>
          ) : (
            <Text>-</Text>
          )}
        </Stack>
      </Box>
    );
  }
);

export default Abilities;
