import {
  Box,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Tag,
} from '@chakra-ui/react';
import { Heading } from '@chakra-ui/layout';
import { observer } from 'mobx-react-lite';
import { AbilityWithState } from '../../types/AbilityWithState';
import { MouseEvent } from 'react';

export type Props = {
  abilitiesWithState: AbilityWithState[];
  changeAbilityPoints: (
    shouldIncrease: boolean,
    id: number,
    shouldSetExtremumPoints: boolean
  ) => void;
};

const Abilities = observer(
  ({ abilitiesWithState, changeAbilityPoints }: Props) => {
    const handlePointsChange = (
      e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
      id: number
    ) => {
      e.preventDefault();

      if (e.button === 0) {
        changeAbilityPoints(true, id, e.ctrlKey ? true : false);
      } else if (e.button === 2) {
        changeAbilityPoints(false, id, e.ctrlKey ? true : false);
      }
    };

    const getBorderColor = (abilityId: number, points: number) => {
      return abilityId === 0
        ? 'green.400'
        : points === 0
        ? 'red.400'
        : points === 10
        ? 'green.400'
        : 'yellow.600';
    };

    return (
      <Box>
        <Stack spacing="12px">
          <Heading size="md">Umiejętności do użycia:</Heading>
          {abilitiesWithState.map((abilityWithState) => (
            <Button
              variant="outline"
              style={{
                height: '100%',
                paddingTop: '6px',
              }}
              key={abilityWithState.id}
              onClick={(e) => handlePointsChange(e, abilityWithState.id)}
              onContextMenu={(e) => handlePointsChange(e, abilityWithState.id)}
              borderColor={getBorderColor(
                abilityWithState.id,
                abilityWithState.points
              )}
              disabled={abilityWithState.id === 0}
            >
              {abilityWithState.new && (
                <Tag
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                  }}
                >
                  Nowość
                </Tag>
              )}

              <Tag
                colorScheme="blue"
                size="sm"
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}
              >
                lvl: {abilityWithState.minLevel}
              </Tag>

              <Box>
                <Stat>
                  <StatLabel>{abilityWithState.name}</StatLabel>
                  {abilityWithState.id !== 0 && (
                    <StatNumber>{abilityWithState.points}/10</StatNumber>
                  )}
                  <StatHelpText>
                    Koszty | Mana: {abilityWithState.manaCost}, Energia:{' '}
                    {abilityWithState.energyCost}
                  </StatHelpText>
                </Stat>
              </Box>
            </Button>
          ))}
        </Stack>
      </Box>
    );
  }
);

export default Abilities;
