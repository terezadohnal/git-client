import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { Directory, MessageTypes } from 'helpers/types';
import { useCallback } from 'react';
import useSnackbar from './useSnackbar';

const useRepository = () => {
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();
  const { showSnackbar } = useSnackbar();

  const fetchDirectory = useCallback(async () => {
    try {
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
      appStateDispatch({
        type: StateAction.SET_STATUS,
        payload: {
          status: parsedDir.status,
        },
      });
      appStateDispatch({
        type: StateAction.SET_LOCAL_BRANCHES,
        payload: {
          localBranches: parsedDir.branches,
        },
      });
      if (parsedDir.commits.length) {
        showSnackbar({
          message: `Successfully fetched ${parsedDir.commits.length} commits`,
        });
      }
    } catch (err: any) {
      showSnackbar({
        message: err.message,
        type: MessageTypes.ERROR,
      });
    }
  }, [appState.repositoryPath, appStateDispatch, showSnackbar]);

  return { fetchDirectory };
};

export default useRepository;
