import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Loading,
  Modal,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import useBranch from 'hooks/useBranch';
import { FC, Key, useMemo, useState } from 'react';
import { MergeModalProps } from '../types';

export const MergeModal: FC<MergeModalProps> = ({
  visible,
  closeMergeModal,
}) => {
  const appState = useAppState();
  const { mergeBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<Set<Key> | string>(new Set(['']));

  const selectedValue = useMemo(
    () => Array.from(selected).join(', ').replaceAll('_', ' '),
    [selected]
  );

  const onMergePress = async () => {
    try {
      setIsLoading(true);
      await mergeBranch(selectedValue);
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
          <Row align="center" justify="space-between">
            <Text>Select branch:</Text>
            <Spacer x={0.5} />
            <Dropdown>
              <Dropdown.Button color="secondary" flat>
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
          <Card variant="flat">
            <Card.Body>
              <Row align="center">
                Merge to current branch:
                <Spacer x={0.5} />
                <Badge size="md" color="warning" disableOutline>
                  {appState.status.current}
                </Badge>
              </Row>
            </Card.Body>
          </Card>
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
