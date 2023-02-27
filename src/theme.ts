import { createTheme } from '@nextui-org/react';

export const theme = createTheme({
  type: 'light',
  theme: {
    colors: {
      primaryLight: '$green200',
      primaryLightHover: '$green300',
      primaryLightActive: '$green400',
      primaryLightContrast: '$green600',
      primary: '#abc9e9',
      primaryBorder: '$green500',
      primaryBorderHover: '$green600',
      primarySolidHover: '$green700',
      primarySolidContrast: '$white',
      primaryShadow: '#abc9e9',
      gradient: 'linear-gradient(201deg,#caefd7 -19%,#f5bfd7 42%,#abc9e9 79%)',
      link: '#5E1DAD',
    },
  },
});
