import { Card, Grid, Text } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RepositoryHeader } from 'components/RepositoryHeader';
import { options } from 'helpers/globalHelpers';
import { AppSnackbar } from 'components/AppSnackbar';
import { GitgraphCore } from '@gitgraph/core';
import { Gitgraph } from '@gitgraph/react';
import { useNavigate } from 'react-router-dom';
import { CommitEvent } from 'components/types';
import { RepositoryFooter } from 'components/RepositoryFooter';
import useRepository from 'hooks/useRepository';

export const Repository = () => {
  const appState = useAppState();
  const { fetchDirectory } = useRepository();
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<CommitEvent | null>(null);
  const { performance } = window;

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

  console.log('renderData', renderData);

  return (
    <Grid.Container css={{ h: '100vh', w: '100%' }} justify="center">
      <RepositoryHeader />
      <AppSnackbar
        isOpen={!!appState.snackbar.message}
        message={appState.snackbar.message}
        alertProps={{ severity: appState.snackbar.type }}
      />
      {tooltip && (
        <Card
          id={`tooltip-${tooltip.hash}`}
          className="tooltip"
          style={{
            position: 'fixed',
            width: 'fit-content',
            top: tooltip.y + 20,
            left: tooltip.x + 300,
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
      <Grid className="graphContainer">
        {simpleGraph.length ? (
          <Gitgraph options={options}>
            {(gitgraph) => {
              gitgraph.import(simpleGraph);
            }}
          </Gitgraph>
        ) : null}
      </Grid>
      <RepositoryFooter />
    </Grid.Container>
  );
};
