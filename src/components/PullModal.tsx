import { Modal, Text } from '@nextui-org/react';
import { FC } from 'react';

type PullModalProps = {
  visible: boolean;
  closePullModal: () => void;
};

export const PullModal: FC<PullModalProps> = ({ visible, closePullModal }) => {
  return (
    <Modal closeButton blur open={visible} onClose={closePullModal}>
      <Modal.Header>
        <Text h3>Pull changes</Text>
      </Modal.Header>
      <Modal.Body>
        <Text>Not implemented yet</Text>
      </Modal.Body>
    </Modal>
  );
};
