import { Button, Grid, Text } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { useState } from 'react';
import { ModalContainer } from './Actions/ModalContainer';

export const RepositoryFooter = () => {
  const appState = useAppState();
  const [checkoutVisible, setCheckoutVisible] = useState(false);

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
        flat
        onPress={() => setCheckoutVisible(true)}
      >
        Checkout
      </Button>
      <Text>
        <span style={{ fontWeight: 'bold' }}>On branch </span>
        {appState.status.current ?? 'loading...'}
      </Text>
    </Grid>
  );
};
