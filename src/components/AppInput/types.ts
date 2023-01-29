import { InputProps } from '@nextui-org/react';

export type AppInputProps = InputProps & {
  name: string;
  unit?: string;
  float?: boolean;
};
