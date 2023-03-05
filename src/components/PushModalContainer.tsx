import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { FC, useCallback, useEffect, useState } from 'react';
import { RemoteWithRefs } from 'simple-git';
import { PushModal } from './PushModal';

type PushModalContainerProps = {
  visible: boolean;
  closePushModal: () => void;
};

export const PushModalContainer: FC<PushModalContainerProps> = ({
  visible,
  closePushModal,
}) => {
  const appState = useAppState();

  const [remotes, setRemotes] = useState<RemoteWithRefs[]>([]);
  const getRemotes = useCallback(async () => {
    const response = await window.electron.ipcRenderer.getRemote({
      path: appState.repositoryPath,
    });
    setRemotes(response);
  }, [appState.repositoryPath]);

  useEffect(() => {
    getRemotes();
  }, [getRemotes]);

  if (!remotes || remotes.length === 0) {
    return null;
  }
  return (
    <PushModal
      visible={visible}
      remotes={remotes}
      closePushModal={closePushModal}
      onAddRemote={getRemotes}
    />
  );
};
