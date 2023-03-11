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

  const data = useMemo(() => {
    const commitsCoordinates: Record<string, { x: number; y: number }> = {};
    let x = 1;
    let y = 0;
    const parentsMap: Record<string, string[]> = {};
    return {
      nodes: commits.reverse().map((commit) => {
        let xOverride;
        if (parentsMap[commit.parentHashes] === undefined) {
          parentsMap[commit.parentHashes] = [commit.hash];
        } else if (
          parentsMap[commit.parentHashes] &&
          !parentsMap[commit.parentHashes].includes(commit.hash)
        ) {
          parentsMap[commit.parentHashes].push(commit.hash);
          xOverride = parentsMap[commit.parentHashes].length;
        }

        if (commitsCoordinates[commit.parentHashes]) {
          y = commitsCoordinates[commit.parentHashes].y;
          x = commitsCoordinates[commit.parentHashes].x;
        }

        commitsCoordinates[commit.hash] = {
          x: xOverride || x,
          y: y + 1,
        };

        return {
          key: commit.hash,
          attributes: {
            x: commitsCoordinates[commit.hash].x,
            y: commitsCoordinates[commit.hash].y,
            size: 10,
            label: commit.message,
            author_name: commit.author_name,
            author_email: commit.author_email,
            date: commit.date,
            hash: commit.hash,
          },
        };
      }),
      edges: commits
        .reverse()
        .slice(0, commits.length - 1)
        .map((commit) => ({
          key: commit.hash,
          source: commit.hash,
          target: commit.parentHashes,
          attributes: {
            size: 5,
          },
        })),
    };
  }, [commits]);

  return (
    <Grid.Container css={{ h: '100vh', w: '1014px' }} justify="center">
      <RepositoryHeader />
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
          defaultNodeColor: '#BC9EC1',
          defaultEdgeColor: '#BC9EC1',
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
