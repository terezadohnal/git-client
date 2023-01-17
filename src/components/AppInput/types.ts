import { TextFieldProps } from '@mui/material';

export type AppInputProps = TextFieldProps & {
  name: string;
  unit?: string;
  float?: boolean;
};
