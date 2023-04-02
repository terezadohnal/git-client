import { Button, Grid } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { formatKey } from 'helpers/globalHelpers';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BranchIcon } from '../../assets/icons/branch';
import { CommitIcon } from '../../assets/icons/commit';
import { MergeIcon } from '../../assets/icons/merge';
import { PullIcon } from '../../assets/icons/pull';
import { PushIcon } from '../../assets/icons/push';
import { BranchModal } from './Actions/Branch/BranchModal';
import { MergeModal } from './Actions/MergeModal';
import { ModalContainer } from './Actions/ModalContainer';
import { BackButton } from './Buttons/BackButton';
import { ButtonWithBadge } from './Buttons/ButtonWithBadge';

export const RepositoryHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appState = useAppState();
  const [pushVisible, setPushVisible] = useState(false);
  const [pullVisible, setPullVisible] = useState(false);
  const [branchVisible, setBranchVisible] = useState(false);
  const [mergeVisible, setMergeVisible] = useState(false);

  const onCommitPress = useCallback(() => {
    navigate('/repository/create-commit');
  }, [navigate]);

  const onSwitchPress = () => {
    if (location.pathname === '/repository') {
      navigate('/repository/secret');
    } else if (location.pathname === '/repository/secret') {
      navigate('/repository');
    }
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const pressed = formatKey(event);
      switch (pressed) {
        case 'MetaKeyC':
          onCommitPress();
          break;
        case 'MetaKeyM':
          setMergeVisible(true);
          break;
        case 'MetaKeyB':
          setBranchVisible(true);
          break;
        case 'MetaKeyP':
          setPushVisible(true);
          break;
        case 'MetaKeyL':
          setPullVisible(true);
          break;
        case 'ShiftKeyQ':
          if (mergeVisible) setMergeVisible(false);
          if (branchVisible) setBranchVisible(false);
          if (pushVisible) setPushVisible(false);
          if (pullVisible) setPullVisible(false);
          break;
        default:
          break;
      }
    },
    [branchVisible, mergeVisible, onCommitPress, pullVisible, pushVisible]
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
      <Button
        auto
        color="secondary"
        flat
        rounded
        animated
        onPress={onSwitchPress}
      >
        S
      </Button>
    </Grid>
  );
};
