import { Button, Box, Grid, GridItem } from '@chakra-ui/react';
import shortenGold from '../../utils/shortenGold';

export type Props = {
 isActive: boolean;
 gold: number;
 currency: number;
 addMwSlot: (arg: { gold?: number; currency?: number }) => void;
};

const MwSlotToBuy = ({ isActive, gold, currency, addMwSlot }: Props) => {
 return (
  <Box borderWidth={1} borderColor="gray.700" padding={2}>
   <Grid templateColumns="repeat(2,1fr)" gap={2}>
    <GridItem>
     <Button
      size="xs"
      disabled={!isActive}
      width="100%"
      onClick={() => addMwSlot({ gold })}
     >
      Zakup za {shortenGold(gold)}
     </Button>
    </GridItem>
    <GridItem>
     <Button
      size="xs"
      disabled={!isActive}
      width="100%"
      onClick={() => addMwSlot({ currency })}
     >
      Zakup za {currency}sł
     </Button>
    </GridItem>
   </Grid>
  </Box>
 );
};

export default MwSlotToBuy;
