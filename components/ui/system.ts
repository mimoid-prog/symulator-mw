import {
 createSystem,
 defaultConfig,
 defineConfig,
 defineRecipe,
} from '@chakra-ui/react';

const config = defineConfig({
 theme: {
  recipes: {
   button: defineRecipe({
    base: {
     fontWeight: '700',
    },
   }),
  },
  semanticTokens: {
   colors: {
    brand: {
     primary: {
      value: { _light: '{colors.yellow.900}', _dark: '{colors.teal.300}' },
     },
     secondary: {
      value: { _light: '{colors.yellow.800}', _dark: '{colors.teal.200}' },
     },
     solid: { value: '{colors.brand.primary}' },
     contrast: {
      value: { _light: '{colors.white}', _dark: '{colors.gray.800}' },
     },
     fg: { value: '{colors.brand.primary}' },
     muted: { value: '{colors.brand.primary}' },
     subtle: { value: '{colors.brand.primary}' },
     emphasized: { value: '{colors.brand.primary}' },
     focusRing: { value: '{colors.brand.primary}' },
    },
   },
  },
 },
});

export const system = createSystem(defaultConfig, config);
