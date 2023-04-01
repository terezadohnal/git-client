import { Card, Grid, Text } from '@nextui-org/react';
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
      onMouseOver: (event: CommitEvent) => {
        console.log(event);
        setTooltip(event);
      },
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
          branch: commit.branchToDisplay,
          x: commit.x,
          y: commit.y,
          color: commit.style.dot.color,
        };
      });

    arr.forEach((obj) => {
      const { branch, y } = obj;
      if (!maxByBranch[branch] || y < maxByBranch[branch]) {
        maxByBranch[branch] = y;
      }
    });

    return arr.filter((obj) => {
      const { branch, y } = obj;
      return y === maxByBranch[branch];
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
            <Card
              id={`tooltip-${tooltip.hash}`}
              className="tooltip"
              style={{
                position: 'fixed',
                width: 'fit-content',
                top: elY,
                left: elX + 20,
              }}
            >
              <Card.Body>
                <Text>
                  <span className="tooltip-title">{tooltip.hashAbbrev}</span>
                  {`: ${tooltip.subject}`}
                </Text>
                <Text>
                  <span className="tooltip-title">Author</span>
                  {`: ${tooltip.author.name} (${tooltip.author.email})`}
                </Text>
                <Text>
                  <span className="tooltip-title">Date</span>
                  {`: ${tooltip.author.timestamp}`}
                </Text>
              </Card.Body>
            </Card>
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
              return (
                <Grid
                  key={branch?.commitHash}
                  className="branchLabel"
                  style={{
                    top: branch?.y,
                    left: branch?.x ? branch.x + 40 : 0,
                  }}
                >
                  <Text
                    style={{
                      background: 'white',
                      width: 'fit-content',
                      whiteSpace: 'nowrap',
                      border: `1px solid ${branch.color}`,
                      padding: '5px',
                      borderRadius: '8px',
                    }}
                  >
                    {branch?.branch}
                  </Text>
                </Grid>
              );
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
