import { FC } from 'react';
import { Button } from '@mui/material';
import { AppButtonProps } from './types';

export const AppButton: FC<AppButtonProps> = ({
  component = 'button',
  children,
  ...props
}) => {
  return (
    <Button
      //   css={[
      //     appButtonCss,
      //     props?.size === 'large' ? appButtonLargeCss : appButtonSmallCss,
      //   ]}
      component={component}
      {...props}
    >
      {children}
    </Button>
  );
};
