import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { useCallback, useEffect, useState } from 'react';
// @ts-ignore
import { parseDiff, Diff, Hunk } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import { useParams } from 'react-router-dom';
import { Grid, Text, Collapse, Card } from '@nextui-org/react';
import { CommitDiffDTO, CommitDTO, DiffFile, DiffHunk } from 'helpers/types';
import { BackButton } from 'components/Buttons/BackButton';
import { format } from 'date-fns';
import { AppSnackbar } from 'components/AppSnackbar';
import useCommit from 'hooks/useCommit';

export const CommitDetail = () => {
  const appState = useAppState();
  const { fetchCommitDiff } = useCommit();
  const [commitDiff, setCommitDiff] = useState<CommitDiffDTO | null>(null);
  const [commit, setCommit] = useState<CommitDTO | null>(null);
  const files = parseDiff(commitDiff?.diff ?? '');
  const { hash: commitHash } = useParams();

  const fetchDiffs = useCallback(async () => {
    const currentCommitIndex = appState.commits.findIndex(
      (c) => c.hash === commitHash
    );
    if (commitHash) {
      const response = await fetchCommitDiff(commitHash, currentCommitIndex);
      if (response) {
        const parsedResponse = JSON.parse(response) as CommitDiffDTO;
        setCommit(appState.commits[currentCommitIndex]);
        setCommitDiff(parsedResponse);
      }
    }
  }, [appState.commits, commitHash, fetchCommitDiff]);

  useEffect(() => {
    fetchDiffs();
  }, [fetchDiffs]);

  const renderFile = (file: DiffFile) => {
    const { oldRevision, newRevision, type, hunks, newPath, oldPath } = file;

    if (!newPath) return null;

    return (
      <Collapse
        title={type === 'delete' ? oldPath : newPath}
        css={{ h3: { fontSize: '18px' } }}
        subtitle={`Type: ${type}`}
        key={`${oldRevision}-${newRevision}`}
      >
        <Grid>
          <Diff viewType="split" diffType={type} hunks={hunks}>
            {() =>
              hunks.map((hunk: DiffHunk) => (
                <Hunk key={hunk.content} hunk={hunk} />
              ))
            }
          </Diff>
        </Grid>
      </Collapse>
    );
  };

  return (
    <Grid.Container css={{ h: '100%', w: '100%' }} justify="center">
      <AppSnackbar
        message={appState.snackbar.message}
        isOpen={!!appState.snackbar.message}
        alertProps={{ severity: appState.snackbar.type }}
      />
      <Grid
        justify="space-between"
        direction="row"
        className=" navbars repo-header nav-background"
      >
        <BackButton />
        <Text h3>Commit detail</Text>
      </Grid>
      <Grid style={{ width: '100%', padding: 30 }} justify="flex-start">
        <Card variant="flat" css={{ mw: '100%' }}>
          <Card.Body>
            {commit?.author_name && (
              <Text>
                <span style={{ fontWeight: 'bold' }}>Created by: </span>
                {commit?.author_name} ({commit.author_email})
              </Text>
            )}
            {commit?.date && (
              <Text>
                <span style={{ fontWeight: 'bold' }}>Created at: </span>
                {format(new Date(commit?.date), 'dd/MM/yyyy HH:mm')}
              </Text>
            )}
            {commit?.message && (
              <Text>
                <span style={{ fontWeight: 'bold' }}>Message: </span>
                {commit?.message}
              </Text>
            )}
            {commit?.hash && (
              <Text>
                <span style={{ fontWeight: 'bold' }}>Hash: </span>
                {commit?.hash}
              </Text>
            )}
          </Card.Body>
        </Card>
      </Grid>
      <Grid style={{ height: '100%', width: '100%', padding: 20 }}>
        <Collapse.Group accordion={false} shadow>
          {files.map(renderFile)}
        </Collapse.Group>
      </Grid>
    </Grid.Container>
  );
};
