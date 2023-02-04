import { Grid, Text } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { Directory } from 'helpers/types';
import { useCallback, useEffect } from 'react';

export const Repository = () => {
  const appState = useAppState();

  const fetchDirectory = useCallback(async () => {
    const directory = await window.electron.ipcRenderer.fetchDirectoryStatus({
      path: appState.repositoryPath,
    });
    JSON.parse(directory) as Directory;
    console.log(directory);
  }, [appState.repositoryPath]);

  useEffect(() => {
    fetchDirectory();
  }, [fetchDirectory]);

  return (
    <Grid>
      <Text h3>Repository</Text>
      <Text>{appState.repositoryPath}</Text>
    </Grid>
  );
};
