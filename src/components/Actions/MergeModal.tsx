import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Loading,
  Modal,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { FC, Key, useMemo, useState } from 'react';
import { MergeModalProps } from '../types';

export const MergeModal: FC<MergeModalProps> = ({
  visible,
  closeMergeModal,
}) => {
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [checkout, setCheckout] = useState(true);
  const [selected, setSelected] = useState<Set<Key> | string>(new Set(['']));

  const selectedValue = useMemo(
    () => Array.from(selected).join(', ').replaceAll('_', ' '),
    [selected]
  );

  const onMergePress = async () => {
    try {
      setIsLoading(true);
      const response = await window.electron.ipcRenderer.merge({
        path: appState.repositoryPath,
        branch: selectedValue,
        current: appState.status?.current ?? '',
      });
      if (response) {
        appStateDispatch({
          type: StateAction.SET_REPOSITORY_SUCCESS,
          payload: {
            repositorySuccess: `Branch ${selectedValue} successfully merged`,
          },
        });
      }
    } catch (error: any) {
      appStateDispatch({
        type: StateAction.SET_REPOSITORY_ERROR,
        payload: {
          repositoryError: error.message,
        },
      });
    } finally {
      setIsLoading(false);
      closeMergeModal(false);
    }
  };

  return (
    <Modal
      closeButton
      blur
      open={visible}
      onClose={() => closeMergeModal(false)}
    >
      <Modal.Header>
        <Text h3>Merge branches</Text>
      </Modal.Header>
      <Modal.Body>
        <Col>
          <Row align="center">
            <Text>Select branch:</Text>
            <Spacer x={0.5} />
            <Dropdown>
              <Dropdown.Button color="secondary" flat rounded>
                <div style={{ width: '150px' }} className="textOverflow">
                  {selectedValue || 'Select..'}
                </div>
              </Dropdown.Button>
              <Dropdown.Menu
                color="secondary"
                selectionMode="single"
                disabledKeys={[`${appState.status?.current}`]}
                selectedKeys={selected}
                onSelectionChange={setSelected}
              >
                {appState.localBranches?.all?.map((branch) => (
                  <Dropdown.Item
                    css={{
                      width: '230px',
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
          <Spacer y={1} />
          <Checkbox
            size="sm"
            color="secondary"
            defaultSelected
            onChange={() => setCheckout(!checkout)}
          >
            Merge to current branch:
            <Spacer x={0.5} />
            <Text weight="bold">{appState.status.current}</Text>
          </Checkbox>
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          flat
          color="secondary"
          rounded
          onPress={() => closeMergeModal(false)}
        >
          Close
        </Button>
        <Button
          auto
          color="secondary"
          rounded
          type="button"
          disabled={isLoading}
          onPress={onMergePress}
        >
          {isLoading ? <Loading size="sm" type="points" /> : 'Merge'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
