import React, { ReactNode } from "react";
import Modal from "./Modal";

const SettingsNode: ReactNode = <p></p>;

interface SettingsModalProps {
  closeModal: () => void;
}

const SettingsModal = (props: SettingsModalProps) => {
  const { closeModal } = props;
  return (
    <Modal
      closeModal={closeModal}
      modalContent={SettingsNode}
      modalTitle="Settings"
    />
  );
};

export default SettingsModal;
