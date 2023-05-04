import React, { ReactNode } from "react";
import Modal from "./Modal";

const year = new Date().getFullYear();

interface SupportModalProps {
  closeModal: () => void;
}

const SupportModal = (props: SupportModalProps) => {
  const { closeModal } = props;

  const SupportNode: ReactNode = (
    <div className="modal-content-container">
      <p className="modal-text">Thank you for playing my game!</p>
      <p className="modal-text text-align-center">
        © {year} Maximilian Oberholtzer
      </p>
    </div>
  );

  return (
    <Modal
      closeModal={closeModal}
      modalContent={SupportNode}
      modalTitle="Support"
    />
  );
};

export default SupportModal;
