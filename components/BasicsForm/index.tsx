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

 const errors = useMemo(
  () => ({
   level: values.level === undefined || values.level < 0,
   mana: values.mana === undefined || values.mana < 0,
   energy: values.energy === undefined || values.energy < 0,
   manaRegen: values.manaRegen === undefined || values.manaRegen < 0,
   energyRegen: values.energyRegen === undefined || values.energyRegen < 0,
   proffesion: !values.proffesion,
  }),
  [values]
 );

 const onSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  saveBasics(values);
 };

 return (
  <Box>
   <form onSubmit={onSubmit}>
    <Stack gap="12px">
     <Heading size="md">Podstawowe informacje:</Heading>
     <Field.Root invalid={!!errors.level}>
      <Field.Label>Poziom postaci</Field.Label>
      <Input
       value={values.level}
       onChange={(e) =>
        setValues((v) => ({ ...v, level: Number(e.target.value) }))
       }
      />
      {errors.level && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.mana}>
      <Field.Label>Mana</Field.Label>
      <Input
       value={values.mana}
       onChange={(e) =>
        setValues((v) => ({ ...v, mana: Number(e.target.value) }))
       }
      />
      {errors.mana && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.energy}>
      <Field.Label>Energia</Field.Label>
      <Input
       value={values.energy}
       onChange={(e) =>
        setValues((v) => ({ ...v, energy: Number(e.target.value) }))
       }
      />
      {errors.energy && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.manaRegen}>
      <Field.Label>Regeneracja many</Field.Label>
      <Input
       value={values.manaRegen}
       onChange={(e) =>
        setValues((v) => ({ ...v, manaRegen: Number(e.target.value) }))
       }
      />
      {errors.manaRegen && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.energyRegen}>
      <Field.Label>Regeneracja energii</Field.Label>
      <Input
       value={values.energyRegen}
       onChange={(e) =>
        setValues((v) => ({ ...v, energyRegen: Number(e.target.value) }))
       }
      />
      {errors.energyRegen && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.proffesion}>
      <Field.Label>Profesja</Field.Label>
      <NativeSelect.Root>
       <NativeSelect.Field
        value={values.proffesion}
        onChange={(e) =>
         setValues((v) => ({ ...v, proffesion: e.target.value as any }))
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
     <Button colorPalette="teal" type="submit">
      Zapisz
     </Button>
    </Box>
   </form>
  </Box>
 );
});

export default BasicsForm;
