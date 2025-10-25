import { Flex, Heading, Button, Portal, Popover, Text } from '@chakra-ui/react';
import { LuMail } from 'react-icons/lu';

const Header = () => {
 return (
  <Flex justifyContent="space-between" alignItems="center">
   <Heading color="teal.100">Symulator MW</Heading>
   <Popover.Root>
    <Popover.Trigger asChild>
     <Button>
      <LuMail />
      Kontakt
     </Button>
    </Popover.Trigger>
    <Portal>
     <Popover.Positioner>
      <Popover.Content>
       <Popover.CloseTrigger />
       <Popover.Header>Kontakt</Popover.Header>
       <Popover.Body>
        <Button
         variant="link"
         as="a"
         href="https://www.margonem.pl/profile/view,8686722#char_359294,aldous"
         target="_blank"
        >
         Link do profilu
        </Button>
        <Text fontSize="sm">Nick w grze: Vlk Romanov, świat Aldous</Text>
        <Text fontSize="sm">Discord: shcopec#1329</Text>
        <Text fontSize="sm">Email: rzyrkunka@gmail.com</Text>
        <br />
        <Text fontSize="sm">
         Jeśli zauważyłeś błąd, masz jakąś propozycję lub pytanie to śmiało
         odzywaj się do mnie.
        </Text>
       </Popover.Body>
      </Popover.Content>
     </Popover.Positioner>
    </Portal>
   </Popover.Root>
  </Flex>
 );
};

export default Header;
