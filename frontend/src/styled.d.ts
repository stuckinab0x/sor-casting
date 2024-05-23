import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;
    colors: {
      accent: string;
      bgMain: string;
      bgNav: string;
      bgInner1: string;
      bgInner2: string;
      bgInner3: string;
      bgTooltip: string;
      bgGreen: string;
      bgRed: string;
    }
  }
}
