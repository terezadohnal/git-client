import { FC } from 'react';
import { Input } from '@nextui-org/react';
import { Controller, useFormContext } from 'react-hook-form';
import { AppInputProps } from './types';

export const AppInput: FC<AppInputProps> = ({
  name,
  type,
  placeholder,
  fullWidth,
  size = 'md',
  ...props
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Input
            {...field}
            name={name}
            type={type}
            placeholder={placeholder}
            fullWidth={fullWidth}
            size={size}
            {...props}
          />
        );
      }}
    />
  );
};
