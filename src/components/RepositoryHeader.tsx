import { Badge, Button, Grid } from '@nextui-org/react';
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
import { BackButton } from './BackButton';

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
        case 'KeyC':
          onCommitPress();
          break;
        case 'KeyM':
          setMergeVisible(true);
          break;
        case 'KeyB':
          setBranchVisible(true);
          break;
        case 'KeyP':
          setPushVisible(true);
          break;
        case 'KeyL':
          setPullVisible(true);
          break;
        case 'KeyQ':
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

  return (
    <Grid
      justify="space-between"
      direction="row"
      className="header repository-header"
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
      <Button
        auto
        color="secondary"
        flat
        rounded
        animated
        icon={<CommitIcon />}
        onPress={onCommitPress}
      >
        Commit
      </Button>
      <Badge
        color="error"
        content={appState.status.ahead}
        isInvisible={appState.status.ahead === 0}
      >
        <Button
          auto
          color="secondary"
          flat
          rounded
          animated
          icon={<PushIcon />}
          onPress={() => setPushVisible(true)}
        >
          Push
        </Button>
      </Badge>
      <Badge
        color="error"
        content={appState.status.behind}
        isInvisible={appState.status.behind === 0}
      >
        <Button
          auto
          color="secondary"
          flat
          rounded
          animated
          icon={<PullIcon />}
          onPress={() => setPullVisible(true)}
        >
          Pull
        </Button>
      </Badge>
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
