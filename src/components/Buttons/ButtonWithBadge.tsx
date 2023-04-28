import { Badge, Button } from '@nextui-org/react';
import { ButtonWithBadgeProps } from 'components/types';
import { FC } from 'react';

export const ButtonWithBadge: FC<ButtonWithBadgeProps> = ({
  onButtonPress,
  icon,
  label,
  badgeNumber,
}) => {
  if (!badgeNumber) {
    return (
      <Button
        auto
        color="secondary"
        flat
        rounded
        animated
        icon={icon}
        onPress={onButtonPress}
        data-testid="button-with-badge"
      >
        {label}
      </Button>
    );
  }

  return (
    <Badge color="error" content={badgeNumber} data-testid="badge">
      <Button
        auto
        color="secondary"
        flat
        rounded
        animated
        icon={icon}
        onPress={onButtonPress}
      >
        {label}
      </Button>
    </Badge>
  );
};
