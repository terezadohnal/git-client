import { Collapse, Grid, Input } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import useRepository from 'hooks/useRepository';

export const ExistingRepoContent = () => {
  const appState = useAppState();
  const { openExistingRepository } = useRepository();

  return (
    <Collapse title="Open existing repository">
      <Grid.Container direction="column" alignItems="center">
        <Grid.Container direction="column" justify="center" alignItems="center">
          <Input
            placeholder="Open.."
            aria-label="Open existing repository"
            value={appState.repositoryPath}
            fullWidth
            onClick={openExistingRepository}
          />
        </Grid.Container>
      </Grid.Container>
    </Collapse>
  );
};
