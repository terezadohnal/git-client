import { CommitDTO } from 'helpers/types';
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
  commits: CommitDTO[];
  commitHash: string;
}

interface SetRepositoryPathAction {
  type: StateAction.SET_REPOSITORY_PATH;
  payload: {
    repositoryPath: string;
  };
}

interface SetCommitsAction {
  type: StateAction.SET_COMMITS;
  payload: {
    commits: CommitDTO[];
  };
}
interface SetCommitAction {
  type: StateAction.SET_COMMIT;
  payload: {
    commitHash: string;
  };
}

export type AppStateAction =
  | SetRepositoryPathAction
  | SetCommitsAction
  | SetCommitAction;

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
    case StateAction.SET_COMMITS:
      return {
        ...state,
        commits: action.payload.commits,
      };
    case StateAction.SET_COMMIT:
      return {
        ...state,
        commitHash: action.payload.commitHash,
      };
    default:
      return state;
  }
};

const initialAppState: AppState = {
  repositoryPath: '',
  commits: [],
  commitHash: '',
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
