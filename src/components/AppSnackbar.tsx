import { Alert, Snackbar } from '@mui/material';
import { useToggle } from 'hooks/useToggle';
import { FC, useEffect } from 'react';
import { AppSnackbarProps } from './types';

export const AppSnackbar: FC<AppSnackbarProps> = ({
  snackbarProps,
  alertProps,
  message,
  isOpen,
}) => {
  const [open, toggleOpen] = useToggle(isOpen);

  useEffect(() => {
    toggleOpen(isOpen);
  }, [isOpen, toggleOpen]);

  return (
    <Snackbar
      open={open}
      onClose={() => toggleOpen()}
      data-testid="snackbar"
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      {...snackbarProps}
      sx={{ marginTop: 10 }}
    >
      <Alert onClose={() => toggleOpen()} {...alertProps} data-testid="alert">
        {message}
      </Alert>
    </Snackbar>
  );
};
