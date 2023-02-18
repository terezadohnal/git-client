import { Edge, Node } from 'helpers/types';

export type LoadGraphProps = {
  data: {
    edges: Edge[];
    nodes: Node[];
  };
};
