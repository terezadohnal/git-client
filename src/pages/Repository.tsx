import { Grid } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RepositoryHeader } from 'components/RepositoryHeader';
import { AppSnackbar } from 'components/AppSnackbar';
import { useNavigate } from 'react-router-dom';
import { CommitEvent } from 'components/types';
import { RepositoryFooter } from 'components/RepositoryFooter';
import useRepository from 'hooks/useRepository';
import { useMouse } from 'react-use';
import { CommitTooltip } from 'components/CommitTooltip';
import Graph from 'components/Graph';
import { Branches } from 'components/Branches';

export const Repository = () => {
  const appState = useAppState();
  const { fetchDirectory } = useRepository();
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<CommitEvent | null>(null);
  const { performance } = window;
  const ref = useRef<HTMLDivElement | null>(null);
  const { elX, elY } = useMouse(ref);

  const onNodeClick = useCallback(
    (event: CommitEvent) => {
      navigate(`/repository/commits/${event.hash}`);
    },
    [navigate]
  );

  const refetch = useCallback(async () => {
    await fetchDirectory();
  }, [fetchDirectory]);

  useEffect(() => {
    const startFetchingTime = performance.now();
    refetch();
    const endFetchingTime = performance.now();
    console.log(
      `Time taken to fetch all commits: ${
        endFetchingTime - startFetchingTime
      }ms`
    );
  }, [refetch, performance]);

  useEffect(() => {
    window.electron.ipcRenderer.onAppFocus(() => {
      refetch();
    });
  }, [refetch]);

  const { commits } = appState;

  const simpleGraph = useMemo(() => {
    return commits.map((commit) => ({
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
      onClick: (event: CommitEvent) => onNodeClick(event),
      onMouseOver: (event: CommitEvent) => setTooltip(event),
      onMouseOut: () => setTooltip(null),
    }));
  }, [commits, onNodeClick]);

  return (
    <Grid.Container
      css={{ h: '100vh', w: '100%' }}
      justify="center"
      direction="column"
    >
      <RepositoryHeader />
      <AppSnackbar
        isOpen={!!appState.snackbar.message}
        message={appState.snackbar.message}
        alertProps={{ severity: appState.snackbar.type }}
      />
      <Grid
        style={{
          width: '100%',
          flexGrow: 1,
          overflowY: 'scroll',
          position: 'relative',
        }}
      >
        <Grid
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: ref.current?.clientHeight || 0,
          }}
        >
          <Grid>
            {tooltip && (
              <CommitTooltip
                hashAbbrev={tooltip.hashAbbrev}
                author={tooltip.author}
                subject={tooltip.subject}
                top={elY}
                left={elX}
              />
            )}
          </Grid>
          <Branches simpleGraph={simpleGraph} />
        </Grid>
        <Graph simpleGraph={simpleGraph} ref={ref} />
      </Grid>
      <RepositoryFooter />
    </Grid.Container>
  );
};
