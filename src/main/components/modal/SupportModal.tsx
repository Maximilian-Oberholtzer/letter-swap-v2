import React, { ReactNode } from "react";
import Modal from "./Modal";

const SupportNode: ReactNode = <p className="modal-title">Support</p>;

interface SupportModalProps {
  closeModal: () => void;
}

const SupportModal = (props: SupportModalProps) => {
  const { closeModal } = props;
  return <Modal closeModal={closeModal} modalContent={SupportNode} />;
};

export default SupportModal;
