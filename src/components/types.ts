/* eslint-disable no-unused-vars */
import { RemoteWithRefs } from 'simple-git';

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

export type CreateBranchBodyProps = {
  onClose: (val: boolean) => void;
};

export type DeleteBranchBodyProps = {
  onClose: (val: boolean) => void;
};
