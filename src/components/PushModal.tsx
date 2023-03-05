import {
  Modal,
  Text,
  Row,
  Button,
  Col,
  Dropdown,
  Spacer,
  Loading,
} from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { FC, useMemo, useState, Key } from 'react';
import { RemoteWithRefs } from 'simple-git';
import { AddRemoteForm } from './AddRemoteForm';

type PushModalProps = {
  visible: boolean;
  remotes: RemoteWithRefs[];
  closePushModal: () => void;
  onAddRemote: () => void;
};

export const PushModal: FC<PushModalProps> = ({
  visible,
  remotes,
  closePushModal,
  onAddRemote,
}) => {
  const appState = useAppState();
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
      await window.electron.ipcRenderer.push({
        path: appState.repositoryPath,
        remoteName: selectedValue,
        branch: appState.status.current ?? '',
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      closePushModal();
    }
  };

  return (
    <Modal
      closeButton
      blur
      aria-labelledby="modal-title"
      open={visible}
      onClose={closePushModal}
    >
      <Modal.Header>
        <Text h3>Push changes</Text>
      </Modal.Header>
      <Modal.Body>
        <Text>Are you sure you want to push changes to remote repository?</Text>
        <Row>
          <Text b style={{ paddingRight: 5 }}>
            Current branch:
          </Text>
          {appState.status.current}
        </Row>
        <Col>
          <Text>Push to:</Text>
          <Dropdown>
            <Dropdown.Button flat color="secondary" css={{ tt: 'capitalize' }}>
              {selectedValue}
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
          <Spacer y={1} />
          <Button
            size="sm"
            color="secondary"
            type="button"
            bordered
            onPress={() => setShowAddRemoteForm(!showAddRemoteForm)}
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
        <Button auto flat color="secondary" rounded onPress={closePushModal}>
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
