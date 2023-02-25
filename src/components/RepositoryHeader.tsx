import { Button, Grid } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { BranchIcon } from '../../assets/icons/branch';
import { CommitIcon } from '../../assets/icons/commit';
import { MergeIcon } from '../../assets/icons/merge';
import { PullIcon } from '../../assets/icons/pull';
import { PushIcon } from '../../assets/icons/push';

export const RepositoryHeader = () => {
  const navigate = useNavigate();

  const onBackPress = () => {
    window.localStorage.removeItem('repo');
    navigate('/', { replace: true });
  };
  const onPullPress = () => {
    console.log('pulling');
  };
  const onPushPress = () => {
    console.log('pushing');
  };
  const onCommitPress = () => {
    console.log('committing');
  };
  const onMergePress = () => {
    console.log('merging');
  };
  const onBranchPress = () => {
    console.log('branching');
  };
  return (
    <Grid justify="space-between" direction="row" className="repository-header">
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
      <Button
        auto
        color="secondary"
        flat
        rounded
        animated
        icon={<PullIcon />}
        onPress={onPullPress}
      >
        Pull
      </Button>
      <Button
        auto
        color="secondary"
        flat
        rounded
        animated
        icon={<PushIcon />}
        onPress={onPushPress}
      >
        Push
      </Button>
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
