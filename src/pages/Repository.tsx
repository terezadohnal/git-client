import { Grid, Text } from '@nextui-org/react';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { Directory } from 'helpers/types';
import { useCallback, useEffect, useMemo } from 'react';
import { MultiGraph } from 'graphology';
import { SigmaContainer, useLoadGraph } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';

const LoadGraph = (props: { data: any }) => {
  const { data } = props;
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new MultiGraph();
    graph.import(data);
    loadGraph(graph);
  }, [loadGraph, data]);

  return null;
};

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
  }, [appState.repositoryPath, appStateDispatch]);

  useEffect(() => {
    fetchDirectory();
  }, [fetchDirectory]);

  const { commits } = appState;

  const data = useMemo(() => {
    return {
      nodes: commits.reverse().map((commit, index) => ({
        key: commit.hash,
        attributes: {
          label: commit.message,
          x: 0,
          y: index,
          size: 10,
        },
      })),
      edges: commits
        .reverse()
        .slice(0, commits.length - 1)
        .map((commit, index) => ({
          key: commit.hash,
          source: commit.hash,
          target: commits[index + 1]?.hash,
          attributes: {
            size: 5,
          },
        })),
    };
  }, [commits]);

  return (
    <Grid.Container css={{ h: '100vh', w: '1024px' }} justify="center">
      <Text h4>Repository page</Text>
      <SigmaContainer
        style={{
          height: '3000px',
          width: '100%',
          overflow: 'scroll',
          padding: 0,
        }}
        settings={{
          maxCameraRatio: 1,
          minCameraRatio: 1,
          defaultNodeColor: '#BC9EC1',
          defaultEdgeColor: '#BC9EC1',
        }}
      >
        <LoadGraph data={data} />
      </SigmaContainer>
    </Grid.Container>
  );
};
