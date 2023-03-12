import { Badge, Button, Grid } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BranchIcon } from '../../assets/icons/branch';
import { CommitIcon } from '../../assets/icons/commit';
import { MergeIcon } from '../../assets/icons/merge';
import { PullIcon } from '../../assets/icons/pull';
import { PushIcon } from '../../assets/icons/push';
import { BranchModal } from './Actions/Branch/BranchModal';
import { MergeModal } from './Actions/MergeModal';
import { ModalContainer } from './Actions/ModalContainer';

export const RepositoryHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appState = useAppState();
  const [pushVisible, setPushVisible] = useState(false);
  const [pullVisible, setPullVisible] = useState(false);
  const [branchVisible, setBranchVisible] = useState(false);
  const [mergeVisible, setMergeVisible] = useState(false);

  const onBackPress = () => {
    window.localStorage.removeItem('repo');
    navigate('/', { replace: true });
  };

  const onCommitPress = () => {
    navigate('/repository/create-commit', { replace: true });
  };

  const onSwitchPress = () => {
    if (location.pathname === '/repository') {
      navigate('/repository/secret', { replace: true });
    } else if (location.pathname === '/repository/secret') {
      navigate('/repository', { replace: true });
    }
  };

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
      <Button
        size="sm"
        color="secondary"
        rounded
        animated
        flat
        style={{ height: 40 }}
        onPress={onBackPress}
      >
        Back
      </Button>
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
