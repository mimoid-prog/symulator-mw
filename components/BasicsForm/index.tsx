import { Heading } from "@chakra-ui/layout";
import {
  Input,
  Stack,
  Button,
  Select,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { SubmitHandler, useForm } from "react-hook-form";
import proffesions from "../../data/proffesions";
import { BasicsFormValues } from "../../types/BasicsFormValues";

type Props = {
  defaultFormValues: BasicsFormValues;
  saveBasics: (formValues: BasicsFormValues) => void;
};

const BasicsForm = observer(({ defaultFormValues, saveBasics }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicsFormValues>({
    defaultValues: defaultFormValues,
  });

  const onSubmit: SubmitHandler<BasicsFormValues> = (formValues) => {
    saveBasics(formValues);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="12px">
          <Heading size="md">Podstawowe informacje:</Heading>
          <FormControl id="level">
            <FormLabel>Poziom postaci</FormLabel>
            <Input
              {...register("level", { required: true, min: 0 })}
              isInvalid={!!errors.level}
            />
            {errors.level && (
              <FormHelperText>
                To pole jest wymagane, a wartość musi być dodatnia.
              </FormHelperText>
            )}
          </FormControl>

          <FormControl id="mana">
            <FormLabel>Mana</FormLabel>
            <Input
              {...register("mana", { required: true, min: 0 })}
              isInvalid={!!errors.mana}
            />
            {errors.mana && (
              <FormHelperText>
                To pole jest wymagane, a wartość musi być dodatnia.
              </FormHelperText>
            )}
          </FormControl>

          <FormControl id="energy">
            <FormLabel>Energia</FormLabel>
            <Input
              {...register("energy", { required: true, min: 0 })}
              isInvalid={!!errors.energy}
            />
            {errors.energy && (
              <FormHelperText>
                To pole jest wymagane, a wartość musi być dodatnia.
              </FormHelperText>
            )}
          </FormControl>

          <FormControl id="manaRegen">
            <FormLabel>Regeneracja many</FormLabel>
            <Input
              {...register("manaRegen", { required: true, min: 0 })}
              isInvalid={!!errors.manaRegen}
            />
            {errors.manaRegen && (
              <FormHelperText>
                To pole jest wymagane, a wartość musi być dodatnia.
              </FormHelperText>
            )}
          </FormControl>

          <FormControl id="energyRegen">
            <FormLabel>Regeneracja energii</FormLabel>
            <Input
              {...register("energyRegen", { required: true, min: 0 })}
              isInvalid={!!errors.energyRegen}
            />
            {errors.energyRegen && (
              <FormHelperText>
                To pole jest wymagane, a wartość musi być dodatnia.
              </FormHelperText>
            )}
          </FormControl>

          <FormControl id="proffesion">
            <FormLabel>Profesja</FormLabel>
            <Select
              {...register("proffesion", { required: true })}
              isInvalid={!!errors.proffesion}
            >
              {proffesions.map((proffesion) => (
                <option value={proffesion.value} key={proffesion.value}>
                  {proffesion.label}
                </option>
              ))}
            </Select>
            {errors.proffesion && (
              <FormHelperText>
                To pole jest wymagane, a wartość musi być dodatnia.
              </FormHelperText>
            )}
          </FormControl>
        </Stack>
        <Box mt={6}>
          <Button colorScheme="teal" type="submit">
            Zapisz
          </Button>
        </Box>
      </form>
    </Box>
  );
});

export default BasicsForm;
