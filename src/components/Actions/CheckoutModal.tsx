import {
  Button,
  Col,
  Dropdown,
  Loading,
  Modal,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import { CheckoutModalProps } from 'components/types';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { MessageTypes } from 'helpers/types';
import useRepository from 'hooks/useRepository';
import useSnackbar from 'hooks/useSnackbar';
import { FC, Key, useMemo, useState } from 'react';

export const CheckoutModal: FC<CheckoutModalProps> = ({
  closeCheckoutModal,
  visible,
  remoteBranches,
}) => {
  const appState = useAppState();
  const { showSnackbar } = useSnackbar();
  const { fetchDirectory } = useRepository();
  const [isLoading, setIsLoading] = useState(false);
  const [isRemote, setIsRemote] = useState(false);
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

  const onCheckoutPress = async () => {
    try {
      setIsLoading(true);
      const response = await window.electron.ipcRenderer.checkout({
        path: appState.repositoryPath,
        branch: isRemote ? selectedRemoteVal : selectedLocalVal,
        isRemote,
      });
      if (response) {
        showSnackbar({
          message: response,
        });
      } else {
        showSnackbar({
          message: `Branch ${
            isRemote ? selectedRemoteVal : selectedLocalVal
          } successfully checked out`,
        });
      }
      await fetchDirectory();
    } catch (err: any) {
      showSnackbar({
        message: err.message,
        type: MessageTypes.ERROR,
      });
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
        <Col>
          <Text h3>Checkout Branch</Text>
          <Button.Group size="sm" color="secondary" rounded bordered>
            <Button
              animated
              onPress={() => {
                setIsRemote(false);
                setSelectedRemote(new Set(['']));
              }}
              css={!isRemote ? { backgroundColor: '$purple200' } : {}}
            >
              Checkout local
            </Button>
            <Button
              animated
              onPress={() => {
                setIsRemote(true);
                setSelectedLocal(new Set(['']));
              }}
              css={isRemote ? { backgroundColor: '$purple200' } : {}}
            >
              Checkout remote
            </Button>
          </Button.Group>
        </Col>
      </Modal.Header>
      <Modal.Body>
        {isRemote ? (
          <Row align="center" justify="space-between">
            <Text>Checkout remote:</Text>
            <Spacer x={0.5} />
            <Dropdown>
              <Dropdown.Button color="secondary" size="sm" flat>
                <div style={{ width: '150px' }} className="textOverflow">
                  {selectedRemoteVal || 'Select remote branch'}
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
                      maxWidth: '250px',
                    }}
                    className="textOverflow"
                    showFullDescription
                    key={branch}
                    textValue={branch}
                  >
                    {branch}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Row>
        ) : (
          <Row align="center" justify="space-between">
            <Text>Checkout local:</Text>
            <Spacer x={0.5} />
            <Dropdown>
              <Dropdown.Button color="secondary" size="sm" flat>
                <div style={{ width: '150px' }} className="textOverflow">
                  {selectedLocalVal || 'Select local branch'}
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
                      maxWidth: '250px',
                    }}
                    className="textOverflow"
                    showFullDescription
                    key={branch}
                    textValue={branch}
                  >
                    <Text>{branch}</Text>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Row>
        )}
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
          {isLoading ? <Loading size="sm" type="points" /> : 'Checkout'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
