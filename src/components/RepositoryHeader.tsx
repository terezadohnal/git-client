import { Badge, Button, Grid } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BranchIcon } from '../../assets/icons/branch';
import { CommitIcon } from '../../assets/icons/commit';
import { MergeIcon } from '../../assets/icons/merge';
import { PullIcon } from '../../assets/icons/pull';
import { PushIcon } from '../../assets/icons/push';
import { PullModal } from './PullModal';
import { PushModalContainer } from './PushModalContainer';

export const RepositoryHeader = () => {
  const navigate = useNavigate();
  const appState = useAppState();
  const [pushVisible, setPushVisible] = useState(false);
  const [pullVisible, setPullVisible] = useState(false);

  const onBackPress = () => {
    window.localStorage.removeItem('repo');
    navigate('/', { replace: true });
  };

  const togglePullModal = () => setPullVisible(!pushVisible);

  const togglePushModal = () => setPushVisible(!pushVisible);

  const onCommitPress = () => {
    navigate('/repository/create-commit', { replace: true });
  };
  const onMergePress = () => {
    console.log('merging');
  };
  const onBranchPress = () => {
    console.log('branching');
  };
  return (
    <Grid
      justify="space-between"
      direction="row"
      className="header repository-header"
    >
      <PushModalContainer
        visible={pushVisible}
        closePushModal={togglePushModal}
      />
      <PullModal visible={pullVisible} closePullModal={togglePullModal} />
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
          onPress={togglePushModal}
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
          onPress={togglePullModal}
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
        onPress={onBranchPress}
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
        onPress={onMergePress}
      >
        Merge
      </Button>
    </Grid>
  );
};
