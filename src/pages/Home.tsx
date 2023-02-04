import { AppInput } from 'components/AppInput/AppInput';
import { Grid, Text, Container, Input, Spacer } from '@nextui-org/react';
import { AppButton } from 'components/AppButton/AppButton';
import { useForm, FormProvider } from 'react-hook-form';
import {
  useAppState,
  useAppStateDispatch,
  StateAction,
} from '../context/AppStateContext/AppStateProvider';

export const Home = () => {
  const appState = useAppState();
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
      console.log(response);
    }
  };

  const onOpen = async () => {
    console.log('clicked');
    const filePath = await window.electron.ipcRenderer.openDialog();
    appStateDispatch({
      type: StateAction.SET_REPOSITORY_PATH,
      payload: {
        repositoryPath: filePath,
      },
    });
  };

  return (
    <Container fluid justify="center" gap={5}>
      <Grid.Container justify="center" direction="column" alignItems="center">
        <Text h3>Here is your best Git app</Text>
        <Text h5>Clone your repo</Text>
      </Grid.Container>
      <Spacer y={2} />
      <Grid.Container direction="column" alignItems="center">
        <Grid.Container direction="row" justify="center" alignItems="center">
          <Grid>
            <Input
              readOnly
              placeholder="Where"
              value={appState.repositoryPath}
            />
          </Grid>
          <Spacer x={1} />
          <Grid>
            <AppButton flat color="secondary" size="sm" onClick={onOpen}>
              Open folder
            </AppButton>
          </Grid>
        </Grid.Container>
        <Spacer y={2} />
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Container fluid justify="center" direction="column">
              <Grid>
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
              </Grid>
              <Spacer y={1} />
              <Grid>
                <AppButton
                  color="gradient"
                  shadow
                  type="submit"
                  disabled={!appState.repositoryPath}
                >
                  Clone
                </AppButton>
              </Grid>
            </Container>
          </form>
        </FormProvider>
      </Grid.Container>
    </Container>
  );
};
