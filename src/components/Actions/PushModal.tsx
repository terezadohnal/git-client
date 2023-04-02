import {
  Modal,
  Text,
  Row,
  Button,
  Col,
  Dropdown,
  Spacer,
  Loading,
  Badge,
  Card,
} from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { MessageTypes } from 'helpers/types';
import useSnackbar from 'hooks/useSnackbar';
import { FC, useMemo, useState, Key } from 'react';
import { AddRemoteForm } from '../AddRemoteForm';
import { PushModalProps } from '../types';

export const PushModal: FC<PushModalProps> = ({
  visible,
  remotes,
  closePushModal,
  onAddRemote,
}) => {
  const appState = useAppState();
  const { showSnackbar } = useSnackbar();
  const [selected, setSelected] = useState<Set<Key> | 'all'>(
    new Set([remotes[0].name])
  );
  const [showAddRemoteForm, setShowAddRemoteForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedValue = useMemo(
    () => Array.from(selected).join(', ').replaceAll('_', ' '),
    [selected]
  );

  const onPushPress = async () => {
    try {
      setIsLoading(true);
      const response = await window.electron.ipcRenderer.push({
        path: appState.repositoryPath,
        remoteName: selectedValue,
        branch: appState.status.current ?? '',
      });
      if (response) {
        showSnackbar({
          message: `Successfully pushed to ${selectedValue}`,
        });
      }
    } catch (error: any) {
      showSnackbar({
        message: error.message,
        type: MessageTypes.ERROR,
      });
    } finally {
      setIsLoading(false);
      closePushModal(false);
    }
  };

  return (
    <Modal
      closeButton
      blur
      aria-labelledby="modal-title"
      open={visible}
      onClose={() => closePushModal(false)}
    >
      <Modal.Header>
        <Text h3>Push changes</Text>
      </Modal.Header>
      <Modal.Body>
        <Card variant="flat">
          <Card.Body>
            <Text>
              Are you sure you want to push changes to remote repository?
            </Text>
            <Row>
              <Text b style={{ paddingRight: 5 }}>
                Current branch:
              </Text>
              <Badge size="md" color="warning" disableOutline>
                {appState.status.current}
              </Badge>
            </Row>
          </Card.Body>
        </Card>
        <Col>
          <Row align="center" justify="space-between">
            <Text>Push to:</Text>
            <Spacer x={1} />
            <Dropdown>
              <Dropdown.Button
                flat
                color="secondary"
                css={{ tt: 'capitalize' }}
              >
                <div style={{ width: '150px' }} className="textOverflow">
                  {selectedValue || 'Remote'}
                </div>
              </Dropdown.Button>
              <Dropdown.Menu
                color="secondary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selected}
                onSelectionChange={(keys) => setSelected(keys)}
              >
                {remotes.map((r) => (
                  <Dropdown.Item key={r.name}>{r.name}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Row>
          <Spacer y={1} />
          <Button
            size="sm"
            color="secondary"
            type="button"
            bordered
            onPress={() => setShowAddRemoteForm(!showAddRemoteForm)}
            css={{ transition: 'all 1s ease-out' }}
          >
            Add new remote
          </Button>
          <Spacer y={1} />
          {showAddRemoteForm && (
            <AddRemoteForm
              closeForm={setShowAddRemoteForm}
              onAddRemote={onAddRemote}
            />
          )}
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          flat
          color="secondary"
          rounded
          onPress={() => closePushModal(false)}
        >
          Close
        </Button>
        <Button
          auto
          color="secondary"
          rounded
          type="button"
          disabled={isLoading}
          onPress={onPushPress}
        >
          {isLoading ? <Loading size="sm" type="points" /> : 'Push'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
