import { useLoadGraph, useRegisterEvents } from '@react-sigma/core';
import { MultiGraph } from 'graphology';
import { FC, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SigmaNodeEventPayload } from 'sigma/sigma';
import { LoadGraphProps } from './types';

export const LoadGraph: FC<LoadGraphProps> = ({ data }) => {
  const loadGraph = useLoadGraph();
  const registerEvents = useRegisterEvents();
  const navigate = useNavigate();

  const onNodeClick = useCallback(
    (event: SigmaNodeEventPayload) => {
      navigate(`/repository/commits/${event.node}`, { replace: true });
    },
    [navigate]
  );

  useEffect(() => {
    const graph = new MultiGraph();
    graph.import(data);
    loadGraph(graph);

    registerEvents({
      clickNode: (event) => onNodeClick(event),
    });
  }, [loadGraph, data, registerEvents, onNodeClick]);

  return null;
};
