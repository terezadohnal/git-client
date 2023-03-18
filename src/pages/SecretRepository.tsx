import { Grid } from '@nextui-org/react';
import {
  StateAction,
  useAppState,
  useAppStateDispatch,
} from 'context/AppStateContext/AppStateProvider';
import { Directory } from 'helpers/types';
import { useCallback, useEffect, useMemo } from 'react';
import '@react-sigma/core/lib/react-sigma.min.css';
import { RepositoryHeader } from 'components/RepositoryHeader';
import { Gitgraph } from '@gitgraph/react';

export const SecretRepository = () => {
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

  return (
    <Grid.Container css={{ h: '100vh', w: '100%' }} justify="center">
      <RepositoryHeader />
      {simpleGraph.length ? (
        <Gitgraph>
          {(gitgraph) => {
            gitgraph.import(simpleGraph);
          }}
        </Gitgraph>
      ) : null}
    </Grid.Container>
  );
};
