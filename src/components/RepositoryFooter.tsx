import { Button, Grid, Row, Badge, Spacer } from '@nextui-org/react';
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
