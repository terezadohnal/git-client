import { FC } from 'react';
import { TextField } from '@mui/material';
import { AppInputProps } from './types';

export const AppInput: FC<AppInputProps> = ({
  name,
  onChange,
  type,
  placeholder,
  fullWidth,
  size = 'small',
}) => {
  return (
    <TextField
      name={name}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      size={size}
      color="secondary"
      fullWidth={fullWidth}
    />
  );
};
