import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { MessageTypes } from 'helpers/types';
import useSnackbar from './useSnackbar';

const useBranch = () => {
  const appState = useAppState();
  const { showSnackbar } = useSnackbar();

  const mergeBranch = async (branch: string) => {
    try {
      const response = await window.electron.ipcRenderer.merge({
        path: appState.repositoryPath,
        branch,
        current: appState.status?.current ?? '',
      });
      if (response) {
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

  return { mergeBranch };
};

export default useBranch;
