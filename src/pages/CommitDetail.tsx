/* eslint-disable prefer-template */
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { useCallback, useEffect, useState } from 'react';
import { DiffResult } from 'simple-git';
import { parseDiff, Diff, Hunk } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import { useParams } from 'react-router-dom';

type CommitDiff = { diffSummary: DiffResult; diff: string };

export const CommitDetail = () => {
  const appState = useAppState();
  const [commitDiff, setCommitDiff] = useState<CommitDiff | null>(null);
  const files = parseDiff(commitDiff?.diff ?? '');
  const { hash: commitHash } = useParams();

  const fetchCommitDiff = useCallback(async () => {
    const currentCommitIndex = appState.commits.findIndex(
      (commit) => commit.hash === commitHash
    );

    const response = await window.electron.ipcRenderer.getCommitDiff({
      path: appState.repositoryPath,
      commitHash: commitHash || '',
      previousCommitHash: appState.commits[currentCommitIndex + 1].hash ?? '',
    });
    const parsedResponse = JSON.parse(response) as {
      diffSummary: DiffResult;
      diff: string;
    };

    setCommitDiff(parsedResponse);
  }, [appState.commits, appState.repositoryPath, commitHash]);

  useEffect(() => {
    fetchCommitDiff();
  }, [fetchCommitDiff]);

  const renderFile = (file) => {
    // console.log(file);
    const { oldRevision, newRevision, type, hunks, newPath } = file;
    return (
      <div key={oldRevision + '-' + newRevision}>
        <p>{newPath}</p>
        <Diff viewType="split" diffType={type} hunks={hunks}>
          {(hunks) =>
            hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
          }
        </Diff>
      </div>
    );
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <p>Commit detail {appState.commitHash}</p>
      <div style={{ height: '100%', width: '100%' }}>
        {files.map(renderFile)}
      </div>
    </div>
  );
};
