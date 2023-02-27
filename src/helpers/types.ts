import { StatusResult, BranchSummary, DiffResult } from 'simple-git';

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

export type CommitDiffDTO = { diffSummary: DiffResult; diff: string };

export type DiffChange = {
  content: string;
  isNormal: boolean;
  newLineNumber: number;
  oldLineNumber: number;
  type: string;
};

export type DiffHunk = {
  changes: DiffChange[];
  content: string;
  isPlain: boolean;
  newLines: number;
  newStart: number;
  oldLines: number;
  oldStart: number;
};

export type DiffFile = {
  hunks: DiffHunk[];
  newEndingNewLine: boolean;
  newMode: string;
  newPath: string;
  newRevision: string;
  oldEndingNewLine: boolean;
  oldMode: string;
  oldPath: string;
  oldRevision: string;
  type: string;
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
    label?: string;
    size: number;
    x: number;
    y: number;
  };
  key: string;
};
