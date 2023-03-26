import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { FC, useCallback, useEffect, useState } from 'react';
import { RemoteWithRefs } from 'simple-git';
import { PullModal } from './PullModal';
import { PushModal } from './PushModal';
import { ModalContainerProps } from '../types';
import { CheckoutModal } from './CheckoutModal';

export const ModalContainer: FC<ModalContainerProps> = ({
  visible,
  closeModal,
  type,
}) => {
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();
  const [remotes, setRemotes] = useState<RemoteWithRefs[]>([]);
  const [remoteBranches, setRemoteBranches] = useState<string[]>([]);

  const getRemotes = useCallback(async () => {
    try {
      const response = await window.electron.ipcRenderer.getRemote({
        path: appState.repositoryPath,
      });
      const getRemotesBranches =
        await window.electron.ipcRenderer.getRemoteBranches({
          path: appState.repositoryPath,
        });

      setRemotes(response);
      setRemoteBranches(getRemotesBranches.all);
    } catch (error: any) {
      appStateDispatch({
        type: StateAction.SET_REPOSITORY_ERROR,
        payload: {
          repositoryError: error.message,
        },
      });
    }
  }, [appState.repositoryPath, appStateDispatch]);

  useEffect(() => {
    getRemotes();
  }, [getRemotes]);

  if (!remotes || remotes.length === 0) {
    return null;
  }

  if (type === 'push') {
    return (
      <PushModal
        visible={visible}
        remotes={remotes}
        closePushModal={closeModal}
        onAddRemote={getRemotes}
      />
    );
  }

  if (type === 'pull') {
    return (
      <PullModal
        visible={visible}
        remotes={remotes}
        remoteBranches={remoteBranches}
        closePullModal={closeModal}
      />
    );
  }

  if (type === 'checkout') {
    return (
      <CheckoutModal
        closeCheckoutModal={closeModal}
        visible={visible}
        remoteBranches={remoteBranches}
      />
    );
  }

  return null;
};
