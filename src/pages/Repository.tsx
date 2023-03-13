import { Grid } from '@nextui-org/react';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { Directory } from 'helpers/types';
import { useCallback, useEffect, useMemo } from 'react';
import { SigmaContainer } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';
import { LoadGraph } from 'components/LoadGraph/LoadGraph';
import { RepositoryHeader } from 'components/RepositoryHeader';
import { drawHover } from 'helpers/globalHelpers';
import { AppSnackbar } from 'components/AppSnackbar';
import { GitgraphCore } from '@gitgraph/core';

export const Repository = () => {
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();

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

  // const data = useMemo(() => {
  //   const commitsCoordinates: Record<string, { x: number; y: number }> = {};
  //   let x = 1;
  //   let y = 0;
  //   const parentsMap: Record<string, string[]> = {};
  //   return {
  //     nodes: commits.map((commit) => {
  //       let xOverride;
  //       if (parentsMap[commit.parentHashes] === undefined) {
  //         parentsMap[commit.parentHashes] = [commit.hash];
  //       } else if (
  //         parentsMap[commit.parentHashes] &&
  //         !parentsMap[commit.parentHashes].includes(commit.hash)
  //       ) {
  //         parentsMap[commit.parentHashes].push(commit.hash);
  //         xOverride = parentsMap[commit.parentHashes].length;
  //       }

  //       if (commitsCoordinates[commit.parentHashes]) {
  //         y = commitsCoordinates[commit.parentHashes].y;
  //         x = commitsCoordinates[commit.parentHashes].x;
  //       }

  //       commitsCoordinates[commit.hash] = {
  //         x: xOverride || x,
  //         y: y + 1,
  //       };

  //       return {
  //         key: commit.hash,
  //         attributes: {
  //           x: commitsCoordinates[commit.hash].x,
  //           y: commitsCoordinates[commit.hash].y,
  //           size: 10,
  //           label: commit.message,
  //           author_name: commit.author_name,
  //           author_email: commit.author_email,
  //           date: commit.date,
  //           hash: commit.hash,
  //         },
  //       };
  //     }),
  //     edges: commits
  //       .map((commit) => {
  //         return { ...commit, parentHashes: commit.parentHashes.split(' ') };
  //       })
  //       .reverse()
  //       .slice(0, commits.length - 1)
  //       .map((commit) =>
  //         commit.parentHashes.map((parentHash) => ({
  //           key: `${commit.hash}-${parentHash}`,
  //           source: commit.hash,
  //           target: parentHash,
  //           attributes: {
  //             size: 5,
  //           },
  //         }))
  //       )
  //       .flat(),
  //   };
  // }, [commits]);

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

  const myGitgraph = new GitgraphCore();
  myGitgraph.getUserApi().import(simpleGraph);
  const renderData = myGitgraph.getRenderedData();

  const data = useMemo(() => {
    return {
      nodes: renderData.commits.reverse().map((commit) => {
        return {
          key: commit.hash,
          attributes: {
            x: commit.x * 2,
            y: commit.y,
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
        .reverse()
        .slice(0, commits.length - 1)
        .map((commit) =>
          commit.parents.map((parentHash) => ({
            key: `${commit.hash}-${parentHash}`,
            source: commit.hash,
            target: parentHash,
            attributes: {
              size: 5,
            },
          }))
        )
        .flat(),
    };
  }, [commits.length, renderData.commits]);
  console.log('second', data);

  return (
    <Grid.Container css={{ h: '100vh', w: '1014px' }} justify="center">
      <RepositoryHeader />
      <AppSnackbar
        isOpen={appState.commits.length > 0}
        message="Repository successfully opened"
        snackbarProps={{ autoHideDuration: 3000 }}
      />
      <SigmaContainer
        style={{
          height: '3000px',
          width: '100%',
          overflow: 'scroll',
          padding: 0,
        }}
        settings={{
          maxCameraRatio: 2,
          minCameraRatio: 0,
          defaultNodeColor: '#EBEBEB',
          defaultEdgeColor: '#C179B9',
          renderLabels: false,
          hoverRenderer(context, values, settings) {
            drawHover(context, values, settings);
          },
        }}
      >
        <LoadGraph data={data} />
      </SigmaContainer>
    </Grid.Container>
  );
};
