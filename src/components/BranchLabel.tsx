import { Grid, Text } from '@nextui-org/react';
import { FC, useState } from 'react';
import useSnackbar from 'hooks/useSnackbar';
import { useAppState } from 'context/AppStateContext/AppStateProvider';
import { MessageTypes } from 'helpers/types';
import useRepository from 'hooks/useRepository';
import { BranchLabelProps } from './types';

export const BranchLabel: FC<BranchLabelProps> = ({ branch }) => {
  const appState = useAppState();
  const { showSnackbar } = useSnackbar();
  const { fetchDirectory } = useRepository();
  const [isLoading, setIsLoading] = useState(false);

  const onCheckoutPress = async () => {
    try {
      setIsLoading(true);
      const response = await window.electron.ipcRenderer.checkout({
        path: appState.repositoryPath,
        branch: branch.name,
        isRemote: false,
      });
      if (response) {
        showSnackbar({
          message: response,
        });
      } else {
        showSnackbar({
          message: `Branch ${branch.name} successfully checked out`,
        });
      }
      await fetchDirectory();
    } catch (err: any) {
      showSnackbar({
        message: err.message,
        type: MessageTypes.ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Grid
      className="branchLabel"
      style={{
        top: branch?.y,
        left: branch?.x ? branch.x + 30 : 0,
        cursor: 'pointer',
      }}
      onClick={onCheckoutPress}
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
