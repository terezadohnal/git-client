import { Grid } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RepositoryHeader } from 'components/RepositoryHeader';
import { options } from 'helpers/globalHelpers';
import { AppSnackbar } from 'components/AppSnackbar';
import { Gitgraph } from '@gitgraph/react';
import { useNavigate } from 'react-router-dom';
import { CommitEvent } from 'components/types';
import { RepositoryFooter } from 'components/RepositoryFooter';
import useRepository from 'hooks/useRepository';
import { useMouse } from 'react-use';
import { GitgraphCore } from '@gitgraph/core';
import { CommitTooltip } from 'components/CommitTooltip';
import { BranchLabel } from 'components/BranchLabel';

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

  useEffect(() => {
    const startFetchingTime = performance.now();
    fetchDirectory();
    const endFetchingTime = performance.now();
    console.log(
      `Time taken to fetch all commits: ${
        endFetchingTime - startFetchingTime
      }ms`
    );
  }, [fetchDirectory, performance]);

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

  const myGitgraph = new GitgraphCore(options);
  myGitgraph.getUserApi().import(simpleGraph);
  const renderData = myGitgraph.getRenderedData();

  const branches = useMemo(() => {
    const maxByBranch: { [key: string]: number } = {};
    const arr = renderData.commits
      .filter((commit) => commit.branchToDisplay !== '')
      .map((commit) => {
        return {
          commitHash: commit.hash,
          name: commit.branchToDisplay,
          x: commit.x,
          y: commit.y,
          color: commit.style.dot.color,
        };
      });

    arr.forEach((obj) => {
      const { name, y } = obj;
      if (!maxByBranch[name] || y < maxByBranch[name]) {
        maxByBranch[name] = y;
      }
    });

    return arr.filter((obj) => {
      const { name, y } = obj;
      return y === maxByBranch[name];
    });
  }, [renderData.commits]);

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
      <div
        style={{
          width: '100%',
          flexGrow: 1,
          overflowY: 'scroll',
          position: 'relative',
        }}
      >
        <div>
          {tooltip && (
            <CommitTooltip
              hashAbbrev={tooltip.hashAbbrev}
              author={tooltip.author}
              subject={tooltip.subject}
              top={elY}
              left={elX}
            />
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: ref.current?.clientHeight || 0,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            {branches.map((branch) => {
              return <BranchLabel branch={branch} key={branch.commitHash} />;
            })}
          </div>
        </div>
        <Grid className="graphContainer" ref={ref}>
          {simpleGraph.length ? (
            <Gitgraph options={options}>
              {(gitgraph) => {
                gitgraph.import(simpleGraph);
              }}
            </Gitgraph>
          ) : null}
        </Grid>
      </div>
      <RepositoryFooter />
    </Grid.Container>
  );
};
