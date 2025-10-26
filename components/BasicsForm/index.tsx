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
import { useForm } from 'react-hook-form';
import proffesions from '../../data/proffesions';
import { BasicsFormValues } from '../../types/BasicsFormValues';
import store from '@/lib/Store';

const BasicsForm = observer(() => {
 const {
  register,
  handleSubmit,

  formState: { errors },
 } = useForm<BasicsFormValues>({ defaultValues: store.basicsFormValues });

 const validateNumber = (v: string) =>
  v === '' || Number.isNaN(Number(v)) || Number(v) < 0
   ? 'To pole jest wymagane, a wartość musi być dodatnia.'
   : true;

 const onSubmit = (data: BasicsFormValues) => {
  store.saveBasics(data);
 };

 return (
  <Box>
   <form onSubmit={handleSubmit(onSubmit)}>
    <Stack gap="12px">
     <Heading size="xl">Podstawowe informacje</Heading>
     <Field.Root invalid={!!errors.level}>
      <Field.Label fontSize="md">Poziom postaci</Field.Label>
      <Input {...register('level', { validate: validateNumber })} />
      {errors.level && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.mana}>
      <Field.Label fontSize="md">Mana</Field.Label>
      <Input {...register('mana', { validate: validateNumber })} />
      {errors.mana && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.energy}>
      <Field.Label fontSize="md">Energia</Field.Label>
      <Input {...register('energy', { validate: validateNumber })} />
      {errors.energy && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.manaRegen}>
      <Field.Label fontSize="md">Regeneracja many</Field.Label>
      <Input {...register('manaRegen', { validate: validateNumber })} />
      {errors.manaRegen && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.energyRegen}>
      <Field.Label fontSize="md">Regeneracja energii</Field.Label>
      <Input {...register('energyRegen', { validate: validateNumber })} />
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
        {...register('proffesion', {
         required: 'To pole jest wymagane, a wartość musi być dodatnia.',
        })}
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
