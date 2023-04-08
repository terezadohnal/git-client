import { Card, Text } from '@nextui-org/react';
import { FC } from 'react';
import { format } from 'date-fns';
import { CommitTooltipProps } from './types';

export const CommitTooltip: FC<CommitTooltipProps> = ({
  hashAbbrev,
  author,
  subject,
  top,
  left,
}) => {
  return (
    <Card
      id={`tooltip-${hashAbbrev}`}
      className="tooltip"
      style={{
        position: 'absolute',
        width: 'fit-content',
        top,
        left: left + 20,
      }}
    >
      <Card.Body>
        <Text>
          <span className="tooltip-title">{hashAbbrev}: </span>
          {`${subject}`}
        </Text>
        <Text>
          <span className="tooltip-title">Author: </span>
          {`${author.name} (${author.email})`}
        </Text>
        <Text>
          <span className="tooltip-title">Date: </span>
          {`${format(author.timestamp, 'dd/MM/yyyy H:m')}`}
        </Text>
      </Card.Body>
    </Card>
  );
};
