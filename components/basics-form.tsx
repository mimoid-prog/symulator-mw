'use client';
import { Heading } from '@chakra-ui/react';
import {
 Input,
 Stack,
 Button,
 Box,
 Field,
 Text,
 Select,
 Portal,
 createListCollection,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { Controller, useForm } from 'react-hook-form';
import proffesions from '../data/proffesions';
import { BasicsFormValues } from '../types/BasicsFormValues';
import store from '@/lib/Store';
import { useState } from 'react';

export const BasicsForm = observer(() => {
 const {
  register,
  handleSubmit,
  control,

  formState: { errors },
 } = useForm<BasicsFormValues>({ defaultValues: store.basicsFormValues });

 const [saveNoticeActive, setSaveNoticeActive] = useState(false);

 const proffesionCollection = createListCollection({
  items: proffesions,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
 });

 const validateNumber = (v: string) =>
  v === '' || Number.isNaN(Number(v)) || Number(v) < 0
   ? 'To pole jest wymagane, a wartość musi być dodatnia.'
   : true;

 const onSubmit = (data: BasicsFormValues) => {
  store.saveBasics(data);

  if (saveNoticeActive) {
   setSaveNoticeActive(false);
   requestAnimationFrame(() => setSaveNoticeActive(true));
  } else {
   setSaveNoticeActive(true);
  }
 };

 return (
  <Box>
   <form onSubmit={handleSubmit(onSubmit)}>
    <Stack gap="12px">
     <Heading size="xl">Podstawowe informacje</Heading>
     <Field.Root invalid={!!errors.level}>
      <Field.Label fontSize="md">Poziom postaci</Field.Label>
      <Input
       fontSize="md"
       _placeholder={{ fontSize: 'md' }}
       {...register('level', { validate: validateNumber })}
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
       fontSize="md"
       _placeholder={{ fontSize: 'md' }}
       {...register('mana', { validate: validateNumber })}
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
       fontSize="md"
       _placeholder={{ fontSize: 'md' }}
       {...register('energy', { validate: validateNumber })}
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
       fontSize="md"
       _placeholder={{ fontSize: 'md' }}
       {...register('manaRegen', { validate: validateNumber })}
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
       fontSize="md"
       _placeholder={{ fontSize: 'md' }}
       {...register('energyRegen', { validate: validateNumber })}
      />
      {errors.energyRegen && (
       <Field.HelperText>
        To pole jest wymagane, a wartość musi być dodatnia.
       </Field.HelperText>
      )}
     </Field.Root>

     <Field.Root invalid={!!errors.proffesion}>
      <Field.Label fontSize="md">Profesja</Field.Label>
      <Controller
       control={control}
       name="proffesion"
       rules={{ required: 'To pole jest wymagane.' }}
       render={({ field }) => (
        <Select.Root
         size="md"
         name={field.name}
         collection={proffesionCollection}
         value={field.value ? [field.value] : []}
         onValueChange={({ value }) => field.onChange(value[0])}
         onInteractOutside={() => field.onBlur?.()}
        >
         <Select.HiddenSelect />
         <Select.Control>
          <Select.Trigger>
           <Select.ValueText fontSize="md" placeholder="Wybierz profesję" />
          </Select.Trigger>
          <Select.IndicatorGroup>
           <Select.Indicator />
          </Select.IndicatorGroup>
         </Select.Control>
         <Portal>
          <Select.Positioner>
           <Select.Content
            bg={{ _light: 'white' }}
            borderWidth={{ _light: '1px' }}
            borderColor={{ _light: 'gray.300' }}
            rounded={{ _light: 'md' }}
            shadow={{ _light: 'md' }}
           >
            {proffesionCollection.items.map((item) => (
             <Select.Item item={item} key={item.value}>
              <Select.ItemText>{item.label}</Select.ItemText>
              <Select.ItemIndicator />
             </Select.Item>
            ))}
           </Select.Content>
          </Select.Positioner>
         </Portal>
        </Select.Root>
       )}
      />
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
     <Text
      fontSize="sm"
      fontStyle="italic"
      mt="2"
      color="gray.500"
      opacity={0}
      animation={
       saveNoticeActive ? 'mw-fade-in-out 2s ease-in-out forwards' : 'none'
      }
      onAnimationEnd={() => setSaveNoticeActive(false)}
     >
      Zapisano
     </Text>
    </Box>
   </form>
  </Box>
 );
});
