import { CommitDTO } from 'helpers/types';
import {
  ReactElement,
  useReducer,
  useContext,
  createContext,
  Dispatch,
} from 'react';
import { StatusResult } from 'simple-git';
import { StateAction } from './types';

interface AppState {
  repositoryPath: string;
  commits: CommitDTO[];
  commitHash: string;
  status: StatusResult;
  remoteBranches: string[];
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
interface SetStatusAction {
  type: StateAction.SET_STATUS;
  payload: {
    status: StatusResult;
  };
}

interface SetRemoteBranches {
  type: StateAction.SET_REMOTE_BRANCHES;
  payload: {
    remoteBranches: string[];
  };
}

export type AppStateAction =
  | SetRepositoryPathAction
  | SetCommitsAction
  | SetCommitAction
  | SetStatusAction
  | SetRemoteBranches;

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
    case StateAction.SET_STATUS:
      return {
        ...state,
        status: action.payload.status,
      };
    case StateAction.SET_REMOTE_BRANCHES:
      return {
        ...state,
        remoteBranches: action.payload.remoteBranches,
      };
    default:
      return state;
  }
};

const initialAppState: AppState = {
  repositoryPath: '',
  commits: [],
  commitHash: '',
  status: {} as StatusResult,
  remoteBranches: [],
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
