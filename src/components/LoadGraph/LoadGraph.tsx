import { useLoadGraph, useRegisterEvents, useSigma } from '@react-sigma/core';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { MultiGraph } from 'graphology';
import { FC, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SigmaNodeEventPayload } from 'sigma/sigma';
import { LoadGraphProps } from './types';

export const LoadGraph: FC<LoadGraphProps> = ({ data }) => {
  const loadGraph = useLoadGraph();
  const registerEvents = useRegisterEvents();
  const navigate = useNavigate();
  const sigma = useSigma();
  const appState = useAppState();

  const onNodeClick = useCallback(
    (event: SigmaNodeEventPayload) => {
      navigate(`/repository/commits/${event.node}`, { replace: true });
    },
    [navigate]
  );

  const onNodeEnter = useCallback(
    (event: SigmaNodeEventPayload) => {
      const commit = appState.commits.find((c) => c.hash === event.node);
      sigma
        .getGraph()
        .setNodeAttribute(event.node, 'label', `${commit?.message}`);
    },
    [appState.commits, sigma]
  );
  const onNodeLeave = useCallback(
    (event: SigmaNodeEventPayload) => {
      sigma.getGraph().removeNodeAttribute(event.node, 'label');
    },
    [sigma]
  );

  useEffect(() => {
    const graph = new MultiGraph();
    graph.import(data);
    loadGraph(graph);

    registerEvents({
      clickNode: (event) => onNodeClick(event),
      enterNode: (event) => onNodeEnter(event),
      leaveNode: (event) => onNodeLeave(event),
    });
  }, [loadGraph, data, registerEvents, onNodeClick, onNodeEnter, onNodeLeave]);

  return null;
};
