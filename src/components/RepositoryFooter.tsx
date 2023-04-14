import { Button, Grid, Row, Badge, Spacer } from '@nextui-org/react';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { formatKey } from 'helpers/globalHelpers';
import { useCallback, useEffect, useState } from 'react';
import { ModalContainer } from './Actions/ModalContainer';

export const RepositoryFooter = () => {
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const pressed = formatKey(event);
      switch (pressed) {
        case 'ShiftMetaKeyU':
          setCheckoutVisible(true);
          appStateDispatch({
            type: StateAction.SET_IS_MODAL_OPEN,
            payload: { isModalOpen: true },
          });
          break;
        case 'Escape':
          setCheckoutVisible(false);
          appStateDispatch({
            type: StateAction.SET_IS_MODAL_OPEN,
            payload: { isModalOpen: false },
          });
          break;
        default:
          break;
      }
    },
    [appStateDispatch]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Grid className="navbars repo-footer nav-background">
      <ModalContainer
        closeModal={setCheckoutVisible}
        visible={checkoutVisible}
        type="checkout"
      />
      <Button
        size="sm"
        color="secondary"
        rounded
        flat
        auto
        animated
        onPress={() => setCheckoutVisible(true)}
      >
        Checkout
      </Button>
      <Row align="center" justify="flex-end">
        <span style={{ fontWeight: 'bold' }}>On branch </span>
        <Spacer x={0.5} />
        <Badge size="md" color="warning" disableOutline>
          {appState.status.current ?? 'loading...'}
        </Badge>
      </Row>
    </Grid>
  );
};
