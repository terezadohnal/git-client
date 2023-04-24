import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { MessageTypes } from 'helpers/types';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useRepository from './useRepository';
import useSnackbar from './useSnackbar';

const useCommit = () => {
  const appState = useAppState();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { fetchDirectory } = useRepository();

  const fetchCommitDiff = useCallback(
    async (commitHash: string, currentCommitIndex: number) => {
      try {
        return await window.electron.ipcRenderer.getCommitDiff({
          path: appState.repositoryPath,
          commitHash: commitHash || '',
          previousCommitHash:
            appState.commits[currentCommitIndex + 1]?.hash ?? '',
        });
      } catch (err: any) {
        showSnackbar({
          message: err.message,
          type: MessageTypes.ERROR,
        });
      }
      return null;
    },
    [appState.commits, appState.repositoryPath, showSnackbar]
  );

  const fetchDiff = useCallback(
    async (file: string) => {
      try {
        return await window.electron.ipcRenderer.getDiff({
          path: appState.repositoryPath,
          file,
        });
      } catch (err: any) {
        showSnackbar({
          message: err.message,
          type: MessageTypes.ERROR,
        });
      }
      return null;
    },
    [appState.repositoryPath, showSnackbar]
  );

  const createCommit = async ({
    files,
    message,
  }: {
    files: string | Set<React.Key> | null;
    message: string;
  }) => {
    try {
      const response = await window.electron.ipcRenderer.commit({
        path: appState.repositoryPath,
        files,
        message,
      });
      if (response) {
        showSnackbar({
          message: 'Commit successfully created',
        });
        navigate('/repository');
        fetchDirectory();
      }
    } catch (err: any) {
      showSnackbar({
        message: err.message,
        type: MessageTypes.ERROR,
      });
    }
  };

  return { fetchCommitDiff, fetchDiff, createCommit };
};

export default useCommit;
