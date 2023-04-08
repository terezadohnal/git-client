import { Gitgraph } from '@gitgraph/react';
import { Grid } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { options } from 'helpers/globalHelpers';
import { ForwardedRef, forwardRef } from 'react';

type GraphProps = {
  simpleGraph: any;
};

const Graph = forwardRef(
  ({ simpleGraph }: GraphProps, ref: ForwardedRef<HTMLDivElement>) => {
    const appState = useAppState();
    const { commits } = appState;

    return (
      <Grid className="graphContainer" ref={ref}>
        {simpleGraph.length ? (
          <Gitgraph key={commits.length} options={options}>
            {(gitgraph) => {
              gitgraph.import(simpleGraph);
            }}
          </Gitgraph>
        ) : null}
      </Grid>
    );
  }
);

export default Graph;
