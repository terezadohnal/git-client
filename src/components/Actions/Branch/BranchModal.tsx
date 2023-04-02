import { Button, Col, Modal, Text } from '@nextui-org/react';
import { FC, useState } from 'react';
import { BranchModalProps } from '../../types';
import { CreateBranchBody } from './CreateBranchBody';
import { DeleteBranchBody } from './DeleteBranchBody';

export const BranchModal: FC<BranchModalProps> = ({
  visible,
  closeBranchModal,
}) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <Modal
      closeButton
      blur
      open={visible}
      onClose={() => closeBranchModal(false)}
    >
      <Modal.Header>
        <Col>
          <Text h3>Branch</Text>
          <Button.Group size="sm" color="secondary" rounded bordered>
            <Button
              onPress={() => setShowDelete(false)}
              animated
              style={!showDelete ? { backgroundColor: '$purple200' } : {}}
            >
              Create
            </Button>
            <Button
              onPress={() => setShowDelete(true)}
              animated
              style={showDelete ? { backgroundColor: '$purple200' } : {}}
            >
              Delete
            </Button>
          </Button.Group>
        </Col>
      </Modal.Header>
      {showDelete ? (
        <DeleteBranchBody onClose={closeBranchModal} />
      ) : (
        <CreateBranchBody onClose={closeBranchModal} />
      )}
    </Modal>
  );
};
