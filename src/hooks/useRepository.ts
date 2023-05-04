import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { Directory, MessageTypes } from 'helpers/types';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useSnackbar from './useSnackbar';

const useRepository = () => {
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const openFolder = useCallback(async () => {
    const filePath = await window.electron.ipcRenderer.openDialog();
    if (!filePath) {
      return;
    }
    appStateDispatch({
      type: StateAction.SET_REPOSITORY_PATH,
      payload: {
        repositoryPath: filePath,
      },
    });
  }, [appStateDispatch]);

  const openExistingRepository = useCallback(async () => {
    const filePath = await window.electron.ipcRenderer.openDialog();
    const isRepository = await window.electron.ipcRenderer.isRepository({
      path: filePath,
    });
    if (!isRepository) {
      showSnackbar({
        message: 'This is not a valid repository',
        type: MessageTypes.ERROR,
      });
      return;
    }
    if (filePath) {
      window.localStorage.setItem('repo', filePath);
      appStateDispatch({
        type: StateAction.SET_REPOSITORY_PATH,
        payload: {
          repositoryPath: filePath,
        },
      });
    }
  }, [appStateDispatch, showSnackbar]);

  const clone = useCallback(
    async (repository: string) => {
      if (appState.repositoryPath) {
        try {
          const response = await window.electron.ipcRenderer.cloneRepository({
            remote: repository,
            target: appState.repositoryPath,
          });
          if (response) {
            window.localStorage.setItem('repo', appState.repositoryPath);
            navigate('/repository');
          }
        } catch (err: any) {
          showSnackbar({
            message: err.message,
            type: MessageTypes.ERROR,
          });
        }
      }
    },
    [appState.repositoryPath, navigate, showSnackbar]
  );

  const fetchDirectory = useCallback(
    async (skipSnackBar = true) => {
      const path = window.localStorage.getItem('repo');
      try {
        if (!path) {
          throw new Error('No repository path found');
        }
        const directory =
          await window.electron.ipcRenderer.fetchDirectoryStatus({
            path: path ?? '',
            maxCommitLoad: appState.maxCommitLoad,
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
        if (parsedDir.commits.length < appState.maxCommitLoad) {
          appStateDispatch({
            type: StateAction.SET_IS_LOAD_MORE_BUTTON_DISABLED,
          });
        }
        if (parsedDir.commits.length && !skipSnackBar) {
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
    },
    [appState.maxCommitLoad, appStateDispatch, showSnackbar]
  );

  return { fetchDirectory, openFolder, openExistingRepository, clone };
};

export default useRepository;
