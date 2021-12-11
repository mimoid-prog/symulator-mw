import {
  Flex,
  Heading,
  Button,
  Portal,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Text,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";

const Header = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading color="teal.100">Symulator MW</Heading>
      <Popover>
        <PopoverTrigger>
          <Button leftIcon={<EmailIcon />}>Kontakt</Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverCloseButton />
            <PopoverHeader>Kontakt</PopoverHeader>
            <PopoverBody>
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
                Jeśli zauważyłeś błąd, masz jakąś propozycję lub pytanie to
                śmiało odzywaj się do mnie.
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
};

export default Header;
