import { Grid, Text } from '@nextui-org/react';
import { FC } from 'react';
import { BranchLabelProps } from './types';

export const BranchLabel: FC<BranchLabelProps> = ({ branch }) => {
  return (
    <Grid
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
        {branch?.name}
      </Text>
    </Grid>
  );
};
