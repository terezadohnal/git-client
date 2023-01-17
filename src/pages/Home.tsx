import { AppInput } from 'components/AppInput/AppInput';
import { useState } from 'react';
import { Grid } from '@mui/material';

export const Home = () => {
  const [value, setValue] = useState<string>();
  window.electron.ipcRenderer.sendMessage('ipc-example', [value]);
  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <h3>Here is your best Git app</h3>
      <h5>Clone your repo</h5>
      <form>
        <AppInput
          name="repository"
          placeholder="Repository name"
          onChange={(val) => setValue(val.target.value)}
          fullWidth
        />
      </form>
    </Grid>
  );
};
