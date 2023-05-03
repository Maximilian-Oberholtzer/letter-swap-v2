import React, { ReactNode } from "react";
import Modal from "./Modal";

const SupportNode: ReactNode = <p></p>;

interface SupportModalProps {
  closeModal: () => void;
}

const SupportModal = (props: SupportModalProps) => {
  const { closeModal } = props;
  return (
    <Modal
      closeModal={closeModal}
      modalContent={SupportNode}
      modalTitle="Support"
    />
  );
};

export default SupportModal;
