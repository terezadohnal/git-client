import { Grid, Text } from '@nextui-org/react';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { Directory } from 'helpers/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SigmaContainer } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';
import { LoadGraph } from 'components/LoadGraph/LoadGraph';
import { RepositoryHeader } from 'components/RepositoryHeader';
import { drawHover, options } from 'helpers/globalHelpers';
import { AppSnackbar } from 'components/AppSnackbar';
import { GitgraphCore } from '@gitgraph/core';

export const Repository = () => {
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();
  const [error, setError] = useState<string | null>(null);
  const { performance } = window;

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
    }));
  }, [commits]);

  const startParsingTime = performance.now();

  const myGitgraph = new GitgraphCore(options);
  myGitgraph.getUserApi().import(simpleGraph);
  const renderData = myGitgraph.getRenderedData();

  const endParsingTime = performance.now();
  console.log(
    `Time taken to calculate positions: ${endParsingTime - startParsingTime}ms`
  );

  const numOfCommits = renderData.commits.length;

  const startRenderingTime = performance.now();
  const data = useMemo(() => {
    return {
      nodes: renderData.commits.map((commit) => {
        return {
          key: commit.hash,
          attributes: {
            x: numOfCommits < 1000 ? commit.x * 3 : commit.x * 50,
            y: numOfCommits < 1000 ? commit.y : commit.y * 4,
            size: 10,
            label: commit.subject,
            author_name: commit.author.name,
            author_email: commit.author.email,
            date: commit.author.timestamp,
            hash: commit.hash,
          },
        };
      }),
      edges: renderData.commits
        .map((commit) =>
          commit.parents.map((parentHash) => {
            const parent = renderData.commits.find(
              (c) => c.hash === parentHash
            );

            return {
              key: `${commit.hash}-${parentHash}`,
              source: commit.hash,
              target: parentHash,
              attributes: {
                size: 3,
                color:
                  (parent?.parents?.length === 1 && parent?.style?.color) ||
                  commit.style?.color,
              },
            };
          })
        )
        .flat()
        .filter((e) => e.target !== ''),
    };
  }, [numOfCommits, renderData.commits]);

  // console.log('second', data);
  const endRenderingTime = performance.now();
  console.log(
    `Time taken to parse renderCommits into Sigma data structure: ${
      endRenderingTime - startRenderingTime
    }ms`
  );

  return (
    <Grid.Container css={{ h: '100vh', w: '100%' }} justify="center">
      <RepositoryHeader />
      <AppSnackbar
        isOpen={appState.commits.length > 0}
        message="Repository successfully opened"
        snackbarProps={{ autoHideDuration: 3000 }}
      />
      <AppSnackbar
        isOpen={!!error}
        message={error ?? 'Unknown error'}
        snackbarProps={{ autoHideDuration: 3000 }}
        alertProps={{ severity: 'error' }}
      />
      <div className="graphContainer">
        <SigmaContainer
          style={{
            width: '100%',
            height: `${numOfCommits < 1000 ? 2000 : 5000}px`,
            padding: 0,
          }}
          settings={{
            minCameraRatio: 0.1,
            maxCameraRatio: 0.8,
            defaultNodeColor: '#EBEBEB',

            renderLabels: false,
            hoverRenderer(context, values, settings) {
              drawHover(context, values, settings);
            },
          }}
        >
          <LoadGraph data={data ?? {}} />
        </SigmaContainer>
      </div>
      <Grid className="footerContainer">
        <Text>
          <span style={{ fontWeight: 'bold' }}>On branch </span>
          {appState.status.current}
        </Text>
      </Grid>
    </Grid.Container>
  );
};
