import { Button, Collapse, Grid, Input, Spacer } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { FC } from 'react';

type ExistingRepoContentProps = {
  onOpenFolder: () => void;
  onOpenRepository: () => void;
};

export const ExistingRepoContent: FC<ExistingRepoContentProps> = ({
  onOpenFolder,
  onOpenRepository,
}) => {
  const appState = useAppState();

  return (
    <Collapse title="Open existing repository">
      <Grid.Container direction="column" alignItems="center">
        <Grid.Container direction="column" justify="center" alignItems="center">
          <Input
            placeholder="From"
            value={appState.repositoryPath}
            fullWidth
            onClick={onOpenFolder}
          />
        </Grid.Container>
        <Spacer y={1} />
        <Grid>
          <Button color="primary" shadow size="md" onPress={onOpenRepository}>
            Open
          </Button>
        </Grid>
      </Grid.Container>
    </Collapse>
  );
};
