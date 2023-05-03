import React, { ReactNode } from "react";
import Modal from "./Modal";

const LeaderboardNode: ReactNode = <p></p>;

interface LeaderboardModalProps {
  closeModal: () => void;
}

const LeaderboardModal = (props: LeaderboardModalProps) => {
  const { closeModal } = props;
  return (
    <Modal
      closeModal={closeModal}
      modalContent={LeaderboardNode}
      modalTitle="Leaderboard"
    />
  );
};

export default LeaderboardModal;
