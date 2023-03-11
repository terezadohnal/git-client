import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { FC, useCallback, useEffect, useState } from 'react';
import { RemoteWithRefs } from 'simple-git';
import { PullModal } from './PullModal';
import { PushModal } from './PushModal';
import { ModalContainerProps } from './types';

export const ModalContainer: FC<ModalContainerProps> = ({
  visible,
  closeModal,
  type,
}) => {
  const appState = useAppState();

  const [remotes, setRemotes] = useState<RemoteWithRefs[]>([]);
  const [remoteBranches, setRemoteBranches] = useState<string[]>([]);

  const getRemotes = useCallback(async () => {
    const response = await window.electron.ipcRenderer.getRemote({
      path: appState.repositoryPath,
    });
    const getRemotesBranches =
      await window.electron.ipcRenderer.getRemoteBranches({
        path: appState.repositoryPath,
      });

    setRemotes(response);
    setRemoteBranches(getRemotesBranches.all);
  }, [appState.repositoryPath]);

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

  return null;
};