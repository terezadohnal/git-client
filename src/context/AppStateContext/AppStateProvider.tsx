import {
  ReactElement,
  useReducer,
  useContext,
  createContext,
  Dispatch,
} from 'react';
import { StateAction } from './types';

interface AppState {
  repositoryPath: string;
}

interface SetRepositoryPathAction {
  type: StateAction.SET_REPOSITORY_PATH;
  payload: {
    repositoryPath: string;
  };
}

export type AppStateAction = SetRepositoryPathAction;

export const AppContext = createContext<AppState>({} as AppState);
export const AppDispatchContext = createContext<Dispatch<AppStateAction>>(
  () => null
);

const appStateReducer = (state: AppState, action: AppStateAction) => {
  switch (action.type) {
    case StateAction.SET_REPOSITORY_PATH:
      return {
        ...state,
        repositoryPath: action.payload.repositoryPath,
      };
    default:
      return state;
  }
};

const initialAppState: AppState = {
  repositoryPath: '',
};

export default function AppStateProvider(props: { children: ReactElement }) {
  const { children } = props;
  const [appState, dispatch] = useReducer(appStateReducer, initialAppState);

  return (
    <AppContext.Provider value={appState}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

const useAppState = () => {
  return useContext(AppContext);
};

const useAppStateDispatch = () => {
  return useContext(AppDispatchContext);
};

export { StateAction, useAppState, useAppStateDispatch };
