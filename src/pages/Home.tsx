import { AppInput } from 'components/AppInput/AppInput';
import { Grid, Typography } from '@mui/material';
import { AppButton } from 'components/AppButton/AppButton';
import { useForm, FormProvider } from 'react-hook-form';

export const Home = () => {
  const methods = useForm({
    defaultValues: {
      repository: 'hello',
    },
  });

  const onSubmit = async (data: { repository: string }) => {
    // window.electron.ipcRenderer.cloneRepository(data.repository);
    const response = await window.electron.ipcRenderer.cloneRepository(
      data.repository
    );
    console.log(response);
  };

  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      gap={3}
    >
      <Typography variant="h3">Here is your best Git app</Typography>
      <Typography variant="h5">Clone your repo</Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid item>
            <Grid container justifyContent="center" gap={3}>
              <AppInput
                name="repository"
                label="Repository"
                id="repository"
                placeholder="Repository name"
                type="text"
                fullWidth
              />
              <AppButton variant="contained" color="secondary" type="submit">
                Clone
              </AppButton>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Grid>
  );
};
