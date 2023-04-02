import {
  Button,
  Collapse,
  Grid,
  Input,
  Loading,
  Spacer,
} from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import useRepository from 'hooks/useRepository';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const CloningRepoContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const appState = useAppState();
  const { openFolder, clone } = useRepository();
  const { handleSubmit, register, watch } = useForm({
    defaultValues: {
      repository: '',
    },
  });

  const onSubmit = async (data: { repository: string }) => {
    try {
      setIsLoading(true);
      await clone(data.repository);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Collapse title="Clone remote repository">
      <Grid.Container direction="column" justify="center" alignItems="center">
        <Input
          readOnly
          placeholder="Destination path"
          value={appState.repositoryPath}
          fullWidth
          onClick={openFolder}
        />
      </Grid.Container>
      <Spacer y={0.5} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid.Container direction="column" justify="center" alignItems="center">
          <Input
            id="repository"
            labelPlaceholder="Repository URL"
            type="text"
            clearable
            fullWidth
            disabled={!appState.repositoryPath}
            {...register('repository')}
          />
          <Spacer y={1} />
          <Button
            color="primary"
            shadow
            type="submit"
            disabled={
              !appState.repositoryPath ||
              watch('repository') === '' ||
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
    </Collapse>
  );
};
