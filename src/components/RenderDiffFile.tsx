import { Collapse, Grid } from '@nextui-org/react';
import { DiffHunk, DiffFile } from 'helpers/types';
import { FC } from 'react';
// @ts-ignore
import { Diff, Hunk } from 'react-diff-view';

type RenderDiffFileProps = {
  file: DiffFile;
  expanded?: boolean;
};

export const RenderDiffFile: FC<RenderDiffFileProps> = ({ file, expanded }) => {
  const { oldRevision, newRevision, type, hunks, newPath, oldPath } = file;

  if (!newPath) return null;

  return (
    <Collapse
      title={type === 'delete' ? oldPath : newPath}
      css={{ h3: { fontSize: '18px' } }}
      subtitle={`Type: ${type}`}
      key={`${oldRevision}-${newRevision}`}
      expanded={expanded}
    >
      <Grid>
        {/* eslint-disable-next-line react/jsx-no-undef */}
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
