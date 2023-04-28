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

  const setIsModalOpen = useCallback(
    (value: boolean) => {
      appStateDispatch({
        type: StateAction.SET_IS_MODAL_OPEN,
        payload: { isModalOpen: value },
      });
    },
    [appStateDispatch]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const pressed = formatKey(event);
      if (pressed === 'Escape' && appState.isModalOpen) {
        setCheckoutVisible(false);
        setIsModalOpen(false);
      }
    },
    [appState.isModalOpen, setIsModalOpen]
  );

  useEffect(() => {
    window.electron.ipcRenderer.onCommitOpen((_, value) => {
      if (value === 'checkout') {
        setCheckoutVisible(true);
        setIsModalOpen(true);
      }
    });
  }, [setIsModalOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Grid
      style={{ padding: '15px' }}
      className="navbars repo-footer nav-background"
    >
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
