import React, { ReactNode } from "react";
import Modal from "./Modal";

const instructionsNode: ReactNode = <p className="modal-title">How To Play</p>;

interface instructionsModalProps {
  closeModal: () => void;
}

const InstructionsModal = (props: instructionsModalProps) => {
  const { closeModal } = props;
  return <Modal closeModal={closeModal} modalContent={instructionsNode} />;
};

export default InstructionsModal;
