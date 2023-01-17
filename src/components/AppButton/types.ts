import { ButtonProps } from '@mui/material';

export type AppButtonProps = ButtonProps & {
  component?: ButtonProps['LinkComponent'];
};
