import { Grid, Text, Card } from '@nextui-org/react';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { Directory } from 'helpers/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import '@react-sigma/core/lib/react-sigma.min.css';
import { RepositoryHeader } from 'components/RepositoryHeader';
import { Gitgraph } from '@gitgraph/react';
import { options } from 'helpers/globalHelpers';
import { useNavigate } from 'react-router-dom';
import { TooltipCommit } from 'components/types';
// import { GitgraphCore } from '@gitgraph/core';

export const SecretRepository = () => {
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<TooltipCommit | null>(null);

  const onNodeClick = useCallback(
    (event: any) => {
      navigate(`/repository/commits/${event.hash}`);
    },
    [navigate]
  );

  const fetchDirectory = useCallback(async () => {
    const directory = await window.electron.ipcRenderer.fetchDirectoryStatus({
      path: appState.repositoryPath,
    });

    const parsedDir = JSON.parse(directory) as Directory;
    appStateDispatch({
      type: StateAction.SET_COMMITS,
      payload: {
        commits: parsedDir.commits,
      },
    });
    appStateDispatch({
      type: StateAction.SET_STATUS,
      payload: {
        status: parsedDir.status,
      },
    });
    appStateDispatch({
      type: StateAction.SET_LOCAL_BRANCHES,
      payload: {
        localBranches: parsedDir.branches,
      },
    });
  }, [appState.repositoryPath, appStateDispatch]);

  useEffect(() => {
    fetchDirectory();
  }, [fetchDirectory]);

  const { commits } = appState;

  const simpleGraph = useMemo(() => {
    return commits.reverse().map((commit) => ({
      hash: commit.hash,
      hashAbbrev: commit.hash.slice(0, 7),
      tree: commit.tree.split(' ')[0],
      treeAbbrev: commit.tree.slice(0, 7),
      parents: commit.parentHashes.split(' '),
      parentsAbbrev: commit.parentHashes
        .split(' ')
        .map((hash) => hash.slice(0, 7)),
      author: {
        name: commit.author_name,
        email: commit.author_email,
        timestamp: commit.date,
      },
      commiter: {
        name: commit.author_name,
        email: commit.author_email,
        timestamp: commit.date,
      },
      subject: commit.message,
      body: '',
      stats: [],
      notes: '',
      refs: commit.refs ? commit.refs.split(', ') : [''],
      onClick: (event: TooltipCommit) => onNodeClick(event),
      onMouseOver: (event: TooltipCommit) => setTooltip(event),
      onMouseOut: () => setTooltip(null),
    }));
  }, [commits, onNodeClick]);

  // const myGitgraph = new GitgraphCore(options);
  // myGitgraph.getUserApi().import(simpleGraph);
  // const renderData = myGitgraph.getRenderedData();

  return (
    <Grid.Container
      css={{ h: '100vh', w: '100%', position: 'fixed' }}
      justify="center"
    >
      {tooltip && (
        <Card
          id={`tooltip-${tooltip.hash}`}
          className="tooltip"
          style={{
            position: 'fixed',
            width: 'fit-content',
            top: tooltip.y + 20,
            left: tooltip.x + 300,
          }}
        >
          <Card.Body>
            <Text>
              <span className="tooltip-title">{tooltip.hashAbbrev}</span>
              {`: ${tooltip.subject}`}
            </Text>
            <Text>
              <span className="tooltip-title">Author</span>
              {`: ${tooltip.author.name} (${tooltip.author.email})`}
            </Text>
            <Text>
              <span className="tooltip-title">Date</span>
              {`: ${tooltip.author.timestamp}`}
            </Text>
          </Card.Body>
        </Card>
      )}
      <RepositoryHeader />
      <Grid style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
        {simpleGraph.length ? (
          <Gitgraph options={options}>
            {(gitgraph) => {
              gitgraph.import(simpleGraph);
            }}
          </Gitgraph>
        ) : null}
      </Grid>
    </Grid.Container>
  );
};
