import { StatusResult, BranchSummary } from 'simple-git';

export type CommitDTO = {
  hash: string;
  date: string;
  message: string;
  refs: string;
  body: string;
  author_name: string;
  author_email: string;
};

export type Directory = {
  status: StatusResult;
  commits: CommitDTO[];
  branches: BranchSummary;
};
