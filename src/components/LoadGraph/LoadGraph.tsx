import { useLoadGraph, useRegisterEvents, useSigma } from '@react-sigma/core';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { MultiGraph } from 'graphology';
import { FC, useCallback, useEffect } from 'react';
import { SigmaNodeEventPayload } from 'sigma/sigma';
import { LoadGraphProps } from './types';

export const LoadGraph: FC<LoadGraphProps> = ({ data }) => {
  const loadGraph = useLoadGraph();
  const sigma = useSigma();
  const g = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const appState = useAppState();
  const appStateDispatch = useAppStateDispatch();

  useEffect(() => {
    const graph = new MultiGraph();
    graph.import(data);
    loadGraph(graph);
  }, [loadGraph, data]);

  const onNodeClick = useCallback(
    (event: SigmaNodeEventPayload) => {
      appStateDispatch({
        type: StateAction.SET_COMMIT,
        payload: {
          commitHash: event.node,
        },
      });
      console.log(appState.commitHash);
    },
    [appState.commitHash, appStateDispatch]
  );

  useEffect(() => {
    registerEvents({
      clickNode: (event) => onNodeClick(event),
    });
  }, [registerEvents, g, onNodeClick]);

  return null;
};
