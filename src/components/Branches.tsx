import { Grid } from '@nextui-org/react';
import { FC, useMemo } from 'react';
import { GitgraphCore } from '@gitgraph/core';
import { options } from 'helpers/globalHelpers';
import { BranchLabel } from './BranchLabel';

type BranchesProps = {
  simpleGraph: any;
};

export const Branches: FC<BranchesProps> = ({ simpleGraph }) => {
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
    <Grid
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {branches.map((branch) => {
        return <BranchLabel branch={branch} key={branch.commitHash} />;
      })}
    </Grid>
  );
};
