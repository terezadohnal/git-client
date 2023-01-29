import { FC } from 'react';
import { Button } from '@nextui-org/react';
import { AppButtonProps } from './types';

export const AppButton: FC<AppButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      //   css={[
      //     appButtonCss,
      //     props?.size === 'large' ? appButtonLargeCss : appButtonSmallCss,
      //   ]}
      {...props}
    >
      {children}
    </Button>
  );
};
