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
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { FC, Key, useMemo, useState } from 'react';
import { PullModalProps } from './types';

export const PullModal: FC<PullModalProps> = ({
  visible,
  remotes,
  remoteBranches,
  closePullModal,
}) => {
  const appState = useAppState();
  const [selected, setSelected] = useState<Set<Key> | 'all'>(
    new Set([remotes[0].name])
  );
  const [selectedRemote, setSelectedRemote] = useState<Set<Key> | string>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectedValue = useMemo(
    () => Array.from(selected).join(', ').replaceAll('_', ' '),
    [selected]
  );
  const selectedRemoteBranch = useMemo(
    () => Array.from(selectedRemote).join(', ').replaceAll('_', ' '),
    [selectedRemote]
  );

  const filteredRemoteBranches = useMemo(() => {
    return remoteBranches.filter((branch) =>
      branch.split('/').includes(selectedValue)
    );
  }, [remoteBranches, selectedValue]);

  const onPullPress = async () => {
    try {
      setIsLoading(true);
      const response = await window.electron.ipcRenderer.pull({
        path: appState.repositoryPath,
        remoteName: selectedValue,
        remoteBranch: selectedRemoteBranch,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      closePullModal(false);
    }
  };

  return (
    <Modal
      closeButton
      blur
      open={visible}
      onClose={() => closePullModal(false)}
    >
      <Modal.Header>
        <Text h3>Pull changes</Text>
      </Modal.Header>
      <Modal.Body>
        <Col>
          <Row align="center">
            <Text h5>Pull from repository:</Text>
            <Spacer x={0.5} />
            <Dropdown>
              <Dropdown.Button
                flat
                color="secondary"
                css={{ tt: 'capitalize' }}
              >
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
          </Row>
          <Spacer y={1} />
          <Row>
            <Text h5>Remote branch to pull:</Text>
            <Spacer x={0.5} />
            <Dropdown>
              <Dropdown.Button
                flat
                color="secondary"
                css={{ tt: 'capitalize' }}
              >
                {selectedRemoteBranch}
              </Dropdown.Button>
              <Dropdown.Menu
                color="secondary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedRemote}
                onSelectionChange={(keys) => setSelectedRemote(keys)}
              >
                {filteredRemoteBranches.map((r) => (
                  <Dropdown.Item key={r}>{r}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Row>
          <Spacer y={1} />
          <Row align="center">
            <Text h5 style={{ marginBottom: 0 }}>
              Pull into local branch:
            </Text>
            <Spacer x={0.5} />
            <Text>{appState.status.current}</Text>
          </Row>
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          flat
          color="secondary"
          rounded
          onPress={() => closePullModal(false)}
        >
          Close
        </Button>
        <Button
          auto
          color="secondary"
          rounded
          type="button"
          disabled={isLoading}
          onPress={onPullPress}
        >
          {isLoading ? <Loading size="sm" type="points" /> : 'Pull'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
