import { CommitDTO, MessageTypes, Snackbar } from 'helpers/types';
import {
  ReactElement,
  useReducer,
  useContext,
  createContext,
  Dispatch,
} from 'react';
import { BranchSummary, StatusResult } from 'simple-git';
import { StateAction } from './types';

interface AppState {
  repositoryPath: string;
  commits: CommitDTO[];
  commitHash: string;
  status: StatusResult;
  remoteBranches: string[];
  localBranches: BranchSummary;
  snackbar: Snackbar;
  isModalOpen: boolean;
  maxCommitLoad: number;
  isLoadMoreButtonDisabled: boolean;
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
interface SetLocalBranches {
  type: StateAction.SET_LOCAL_BRANCHES;
  payload: {
    localBranches: BranchSummary;
  };
}
interface SetSnackbar {
  type: StateAction.SET_SNACKBAR;
  payload: {
    snackbar: Snackbar;
  };
}
interface ResetAppState {
  type: StateAction.RESET_APP_STATE;
}
interface SetIsModalOpen {
  type: StateAction.SET_IS_MODAL_OPEN;
  payload: {
    isModalOpen: boolean;
  };
}

interface SetIsLoadMoreButtonDisabled {
  type: StateAction.SET_IS_LOAD_MORE_BUTTON_DISABLED;
}

interface IncreaseMaxCommitLoad {
  type: StateAction.INCREASE_MAX_COMMIT_LOAD;
}

export type AppStateAction =
  | SetRepositoryPathAction
  | SetCommitsAction
  | SetCommitAction
  | SetStatusAction
  | SetRemoteBranches
  | SetLocalBranches
  | SetSnackbar
  | ResetAppState
  | SetIsModalOpen
  | IncreaseMaxCommitLoad
  | SetIsLoadMoreButtonDisabled;

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
    case StateAction.SET_LOCAL_BRANCHES:
      return {
        ...state,
        localBranches: action.payload.localBranches,
      };
    case StateAction.SET_SNACKBAR:
      return {
        ...state,
        snackbar: action.payload.snackbar,
      };
    case StateAction.SET_IS_MODAL_OPEN:
      return {
        ...state,
        isModalOpen: action.payload.isModalOpen,
      };
    case StateAction.INCREASE_MAX_COMMIT_LOAD:
      return {
        ...state,
        maxCommitLoad: state.maxCommitLoad + 100,
      };
    case StateAction.SET_IS_LOAD_MORE_BUTTON_DISABLED:
      return {
        ...state,
        isLoadMoreButtonDisabled: true,
      };
    case StateAction.RESET_APP_STATE:
      return {
        repositoryPath: '',
        commits: [],
        commitHash: '',
        status: {} as StatusResult,
        remoteBranches: [],
        localBranches: {} as BranchSummary,
        snackbar: {
          message: '',
          type: MessageTypes.SUCCESS,
        },
        isModalOpen: false,
        maxCommitLoad: 100,
        isLoadMoreButtonDisabled: false,
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
  localBranches: {} as BranchSummary,
  snackbar: {
    message: '',
    type: MessageTypes.SUCCESS,
  },
  isModalOpen: false,
  maxCommitLoad: 100,
  isLoadMoreButtonDisabled: false,
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
