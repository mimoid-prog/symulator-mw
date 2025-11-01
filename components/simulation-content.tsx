'use client';
import { Box, Badge, HStack, Heading, Text } from '@chakra-ui/react';
import { memo } from 'react';
import { Simulation } from '@/types/Simulation';

export const SimulationContent = memo(({ simulation }: { simulation: Simulation }) => {
 return (
  <Box mt={3}>
   <Box
    maxHeight="400px"
    overflow="auto"
    paddingRight={3}
    display="flex"
    flexDirection="column"
    gap={1}
   >
    {simulation.rounds.map((round, roundI) => (
     <Box key={roundI} mb={2}>
      {round.turns.length > 0 && (
       <Badge
        mb={2}
        fontSize="smaller"
        textTransform="uppercase"
        fontWeight={700}
        variant="solid"
       >
        Kolejka {roundI + 1}
       </Badge>
      )}

      <Box display="flex" flexDirection="column" gap={1}>
       {round.turns.map((turn) => (
        <Box key={turn.id}>
         <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
           <Text fontSize="md">
            {turn.id + 1}. {turn.abilityWithState.name}
           </Text>
           <HStack gap="1">
            {Array.from({ length: simulation.combinationPointsCap }).map((_, i) => (
             <Box
              key={i}
              w="8px"
              h="8px"
              borderRadius="full"
              borderWidth="1px"
              borderColor="gray.400"
              bg={i < turn.combinationPoints ? "yellow.500" : "transparent"}
             />
            ))}
           </HStack>
          </Box>
          <HStack>
           <Badge colorPalette="blue" variant="solid" width="90px">
            <Box
             display="flex"
             justifyContent="space-between"
             textTransform="uppercase"
             width="100%"
            >
             <span>{turn.mana.current}</span>
             <span>mana</span>
            </Box>
           </Badge>
           <Badge colorPalette="yellow" variant="solid" width="95px">
            <Box
             display="flex"
             justifyContent="space-between"
             textTransform="uppercase"
             width="100%"
            >
             <span>{turn.energy.current}</span>
             <span>energia</span>{' '}
            </Box>
           </Badge>
          </HStack>
         </Box>
        </Box>
       ))}
      </Box>
     </Box>
    ))}
   </Box>
   <Box mt={4}>
    <Heading size="md">{simulation.message}</Heading>
    <Heading size="md">Wykonane tury: {simulation.turnsCount}</Heading>
    {simulation.turnsCount >= 1000 && (
     <Text fontSize="md">Wystarczy bo zaraz ci komputer wybuchnie!</Text>
    )}
   </Box>
  </Box>
 );
});


