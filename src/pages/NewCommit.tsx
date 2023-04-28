import {
  Button,
  Grid,
  Spacer,
  Text,
  Textarea,
  Table,
  Collapse,
} from '@nextui-org/react';
import { AppSnackbar } from 'components/AppSnackbar';
import { BackButton } from 'components/Buttons/BackButton';
import { RenderDiffFile } from 'components/RenderDiffFile';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { CommitDiffDTO, DiffFile } from 'helpers/types';
import useCommit from 'hooks/useCommit';
import useRepository from 'hooks/useRepository';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// @ts-ignore
import { parseDiff } from 'react-diff-view';
import { EyeIcon } from 'components/icons/eye';

export const NewCommit = () => {
  const appState = useAppState();
  const { createCommit, fetchDiff } = useCommit();
  const { fetchDirectory } = useRepository();
  const [commitDiff, setCommitDiff] = useState<CommitDiffDTO | null>(null);
  const diff = parseDiff(commitDiff?.diff ?? '');
  const [selectedFiles, setSelectedFiles] = useState<
    string | Set<React.Key> | null
  >(null);
  const { handleSubmit, register } = useForm({
    defaultValues: {
      message: '',
    },
  });

  const refetch = useCallback(async () => {
    await fetchDirectory();
  }, [fetchDirectory]);

  const fetchDiffs = useCallback(
    async (path: string) => {
      const response = await fetchDiff(path);
      if (response) {
        const parsedResponse = JSON.parse(response) as CommitDiffDTO;
        setCommitDiff(parsedResponse);
      }
    },
    [fetchDiff]
  );

  useEffect(() => {
    window.electron.ipcRenderer.onAppFocus(() => {
      refetch();
    });
    return () => {
      window.electron.ipcRenderer.removeFocusEventListener();
    };
  }, [refetch]);

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
        className=" navbars repo-header nav-background"
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
                <Table.Column align="start">File</Table.Column>
                <Table.Column align="start">Show diff</Table.Column>
              </Table.Header>
              <Table.Body>
                {appState.status?.files?.map((file) => (
                  <Table.Row key={file.path}>
                    <Table.Cell
                      css={{
                        display: 'flex',
                        justifyContent: 'left',
                        alignItems: 'center',
                        height: '50px',
                      }}
                    >
                      {file.path}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="secondary"
                        flat
                        style={{ height: 30 }}
                        type="button"
                        auto
                        rounded
                        icon={<EyeIcon />}
                        onClick={() => {
                          fetchDiffs(file.path);
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid>
          <Spacer y={1} />
          {diff && (
            <Grid style={{ height: '100%', width: '100%' }}>
              <Spacer y={1} />
              <Text h5>Latest changes in file</Text>
              <Spacer y={1} />
              <Collapse.Group accordion shadow aria-label="Render diff files">
                {diff.map((file: DiffFile) => (
                  <RenderDiffFile file={file} key={file.newPath} expanded />
                ))}
              </Collapse.Group>
            </Grid>
          )}
          <Spacer y={1} />
          <Grid>
            <Text h5>Add comment</Text>
            <Spacer y={1} />
            <Textarea
              animated
              minRows={5}
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
              disabled={!appState.status?.files.length}
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
