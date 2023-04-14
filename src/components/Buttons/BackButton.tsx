import { Button } from '@nextui-org/react';
import { BackIcon } from 'components/icons/back';
import { HomeIcon } from 'components/icons/home';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { formatKey } from 'helpers/globalHelpers';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();

  const icon = useMemo(() => {
    if (location.pathname === '/repository') {
      return <HomeIcon />;
    }
    return <BackIcon />;
  }, [location.pathname]);

  const buttonText = useMemo(() => {
    if (location.pathname === '/repository') {
      return 'Home';
    }
    return 'Back';
  }, [location.pathname]);

  const onBackPress = useCallback(() => {
    if (location.pathname === '/repository') {
      window.localStorage.removeItem('repo');
      appStateDispatch({
        type: StateAction.RESET_APP_STATE,
      });
    }
    navigate(-1);
  }, [appStateDispatch, location.pathname, navigate]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const pressed = formatKey(event);
      switch (pressed) {
        case 'Escape':
          if (!appState.isModalOpen) {
            onBackPress();
          }
          break;
        default:
          break;
      }
    },
    [appState.isModalOpen, onBackPress]
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
      auto
      flat
      style={{ height: 40 }}
      onPress={onBackPress}
      icon={icon}
    >
      {buttonText}
    </Button>
  );
};
