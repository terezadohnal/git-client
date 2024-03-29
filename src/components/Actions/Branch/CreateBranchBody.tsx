import {
  Modal,
  Text,
  Row,
  Dropdown,
  Spacer,
  Checkbox,
  Button,
  Loading,
  Input,
} from '@nextui-org/react';
import { CreateBranchBodyProps } from 'components/types';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import useBranch from 'hooks/useBranch';
import useRepository from 'hooks/useRepository';
import { FC, Key, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateBranchBody: FC<CreateBranchBodyProps> = ({ onClose }) => {
  const appState = useAppState();
  const { createBranch } = useBranch();
  const { fetchDirectory } = useRepository();
  const [isLoading, setIsLoading] = useState(false);
  const [specificCommit, setSpecificCommit] = useState(false);
  const [checkout, setCheckout] = useState(true);
  const [selected, setSelected] = useState<Set<Key> | string>(new Set(['']));
  const { handleSubmit, register, getValues } = useForm({
    defaultValues: {
      name: '',
    },
  });
  const selectedValue = useMemo(
    () => Array.from(selected).join(', ').replaceAll('_', ' '),
    [selected]
  );

  const onCreateBranchPress = async (data?: { name: string }) => {
    try {
      setIsLoading(true);
      if (!data?.name) return;
      await createBranch(data?.name, selectedValue, checkout);
    } finally {
      await fetchDirectory();
      setIsLoading(false);
      onClose(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onCreateBranchPress)}>
      <Modal.Body>
        <Text h5>Create new branch</Text>
        <Input fullWidth label="Name" animated {...register('name')} />
        <Row align="center">
          <Checkbox
            size="sm"
            style={{ width: '100%' }}
            color="secondary"
            onChange={() => {
              setSpecificCommit(!specificCommit);
              if (specificCommit) setSelected(new Set(['']));
            }}
          >
            Specific commit:
          </Checkbox>
          <Spacer x={1} />
          <Dropdown>
            <Dropdown.Button disabled={!specificCommit} color="secondary">
              <div style={{ width: '150px' }} className="textOverflow">
                {selectedValue}
              </div>
            </Dropdown.Button>
            <Dropdown.Menu
              color="secondary"
              selectionMode="single"
              selectedKeys={selected}
              onSelectionChange={setSelected}
            >
              {appState.commits.map((commit) => (
                <Dropdown.Item
                  css={{
                    width: '230px',
                  }}
                  className="textOverflow"
                  showFullDescription
                  key={commit.hash}
                >
                  <Text>{commit.message}</Text>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Row>
        <Checkbox
          defaultSelected
          size="sm"
          color="secondary"
          onChange={() => setCheckout(!checkout)}
        >
          Checkout new branch
        </Checkbox>
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
          type="submit"
          disabled={isLoading || !getValues('name') || !checkout}
        >
          {isLoading ? <Loading size="sm" type="points" /> : 'Create Branch'}
        </Button>
      </Modal.Footer>
    </form>
  );
};
