import { Button } from '@nextui-org/react';
import {
  StateAction,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { formatKey } from 'helpers/globalHelpers';
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appStateDispatch = useAppStateDispatch();

  const onBackPress = useCallback(() => {
    if (location.pathname === '/repository') {
      window.localStorage.removeItem('repo');
      appStateDispatch({
        type: StateAction.SET_REPOSITORY_PATH,
        payload: {
          repositoryPath: '',
        },
      });
    }
    navigate(-1);
  }, [appStateDispatch, location.pathname, navigate]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const pressed = formatKey(event);
      switch (pressed) {
        case 'MetaKeyB':
          onBackPress();
          break;
        default:
          break;
      }
    },
    [onBackPress]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Button
      size="sm"
      color="secondary"
      rounded
      animated
      flat
      style={{ height: 40 }}
      onPress={onBackPress}
    >
      Back
    </Button>
  );
};
