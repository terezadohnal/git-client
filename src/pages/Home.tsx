import { Grid, Text, Collapse } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const onOpenFolder = async () => {
    const filePath = await window.electron.ipcRenderer.openDialog();
    appStateDispatch({
      type: StateAction.SET_REPOSITORY_PATH,
      payload: {
        repositoryPath: filePath,
      },
    });
  };

  const onOpenExistingRepo = async () => {
    const filePath = await window.electron.ipcRenderer.openDialog();
    const isRepository = await window.electron.ipcRenderer.isRepository({
      path: filePath,
    });
    if (!isRepository) {
      setError('This is not a valid repository');
      return;
    }
    window.localStorage.setItem('repo', filePath);
    appStateDispatch({
      type: StateAction.SET_REPOSITORY_PATH,
      payload: {
        repositoryPath: filePath,
      },
    });
  };

  const onClone = async (data: { repository: string }) => {
    if (appState.repositoryPath) {
      try {
        const response = await window.electron.ipcRenderer.cloneRepository({
          remote: data.repository,
          target: appState.repositoryPath,
        });
        if (response) {
          window.localStorage.setItem('repo', appState.repositoryPath);
          navigate('/repository');
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const onOpenRepository = () => {
    navigate('/repository');
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
      <AppSnackbar
        isOpen={!!error}
        message={error ?? 'Unknown error'}
        snackbarProps={{ autoHideDuration: 5000 }}
        alertProps={{ severity: 'error' }}
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
            <CloningRepoContent onOpenFolder={onOpenFolder} onClone={onClone} />
            <ExistingRepoContent
              onOpenFolder={onOpenExistingRepo}
              onOpenRepository={onOpenRepository}
            />
          </Collapse.Group>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
};
