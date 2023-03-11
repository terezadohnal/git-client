import { Button, Grid, Spacer, Text, Textarea, Table } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const NewCommit = () => {
  const navigate = useNavigate();
  const appState = useAppState();
  const [selectedFiles, setSelectedFiles] = useState<
    string | Set<React.Key> | null
  >(null);
  const { handleSubmit, register, getValues } = useForm({
    defaultValues: {
      message: '',
    },
  });

  const onHandleSubmit = async (data: { message: string }) => {
    const response = await window.electron.ipcRenderer.commit({
      path: appState.repositoryPath,
      files: selectedFiles,
      message: data.message,
    });
    if (response) {
      navigate('/repository', { replace: true });
    }
  };
  return (
    <Grid>
      <Grid
        justify="space-between"
        direction="row"
        className="header repository-header"
      >
        <Button
          size="sm"
          color="secondary"
          rounded
          animated
          flat
          style={{ height: 40 }}
          onPress={() => navigate('/repository', { replace: true })}
        >
          Back
        </Button>
        <Text h3>New commit</Text>
      </Grid>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <Grid style={{ width: '100%', padding: 30 }}>
          <Text h5>Select files you want to stage</Text>
          <Spacer y={1} />
          <Grid justify="flex-start">
            <Table
              bordered
              shadow={false}
              selectionMode="multiple"
              defaultSelectedKeys="all"
              selectedKeys={selectedFiles ?? []}
              onSelectionChange={(keys) => {
                setSelectedFiles(keys);
              }}
              color="secondary"
              css={{
                height: 'auto',
                minWidth: '100%',
              }}
            >
              <Table.Header>
                <Table.Column align="center">File</Table.Column>
              </Table.Header>
              <Table.Body>
                {appState.status?.files?.map((file) => (
                  <Table.Row key={file.path}>
                    <Table.Cell
                      css={{ display: 'flex', justifyContent: 'center' }}
                    >
                      {file.path}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid>
          <Spacer y={1} />
          <Grid>
            <Text h5>Add comment</Text>
            <Spacer y={1} />
            <Textarea
              animated
              minRows={20}
              fullWidth
              required
              label="Commit message"
              helperText='Required field. Example: "Add new feature"'
              disabled={!selectedFiles}
              {...register('message')}
            />
            <Spacer y={2} />
            <Button
              size="sm"
              color="secondary"
              style={{ height: 40 }}
              type="submit"
              disabled={!appState.status.files || getValues('message') === ''}
              rounded
            >
              Commit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};
