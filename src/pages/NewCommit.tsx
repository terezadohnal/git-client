import { Button, Grid, Spacer, Text, Textarea, Table } from '@nextui-org/react';
import { AppSnackbar } from 'components/AppSnackbar';
import { BackButton } from 'components/Buttons/BackButton';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import useCommit from 'hooks/useCommit';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const NewCommit = () => {
  const appState = useAppState();
  const { createCommit } = useCommit();
  const [selectedFiles, setSelectedFiles] = useState<
    string | Set<React.Key> | null
  >(null);
  const { handleSubmit, register } = useForm({
    defaultValues: {
      message: '',
    },
  });

  const onHandleSubmit = async (data: { message: string }) => {
    await createCommit({
      files: selectedFiles,
      message: data.message,
    });
  };
  return (
    <Grid>
      <Grid
        justify="space-between"
        direction="row"
        className="header repository-header"
      >
        <BackButton />
        <Text h3>New commit</Text>
      </Grid>
      <AppSnackbar
        isOpen={!!appState.snackbar.message}
        message={appState.snackbar.message}
        alertProps={{ severity: appState.snackbar.type }}
      />
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
              onSelectionChange={setSelectedFiles}
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
              disabled={!appState.status.files}
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
