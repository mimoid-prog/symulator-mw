import {
 Flex,
 Heading,
 Button,
 Portal,
 Popover,
 Text,
 CloseButton,
 Separator,
 Link,
} from '@chakra-ui/react';
import { ColorModeButton } from '@/components/ui/color-mode';
import { LuMail } from 'react-icons/lu';

export const Header = () => {
 return (
  <Flex justifyContent="space-between" alignItems="center">
   <Heading size="4xl" fontWeight="bold" color="{colors.brand.primary}">
    Symulator MW
   </Heading>
   <Flex alignItems="center" gap="2">
    <ColorModeButton />
    <Popover.Root>
     <Popover.Trigger asChild>
      <Button variant="surface">
       <LuMail />
       Kontakt
      </Button>
     </Popover.Trigger>
     <Portal>
      <Popover.Positioner>
       <Popover.Content>
        <Popover.Header
         fontSize="md"
         display="flex"
         justifyContent="space-between"
         alignItems="center"
         py={1}
        >
         <Text>Kontakt</Text>
         <Popover.CloseTrigger asChild>
          <CloseButton size="md" />
         </Popover.CloseTrigger>
        </Popover.Header>

        <Separator />

        <Popover.Body pt={3}>
         <Link
          variant="underline"
          fontWeight="bold"
          href="https://www.margonem.pl/profile/view,8686722#char_359294,aldous"
          target="_blank"
          rel="noreferrer noopener"
          mb={2}
         >
          Link do profilu
         </Link>

         <Text fontSize="sm">Nick w grze: Vlk Romanov, świat Aldous</Text>
         <Text fontSize="sm">Discord: shcopec#1329</Text>
         <Text fontSize="sm">Email: rzyrkunka@gmail.com</Text>

         <Text fontSize="sm" mt={2} fontStyle="italic">
          Jeśli zauważyłeś błąd, masz jakąś propozycję lub pytanie to śmiało
          odzywaj się do mnie.
         </Text>
        </Popover.Body>
       </Popover.Content>
      </Popover.Positioner>
     </Portal>
    </Popover.Root>
   </Flex>
  </Flex>
 );
};
