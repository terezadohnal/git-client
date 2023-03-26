import { Card, Grid, Text } from '@nextui-org/react';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { Directory } from 'helpers/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import '@react-sigma/core/lib/react-sigma.min.css';
import { RepositoryHeader } from 'components/RepositoryHeader';
import { options } from 'helpers/globalHelpers';
import { AppSnackbar } from 'components/AppSnackbar';
// import { GitgraphCore } from '@gitgraph/core';
import { Gitgraph } from '@gitgraph/react';
import { useNavigate } from 'react-router-dom';
import { TooltipCommit } from 'components/types';

export const Repository = () => {
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipCommit | null>(null);
  const { performance } = window;

  const onNodeClick = useCallback(
    (event: any) => {
      navigate(`/repository/commits/${event.hash}`);
    },
    [navigate]
  );

  const fetchDirectory = useCallback(async () => {
    try {
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
    } catch (err: any) {
      setError(err.message);
    }
  }, [appState.repositoryPath, appStateDispatch]);

  useEffect(() => {
    const startFetchingTime = performance.now();
    fetchDirectory();
    const endFetchingTime = performance.now();
    console.log(
      `Time taken to fetch all commits: ${
        endFetchingTime - startFetchingTime
      }ms`
    );
  }, [fetchDirectory, performance]);

  const { commits } = appState;

  const simpleGraph = useMemo(() => {
    return commits.map((commit) => ({
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
      <RepositoryHeader />
      <AppSnackbar
        isOpen={appState.commits.length > 0}
        message="Repository successfully loaded"
        snackbarProps={{ autoHideDuration: 3000 }}
      />
      <AppSnackbar
        isOpen={!!error}
        message={error ?? 'Unknown error'}
        snackbarProps={{ autoHideDuration: 3000 }}
        alertProps={{ severity: 'error' }}
      />
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
      <Grid style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
        {simpleGraph.length ? (
          <Gitgraph options={options}>
            {(gitgraph) => {
              gitgraph.import(simpleGraph);
            }}
          </Gitgraph>
        ) : null}
      </Grid>
      <Grid className="footerContainer">
        <Text>
          <span style={{ fontWeight: 'bold' }}>On branch </span>
          {appState.status.current}
        </Text>
      </Grid>
    </Grid.Container>
  );
};
