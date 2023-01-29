import { FC } from 'react';
import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { AppInputProps } from './types';

export const AppInput: FC<AppInputProps> = ({
  name,
  type,
  placeholder,
  fullWidth,
  size = 'small',
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => {
        return (
          <TextField
            name={name}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            size={size}
            color="secondary"
            fullWidth={fullWidth}
            InputProps={{ inputProps: { color: 'white' } }}
          />
        );
      }}
    />
  );
};
