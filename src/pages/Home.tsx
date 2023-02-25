import { Grid, Text, Collapse } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CloningRepoContent } from 'components/CloningRepoContent';
import { ExistingRepoContent } from 'components/ExistingRepoContent';
import {
  useAppStateDispatch,
  StateAction,
} from '../context/AppStateContext/AppStateProvider';

export const Home = () => {
  const navigate = useNavigate();
  const appStateDispatch = useAppStateDispatch();

  const onOpenFolder = async () => {
    const filePath = await window.electron.ipcRenderer.openDialog();
    window.localStorage.setItem('repo', filePath);
    appStateDispatch({
      type: StateAction.SET_REPOSITORY_PATH,
      payload: {
        repositoryPath: filePath,
      },
    });
  };

  const onOpenRepository = () => {
    navigate('/repository', { replace: true });
  };

  useEffect(() => {
    const savedRepo = window.localStorage.getItem('repo');
    if (savedRepo) {
      appStateDispatch({
        type: StateAction.SET_REPOSITORY_PATH,
        payload: {
          repositoryPath: savedRepo,
        },
      });
      onOpenRepository();
    }
  });

  return (
    <Grid.Container
      gap={2}
      justify="center"
      alignContent="center"
      sm={12}
      style={{
        height: '100vh',
        display: 'flex',
      }}
      className="home"
    >
      <Grid.Container justify="center" direction="column" alignItems="center">
        <Text h3 color="white">
          Here is your best Git app
        </Text>
        <Text h5 color="white">
          Clone or open your existing repo
        </Text>
      </Grid.Container>
      <Grid.Container direction="column" alignItems="center">
        <Grid style={{ width: '50%' }}>
          <Collapse.Group shadow>
            <CloningRepoContent onOpenFolder={onOpenFolder} />
            <ExistingRepoContent
              onOpenFolder={onOpenFolder}
              onOpenRepository={onOpenRepository}
            />
          </Collapse.Group>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
};
