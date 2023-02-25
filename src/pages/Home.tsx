import { AppInput } from 'components/AppInput/AppInput';
import {
  Grid,
  Text,
  Container,
  Input,
  Spacer,
  Collapse,
} from '@nextui-org/react';
import { AppButton } from 'components/AppButton/AppButton';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  useAppState,
  useAppStateDispatch,
  StateAction,
} from '../context/AppStateContext/AppStateProvider';

export const Home = () => {
  const appState = useAppState();
  const navigate = useNavigate();
  const appStateDispatch = useAppStateDispatch();
  const methods = useForm({
    defaultValues: {
      repository: '',
    },
  });

  const onSubmit = async (data: { repository: string }) => {
    if (appState.repositoryPath) {
      const response = await window.electron.ipcRenderer.cloneRepository({
        remote: data.repository,
        target: appState.repositoryPath,
      });
      if (response) {
        window.localStorage.setItem('repo', appState.repositoryPath);
        navigate('/repository', { replace: true });
      }
    }
  };

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
        <Grid>
          <Collapse.Group shadow>
            <Collapse title="Clone remote repo">
              <Grid.Container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid>
                  <Input
                    readOnly
                    placeholder="Where"
                    value={appState.repositoryPath}
                  />
                </Grid>
                <Spacer x={1} />
                <Grid>
                  <AppButton
                    flat
                    color="secondary"
                    size="sm"
                    onPress={onOpenFolder}
                  >
                    Open folder
                  </AppButton>
                </Grid>
              </Grid.Container>
              <Spacer y={2} />
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <Container
                    fluid
                    display="flex"
                    justify="center"
                    alignItems="center"
                    direction="column"
                  >
                    {/* @ts-ignore */}
                    <AppInput
                      name="repository"
                      id="repository"
                      labelPlaceholder="Repository name"
                      type="text"
                      clearable
                      fullWidth
                      disabled={!appState.repositoryPath}
                    />
                    <Spacer y={1} />
                    <AppButton
                      color="gradient"
                      shadow
                      type="submit"
                      disabled={
                        !appState.repositoryPath &&
                        methods.getValues().repository === ''
                      }
                    >
                      Clone
                    </AppButton>
                  </Container>
                </form>
              </FormProvider>
            </Collapse>
            <Collapse title="Open existing repository">
              <Grid.Container direction="column" alignItems="center">
                <Grid.Container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid>
                    <Input
                      readOnly
                      placeholder="From"
                      value={appState.repositoryPath}
                    />
                  </Grid>
                  <Spacer x={1} />
                  <Grid>
                    <AppButton
                      flat
                      color="secondary"
                      size="sm"
                      onPress={onOpenFolder}
                    >
                      Open folder
                    </AppButton>
                  </Grid>
                </Grid.Container>
                <Spacer y={1} />
                <Grid>
                  <AppButton
                    color="gradient"
                    shadow
                    size="md"
                    onPress={onOpenRepository}
                  >
                    Open
                  </AppButton>
                </Grid>
              </Grid.Container>
            </Collapse>
          </Collapse.Group>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
};
