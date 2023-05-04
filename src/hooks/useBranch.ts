import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { MessageTypes } from 'helpers/types';
import useSnackbar from './useSnackbar';
import useRepository from './useRepository';

const useBranch = () => {
  const appState = useAppState();
  const { showSnackbar } = useSnackbar();
  const { fetchDirectory } = useRepository();

  const mergeBranch = async (branch: string) => {
    try {
      const response = await window.electron.ipcRenderer.merge({
        path: appState.repositoryPath,
        branch,
        current: appState.status?.current ?? '',
      });
      if (response) {
        fetchDirectory();
        showSnackbar({
          message: `Branch ${branch} successfully merged`,
        });
      }
    } catch (err: any) {
      showSnackbar({
        message: err.message,
        type: MessageTypes.ERROR,
      });
    }
  };

  const createBranch = async (
    name: string,
    commit: string,
    checkout: boolean
  ) => {
    try {
      const response = await window.electron.ipcRenderer.createBranch({
        path: appState.repositoryPath,
        name: name ?? '',
        commit,
        checkout,
      });
      if (response) {
        fetchDirectory();
        showSnackbar({
          message: `Branch ${name} successfully created`,
        });
      }
    } catch (error: any) {
      showSnackbar({
        message: error.message,
        type: MessageTypes.ERROR,
      });
    }
  };

  const deleteBranch = async (branches: string | Set<React.Key> | null) => {
    try {
      const response = await window.electron.ipcRenderer.deleteBranch({
        path: appState.repositoryPath,
        branches: branches !== 'all' ? branches : appState.localBranches.all,
      });

      if (response) {
        fetchDirectory();
        showSnackbar({
          message: `${
            branches === 'all' ? 'Branches' : 'Branch'
          } successfully deleted`,
        });
      }
    } catch (error: any) {
      showSnackbar({
        message: error.message,
        type: MessageTypes.ERROR,
      });
    }
  };

  return { mergeBranch, createBranch, deleteBranch };
};

export default useBranch;
