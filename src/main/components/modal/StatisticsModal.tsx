import React, { ReactNode } from "react";
import Modal from "./Modal";

const StatisticsNode: ReactNode = <p className="modal-title">Statistics</p>;

interface StatisticsModalProps {
  closeModal: () => void;
}

const StatisticsModal = (props: StatisticsModalProps) => {
  const { closeModal } = props;
  return <Modal closeModal={closeModal} modalContent={StatisticsNode} />;
};

export default StatisticsModal;
