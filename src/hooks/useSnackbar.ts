import {
  StateAction,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { MessageTypes, Snackbar } from 'helpers/types';
import { useCallback } from 'react';

const useSnackbar = () => {
  const appStateDispatch = useAppStateDispatch();

  const showSnackbar = useCallback(
    ({ message, type = MessageTypes.SUCCESS }: Snackbar) => {
      appStateDispatch({
        type: StateAction.SET_SNACKBAR,
        payload: {
          snackbar: {
            message,
            type,
          },
        },
      });
      setTimeout(() => {
        appStateDispatch({
          type: StateAction.SET_SNACKBAR,
          payload: {
            snackbar: {
              message: '',
              type,
            },
          },
        });
      }, 3000);
    },
    [appStateDispatch]
  );

  return { showSnackbar };
};

export default useSnackbar;
