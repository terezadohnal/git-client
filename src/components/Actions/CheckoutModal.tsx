import {
  Button,
  Dropdown,
  Loading,
  Modal,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import { CheckoutModalProps } from 'components/types';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { FC, Key, useMemo, useState } from 'react';

export const CheckoutModal: FC<CheckoutModalProps> = ({
  closeCheckoutModal,
  visible,
  remoteBranches,
}) => {
  const appState = useAppState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState<Set<Key> | string>(
    new Set([''])
  );
  const [selectedRemote, setSelectedRemote] = useState<Set<Key> | string>(
    new Set([''])
  );

  const selectedLocalVal = useMemo(
    () => Array.from(selectedLocal).join(', ').replaceAll('_', ' '),
    [selectedLocal]
  );
  const selectedRemoteVal = useMemo(
    () => Array.from(selectedRemote).join(', ').replaceAll('_', ' '),
    [selectedRemote]
  );

  console.log(remoteBranches);

  const onCheckoutPress = () => {
    try {
      setIsLoading(true);
      console.log('checkout');
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
      closeCheckoutModal(false);
    }
  };
  return (
    <Modal
      closeButton
      blur
      open={visible}
      onClose={() => closeCheckoutModal(false)}
    >
      <Modal.Header>
        <Text h3>Checkout Branch</Text>
      </Modal.Header>
      <Modal.Body>
        <Row align="center" justify="space-between">
          <Text>Checkout local:</Text>
          <Spacer x={0.5} />
          <Dropdown>
            <Dropdown.Button color="secondary" size="sm" flat rounded>
              <div style={{ width: '150px' }} className="textOverflow">
                {selectedLocalVal || 'Select branch'}
              </div>
            </Dropdown.Button>
            <Dropdown.Menu
              color="secondary"
              selectionMode="single"
              selectedKeys={selectedLocal}
              onSelectionChange={setSelectedLocal}
            >
              {appState.localBranches?.all?.map((branch) => (
                <Dropdown.Item
                  css={{
                    width: '150px',
                  }}
                  className="textOverflow"
                  showFullDescription
                  key={branch}
                >
                  <Text>{branch}</Text>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Row>
        <Row align="center" justify="space-between">
          <Text>Checkout remote:</Text>
          <Spacer x={0.5} />
          <Dropdown>
            <Dropdown.Button color="secondary" size="sm" flat rounded>
              <div style={{ width: '150px' }} className="textOverflow">
                {selectedRemoteVal || 'Select branch'}
              </div>
            </Dropdown.Button>
            <Dropdown.Menu
              color="secondary"
              selectionMode="single"
              selectedKeys={selectedRemote}
              onSelectionChange={setSelectedRemote}
            >
              {remoteBranches.map((branch) => (
                <Dropdown.Item
                  css={{
                    width: '250px',
                  }}
                  className="textOverflow"
                  showFullDescription
                  key={branch}
                >
                  {branch}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          flat
          color="secondary"
          rounded
          onPress={() => closeCheckoutModal(false)}
        >
          Close
        </Button>
        <Button
          auto
          color="secondary"
          rounded
          type="button"
          disabled={isLoading}
          onPress={onCheckoutPress}
        >
          {isLoading ? <Loading size="sm" type="points" /> : 'Merge'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
