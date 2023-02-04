import { Grid, Text } from '@nextui-org/react';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { Directory } from 'helpers/types';
import { useCallback, useEffect } from 'react';

export const Repository = () => {
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();

  const fetchDirectory = useCallback(async () => {
    const directory = await window.electron.ipcRenderer.fetchDirectoryStatus({
      path: appState.repositoryPath,
    });
    const parsedDir = JSON.parse(directory) as Directory;
    appStateDispatch({
      type: StateAction.SET_COMMITS,
      payload: {
        commits: parsedDir.commits,
      },
    });
  }, [appState, appStateDispatch]);

  console.log(appState.commits);

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
