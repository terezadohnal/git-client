import { Grid, Text, Collapse } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CloningRepoContent } from 'components/CloningRepoContent';
import { ExistingRepoContent } from 'components/ExistingRepoContent';
import { AppSnackbar } from 'components/AppSnackbar';
import {
  useAppStateDispatch,
  StateAction,
  useAppState,
} from '../context/AppStateContext/AppStateProvider';

export const Home = () => {
  const appState = useAppState();
  const navigate = useNavigate();
  const appStateDispatch = useAppStateDispatch();

  useEffect(() => {
    const savedRepo = window.localStorage.getItem('repo');
    if (savedRepo) {
      appStateDispatch({
        type: StateAction.SET_REPOSITORY_PATH,
        payload: {
          repositoryPath: savedRepo,
        },
      });
      navigate('/repository');
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
        margin: '0',
      }}
      className="home"
    >
      <AppSnackbar
        isOpen={!!appState.snackbar?.message}
        message={appState.snackbar?.message}
        alertProps={{ severity: appState.snackbar?.type }}
      />
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
          <Collapse.Group shadow accordion>
            <CloningRepoContent />
            <ExistingRepoContent />
          </Collapse.Group>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
};
