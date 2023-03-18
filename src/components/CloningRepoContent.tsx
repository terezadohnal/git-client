import {
  Button,
  Collapse,
  Grid,
  Input,
  Loading,
  Spacer,
} from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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
        <Button
          flat
          color="secondary"
          size="sm"
          disabled={isLoading}
          onPress={onOpenFolder}
        >
          Open folder
        </Button>
      </Grid.Container>
      <Spacer y={2} />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid.Container
            direction="column"
            justify="center"
            alignItems="center"
          >
            @ts-ignore
            <Input
              name="repository"
              id="repository"
              labelPlaceholder="Repository name"
              type="text"
              clearable
              fullWidth
              disabled={!appState.repositoryPath}
            />
            <Spacer y={1} />
            <Button
              color="primary"
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
              Clone repository
            </Button>
          </Grid.Container>
        </form>
      </FormProvider>
    </Collapse>
  );
};
