import { Collapse, Grid, Input, Spacer } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { FC } from 'react';
import { AppButton } from './AppButton/AppButton';

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
            readOnly
            placeholder="From"
            value={appState.repositoryPath}
            fullWidth
          />
          <Spacer x={1} />
          <AppButton flat color="secondary" size="sm" onPress={onOpenFolder}>
            Open folder
          </AppButton>
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
  );
};
