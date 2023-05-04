import { Gitgraph } from '@gitgraph/react';
import { Button, Grid } from '@nextui-org/react';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { options } from 'helpers/globalHelpers';
import useRepository from 'hooks/useRepository';
import { ForwardedRef, forwardRef } from 'react';

type GraphProps = {
  simpleGraph: any;
};

const Graph = forwardRef(
  ({ simpleGraph }: GraphProps, ref: ForwardedRef<HTMLDivElement>) => {
    const appState = useAppState();
    const appStateDispatch = useAppStateDispatch();
    const { commits, isLoadMoreButtonDisabled } = appState;
    const { fetchDirectory } = useRepository();

    const handleButtonPress = () => {
      appStateDispatch({ type: StateAction.INCREASE_MAX_COMMIT_LOAD });
      fetchDirectory(false);
    };

    return (
      <Grid className="graphContainer" ref={ref}>
        {simpleGraph.length ? (
          <Gitgraph key={commits.length} options={options}>
            {(gitgraph) => {
              gitgraph.import(simpleGraph);
            }}
          </Gitgraph>
        ) : null}
        <Grid
          css={{
            width: window.innerWidth,
            display: 'flex',
            justifyContent: 'center',
            pt: '70px',
            pb: '20px',
          }}
        >
          {commits.length >= 100 && !isLoadMoreButtonDisabled ? (
            <Button
              rounded
              type="button"
              color="secondary"
              flat
              css={{ height: '40px' }}
              onPress={handleButtonPress}
            >
              Load more
            </Button>
          ) : null}
        </Grid>
      </Grid>
    );
  }
);

export default Graph;
