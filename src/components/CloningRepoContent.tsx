import { Collapse, Grid, Input, Loading, Spacer } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppButton } from './AppButton/AppButton';
import { AppInput } from './AppInput/AppInput';

type CloningRepoContentProps = {
  onOpenFolder: () => void;
};

export const CloningRepoContent: FC<CloningRepoContentProps> = ({
  onOpenFolder,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const appState = useAppState();
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      repository: '',
    },
  });

  const onSubmit = async (data: { repository: string }) => {
    if (appState.repositoryPath) {
      try {
        setIsLoading(true);
        const response = await window.electron.ipcRenderer.cloneRepository({
          remote: data.repository,
          target: appState.repositoryPath,
        });
        if (response) {
          window.localStorage.setItem('repo', appState.repositoryPath);
          navigate('/repository', { replace: true });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <Collapse title="Clone remote repo">
      <Grid.Container direction="column" justify="center" alignItems="center">
        <Input
          readOnly
          placeholder="Where"
          value={appState.repositoryPath}
          fullWidth
        />
        <Spacer x={1} />
        <AppButton
          flat
          color="secondary"
          size="sm"
          disabled={isLoading}
          onPress={onOpenFolder}
        >
          Open folder
        </AppButton>
      </Grid.Container>
      <Spacer y={2} />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid.Container
            direction="column"
            justify="center"
            alignItems="center"
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
                (!appState.repositoryPath &&
                  methods.getValues().repository === '') ||
                isLoading
              }
            >
              {isLoading && (
                <Loading type="points" color="currentColor" size="sm" />
              )}
            </AppButton>
          </Grid.Container>
        </form>
      </FormProvider>
    </Collapse>
  );
};
