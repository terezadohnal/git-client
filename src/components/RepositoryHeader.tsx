import { Button, Grid } from '@nextui-org/react';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { formatKey } from 'helpers/globalHelpers';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BranchIcon } from './icons/branch';
import { CommitIcon } from './icons/commit';
import { MergeIcon } from './icons/merge';
import { PullIcon } from './icons/pull';
import { PushIcon } from './icons/push';
import { BranchModal } from './Actions/Branch/BranchModal';
import { MergeModal } from './Actions/MergeModal';
import { ModalContainer } from './Actions/ModalContainer';
import { BackButton } from './Buttons/BackButton';
import { ButtonWithBadge } from './Buttons/ButtonWithBadge';

export const RepositoryHeader = () => {
  const navigate = useNavigate();
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();
  const [pushVisible, setPushVisible] = useState(false);
  const [pullVisible, setPullVisible] = useState(false);
  const [branchVisible, setBranchVisible] = useState(false);
  const [mergeVisible, setMergeVisible] = useState(false);

  const onCommitPress = useCallback(() => {
    navigate('/repository/create-commit');
  }, [navigate]);

  const setIsModalOpen = useCallback(
    (value: boolean) => {
      appStateDispatch({
        type: StateAction.SET_IS_MODAL_OPEN,
        payload: { isModalOpen: value },
      });
    },
    [appStateDispatch]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const pressed = formatKey(event);
      switch (pressed) {
        case 'ShiftMetaKeyC':
          onCommitPress();
          break;
        case 'ShiftMetaKeyM':
          setMergeVisible(true);
          setIsModalOpen(true);
          break;
        case 'ShiftMetaKeyB':
          setBranchVisible(true);
          setIsModalOpen(true);
          break;
        case 'ShiftMetaKeyP':
          setPushVisible(true);
          setIsModalOpen(true);
          break;
        case 'ShiftMetaKeyL':
          setPullVisible(true);
          setIsModalOpen(true);
          break;
        case 'Escape':
          if (appState.isModalOpen) {
            if (mergeVisible) setMergeVisible(false);
            if (branchVisible) setBranchVisible(false);
            if (pushVisible) setPushVisible(false);
            if (pullVisible) setPullVisible(false);
            setIsModalOpen(false);
          }
          break;
        default:
          break;
      }
    },
    [
      appState.isModalOpen,
      branchVisible,
      mergeVisible,
      onCommitPress,
      pullVisible,
      pushVisible,
      setIsModalOpen,
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  if (!appState.status) {
    return null;
  }

  return (
    <Grid
      justify="space-between"
      direction="row"
      className="navbars repo-header nav-background"
    >
      <ModalContainer
        visible={pushVisible}
        closeModal={setPushVisible}
        type="push"
      />
      <ModalContainer
        visible={pullVisible}
        closeModal={setPullVisible}
        type="pull"
      />
      <BranchModal
        visible={branchVisible}
        closeBranchModal={setBranchVisible}
      />
      <MergeModal visible={mergeVisible} closeMergeModal={setMergeVisible} />
      <BackButton />
      <ButtonWithBadge
        icon={<CommitIcon />}
        label="Commit"
        onButtonPress={onCommitPress}
        badgeNumber={appState.status.files?.length}
      />
      <ButtonWithBadge
        icon={<PushIcon />}
        label="Push"
        onButtonPress={() => setPushVisible(true)}
        badgeNumber={appState.status.ahead}
      />
      <ButtonWithBadge
        icon={<PullIcon />}
        label="Pull"
        onButtonPress={() => setPullVisible(true)}
        badgeNumber={appState.status.behind}
      />
      <Button
        auto
        color="secondary"
        flat
        rounded
        animated
        icon={<BranchIcon />}
        onPress={() => setBranchVisible(true)}
      >
        Branch
      </Button>
      <Button
        auto
        color="secondary"
        flat
        rounded
        animated
        icon={<MergeIcon />}
        onPress={() => setMergeVisible(true)}
      >
        Merge
      </Button>
    </Grid>
  );
};
