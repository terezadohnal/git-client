/* eslint-disable no-unused-vars */
import { AlertProps, SnackbarProps } from '@mui/material';
import { ReactElement } from 'react';
import { RemoteWithRefs } from 'simple-git';

export type CloningRepoContentProps = {
  onOpenFolder: () => void;
  onClone: (data: { repository: string }) => void;
};

export type ModalContainerProps = {
  visible: boolean;
  closeModal: (val: boolean) => void;
  type: 'push' | 'pull';
};

export type PushModalProps = {
  visible: boolean;
  remotes: RemoteWithRefs[];
  closePushModal: (val: boolean) => void;
  onAddRemote: () => void;
};

export type PullModalProps = {
  visible: boolean;
  remotes: RemoteWithRefs[];
  remoteBranches: string[];
  closePullModal: (val: boolean) => void;
};

export type BranchModalProps = {
  visible: boolean;
  closeBranchModal: (val: boolean) => void;
};

export type MergeModalProps = {
  visible: boolean;
  closeMergeModal: (val: boolean) => void;
};

export type CreateBranchBodyProps = {
  onClose: (val: boolean) => void;
};

export type DeleteBranchBodyProps = {
  onClose: (val: boolean) => void;
};

export type AppSnackbarProps = {
  snackbarProps?: SnackbarProps;
  alertProps?: AlertProps;
  message: string;
  isOpen?: boolean;
};

export type ButtonWithBadgeProps = {
  onButtonPress: () => void;
  icon: ReactElement;
  label: string;
  badgeNumber?: number | null;
};

export type TooltipCommit = {
  refs: string[];
  x: number;
  y: number;
  author: {
    name: string;
    email: string;
    timestamp: number;
  };
  committer: {
    name: string;
    email: string;
    timestamp: number;
  };
  subject: string;
  body: string;
  hash: string;
  hashAbbrev: string;
  parents: string[];
  parentsAbbrev: string[];
  style: {
    spacing: number;
    hasTooltipInCompactMode: boolean;
    dot: {
      size: number;
      strokeWidth: number;
      font: string;
    };
    message: {
      display: boolean;
      displayAuthor: boolean;
      displayHash: boolean;
      font: string;
    };
  };
  branches: string[];
};
