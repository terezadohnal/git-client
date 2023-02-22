import { StatusResult, BranchSummary } from 'simple-git';

export type CommitDTO = {
  hash: string;
  date: string;
  message: string;
  refs: string;
  body: string;
  author_name: string;
  author_email: string;
  parentHashes: string;
  tree: string;
};

export type Directory = {
  status: StatusResult;
  commits: CommitDTO[];
  branches: BranchSummary;
};

export type Edge = {
  attributes: {
    size: number;
  };
  key: string;
  source: string;
  target: string;
};

export type Node = {
  attributes: {
    label: string;
    size: number;
    x: number;
    y: number;
  };
  key: string;
};
