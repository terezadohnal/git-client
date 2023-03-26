import { Button, Card, Col, Input, Spacer } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { MessageTypes } from 'helpers/types';
import useSnackbar from 'hooks/useSnackbar';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

type AddRemoteFormProps = {
  // eslint-disable-next-line no-unused-vars
  closeForm: (val: boolean) => void;
  onAddRemote: () => void;
};

export const AddRemoteForm: FC<AddRemoteFormProps> = ({
  closeForm,
  onAddRemote,
}) => {
  const appState = useAppState();
  const { showSnackbar } = useSnackbar();
  const { handleSubmit, register } = useForm({
    defaultValues: {
      remoteName: '',
      remoteUrl: '',
    },
  });

  const handleAddRemote = async (data: {
    remoteName: string;
    remoteUrl: string;
  }) => {
    try {
      await window.electron.ipcRenderer.addRemote({
        path: appState.repositoryPath,
        remoteName: data.remoteName,
        remoteUrl: data.remoteUrl,
      });
      onAddRemote();
      closeForm(false);
    } catch (error: any) {
      showSnackbar({
        message: error.message,
        type: MessageTypes.ERROR,
      });
    }
  };

  return (
    <Card>
      <Card.Body>
        <form onSubmit={handleSubmit(handleAddRemote)}>
          <Col>
            <Input {...register('remoteName')} label="Remote name" />
            <Input
              {...register('remoteUrl')}
              fullWidth
              name="remoteUrl"
              label="Remote URL"
            />
            <Spacer y={1} />
            <Button type="submit" size="sm" color="secondary">
              Add
            </Button>
          </Col>
        </form>
      </Card.Body>
    </Card>
  );
};
