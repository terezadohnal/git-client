import { Button, Grid } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

export const NewCommit = () => {
  const navigate = useNavigate();

  return (
    <Grid>
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
      Create new commit
    </Grid>
  );
};
