import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
 globalCss: {
  html: {
   colorPalette: 'brand',
  },
 },
 theme: {
  semanticTokens: {
   colors: {
    brand: {
     primary: { value: { _light: '#412D20', _dark: '#B2F5EA' } },
     secondary: { value: { _light: '#29190f', _dark: '#A3EDE2' } },
     solid: { value: '{colors.brand.primary}' },
     contrast: { value: { _light: '{colors.white}', _dark: '{colors.black}' } },
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
