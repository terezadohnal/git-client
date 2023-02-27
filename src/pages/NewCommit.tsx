import { Button, Grid, Spacer, Text, Textarea, Table } from '@nextui-org/react';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { useNavigate } from 'react-router-dom';

export const NewCommit = () => {
  const navigate = useNavigate();
  const appState = useAppState();

  console.log(appState.status);

  return (
    <Grid>
      <Grid
        justify="space-between"
        direction="row"
        className="header repository-header"
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
        <Button
          size="sm"
          color="secondary"
          flat
          rounded
          animated
          style={{ height: 40 }}
        >
          Stage all
        </Button>
        <Text h3>New commit</Text>
      </Grid>
      <Grid style={{ width: '100%', padding: 30 }}>
        <Grid justify="flex-start">
          <Table
            bordered
            shadow={false}
            selectionMode="multiple"
            color="secondary"
            css={{
              height: 'auto',
              minWidth: '100%',
            }}
          >
            <Table.Header>
              <Table.Column align="center">File</Table.Column>
            </Table.Header>
            <Table.Body>
              {appState.status?.files?.map((file) => (
                <Table.Row key={file.path}>
                  <Table.Cell
                    css={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {file.path}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Grid>
        <Spacer y={1} />
        <Grid>
          <Text h5>Add comment</Text>
          <Spacer y={1} />
          <Textarea
            animated
            minRows={20}
            fullWidth
            required
            helperText='Required field. Example: "Add new feature'
          />
          <Spacer y={2} />
          <Button size="xs" color="secondary" flat>
            Add
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
