import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { useCallback, useEffect, useState } from 'react';
// @ts-ignore
import { parseDiff, Diff, Hunk } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, Text, Collapse } from '@nextui-org/react';
import { CommitDiffDTO, DiffFile, DiffHunk } from 'helpers/types';

export const CommitDetail = () => {
  const appState = useAppState();
  const [commitDiff, setCommitDiff] = useState<CommitDiffDTO | null>(null);
  const files = parseDiff(commitDiff?.diff ?? '');
  const { hash: commitHash } = useParams();
  const navigate = useNavigate();

  const fetchCommitDiff = useCallback(async () => {
    const currentCommitIndex = appState.commits.findIndex(
      (commit) => commit.hash === commitHash
    );

    const response = await window.electron.ipcRenderer.getCommitDiff({
      path: appState.repositoryPath,
      commitHash: commitHash || '',
      previousCommitHash: appState.commits[currentCommitIndex + 1].hash ?? '',
    });
    const parsedResponse = JSON.parse(response) as CommitDiffDTO;

    setCommitDiff(parsedResponse);
  }, [appState.commits, appState.repositoryPath, commitHash]);

  useEffect(() => {
    fetchCommitDiff();
  }, [fetchCommitDiff]);

  const renderFile = (file: DiffFile) => {
    const { oldRevision, newRevision, type, hunks, newPath } = file;

    if (!newPath) return null;

    return (
      <Collapse title={newPath} key={`${oldRevision}-${newRevision}`}>
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
    <Grid.Container css={{ h: '100vh', w: '1014px' }} justify="center">
      <Grid
        justify="space-between"
        direction="row"
        className="header commit-detail-header"
      >
        <Button
          size="sm"
          color="secondary"
          rounded
          animated
          flat
          style={{ height: 40 }}
          onPress={() => navigate('/repository', { replace: true })}
        >
          Back
        </Button>
        <Text h3>Commit detail</Text>
      </Grid>
      <Grid style={{ height: '100%', width: '100%', padding: 20 }}>
        <Collapse.Group accordion={false}>
          {files.map(renderFile)}
        </Collapse.Group>
      </Grid>
    </Grid.Container>
  );
};
