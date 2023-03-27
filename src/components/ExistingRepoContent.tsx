import { Button, Collapse, Grid, Input, Spacer } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import useRepository from 'hooks/useRepository';
import { useNavigate } from 'react-router-dom';

export const ExistingRepoContent = () => {
  const appState = useAppState();
  const { openExistingRepository } = useRepository();
  const navigate = useNavigate();

  return (
    <Collapse title="Open existing repository">
      <Grid.Container direction="column" alignItems="center">
        <Grid.Container direction="column" justify="center" alignItems="center">
          <Input
            placeholder="From"
            value={appState.repositoryPath}
            fullWidth
            onClick={openExistingRepository}
          />
        </Grid.Container>
        <Spacer y={1} />
        <Grid>
          <Button
            color="primary"
            shadow
            size="md"
            onPress={() => navigate('/repository')}
            disabled={!appState.repositoryPath}
          >
            Open
          </Button>
        </Grid>
      </Grid.Container>
    </Collapse>
  );
};
