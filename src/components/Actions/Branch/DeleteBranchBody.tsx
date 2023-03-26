import { Button, Loading, Modal, Table } from '@nextui-org/react';
import { DeleteBranchBodyProps } from 'components/types';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { FC, useState } from 'react';

export const DeleteBranchBody: FC<DeleteBranchBodyProps> = ({ onClose }) => {
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const mappedBranches: { key: number; name: string }[] =
    appState.localBranches.all?.map((branch, index) => {
      return {
        key: index,
        name: branch,
      };
    });

  const [selectedBranches, setSelectedBranches] = useState<
    string | Set<React.Key> | null
  >(null);

  const onDeletePress = async () => {
    try {
      setIsLoading(true);
      const response = await window.electron.ipcRenderer.deleteBranch({
        path: appState.repositoryPath,
        branches:
          selectedBranches !== 'all'
            ? selectedBranches
            : appState.localBranches.all,
      });

      if (response) {
        appStateDispatch({
          type: StateAction.SET_REPOSITORY_SUCCESS,
          payload: {
            repositorySuccess: `${
              selectedBranches === 'all' ? 'Branches' : 'Branch'
            } successfully deleted`,
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
      onClose(false);
    }
  };
  return (
    <>
      <Modal.Body>
        <Table
          css={{
            minWidth: '100%',
          }}
          compact
          shadow={false}
          bordered
          color="secondary"
          selectionMode="multiple"
          selectedKeys={selectedBranches ?? []}
          onSelectionChange={(keys) => {
            setSelectedBranches(keys);
          }}
        >
          <Table.Header>
            <Table.Column align="center">Branch name</Table.Column>
          </Table.Header>
          <Table.Body items={mappedBranches}>
            {(item) => (
              <Table.Row key={item.name}>
                <Table.Cell css={{ display: 'flex', justifyContent: 'center' }}>
                  {item.name}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
          <Table.Pagination
            shadow
            noMargin
            align="center"
            rowsPerPage={4}
            rounded
            onlyDots
            size="sm"
          />
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          flat
          color="secondary"
          rounded
          onPress={() => onClose(false)}
        >
          Close
        </Button>
        <Button
          auto
          color="secondary"
          rounded
          type="button"
          disabled={isLoading}
          onPress={onDeletePress}
        >
          {isLoading ? <Loading size="sm" type="points" /> : 'Delete'}
        </Button>
      </Modal.Footer>
    </>
  );
};
