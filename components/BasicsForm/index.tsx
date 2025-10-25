'use client';
import { Heading } from '@chakra-ui/react';
import {
 Input,
 Stack,
 Button,
 NativeSelect,
 Box,
 Field,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import proffesions from '../../data/proffesions';
import { BasicsFormValues } from '../../types/BasicsFormValues';

type Props = {
 defaultFormValues: BasicsFormValues;
 saveBasics: (formValues: BasicsFormValues) => void;
};

const BasicsForm = observer(({ defaultFormValues, saveBasics }: Props) => {
 const [values, setValues] = useState<BasicsFormValues>(defaultFormValues);

 const errors = useMemo(() => {
  const isInvalidNumber = (v: string) =>
   v === '' || Number.isNaN(Number(v)) || Number(v) < 0;
  return {
   level: isInvalidNumber(values.level),
   mana: isInvalidNumber(values.mana),
   energy: isInvalidNumber(values.energy),
   manaRegen: isInvalidNumber(values.manaRegen),
   energyRegen: isInvalidNumber(values.energyRegen),
   proffesion: !values.proffesion,
  };
 }, [values]);

 const onSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  saveBasics(values);
 };

 return (
  <Box>
   <form onSubmit={onSubmit}>
    <Stack gap="12px">
     <Heading size="xl">Podstawowe informacje:</Heading>
     <Field.Root invalid={!!errors.level}>
      <Field.Label fontSize="md">Poziom postaci</Field.Label>
      <Input
       value={values.level}
       onChange={(e) => setValues((v) => ({ ...v, level: e.target.value }))}
      />
      {errors.level && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.mana}>
      <Field.Label fontSize="md">Mana</Field.Label>
      <Input
       value={values.mana}
       onChange={(e) => setValues((v) => ({ ...v, mana: e.target.value }))}
      />
      {errors.mana && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.energy}>
      <Field.Label fontSize="md">Energia</Field.Label>
      <Input
       value={values.energy}
       onChange={(e) => setValues((v) => ({ ...v, energy: e.target.value }))}
      />
      {errors.energy && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.manaRegen}>
      <Field.Label fontSize="md">Regeneracja many</Field.Label>
      <Input
       value={values.manaRegen}
       onChange={(e) => setValues((v) => ({ ...v, manaRegen: e.target.value }))}
      />
      {errors.manaRegen && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.energyRegen}>
      <Field.Label fontSize="md">Regeneracja energii</Field.Label>
      <Input
       value={values.energyRegen}
       onChange={(e) =>
        setValues((v) => ({ ...v, energyRegen: e.target.value }))
       }
      />
      {errors.energyRegen && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.proffesion}>
      <Field.Label fontSize="md">Profesja</Field.Label>
      <NativeSelect.Root>
       <NativeSelect.Field
        value={values.proffesion}
        onChange={(e) =>
         setValues((v) => ({ ...v, proffesion: e.target.value }))
        }
       >
        {proffesions.map((proffesion) => (
         <option value={proffesion.value} key={proffesion.value}>
          {proffesion.label}
         </option>
        ))}
       </NativeSelect.Field>
       <NativeSelect.Indicator />
      </NativeSelect.Root>
      {errors.proffesion && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>
    </Stack>
    <Box mt={6}>
     <Button colorPalette="brand" size="md" fontSize="md" type="submit">
      Zapisz
     </Button>
    </Box>
   </form>
  </Box>
 );
});

export default BasicsForm;
