import React, { ReactNode } from "react";
import Modal from "./Modal";

interface LeaderboardModalProps {
  closeModal: () => void;
}

const LeaderboardModal = (props: LeaderboardModalProps) => {
  const { closeModal } = props;

  const LeaderboardNode: ReactNode = (
    <p className="modal-text text-align-center">
      Leaderboard is under constuction 🚧
    </p>
  );
  return (
    <Modal
      closeModal={closeModal}
      modalContent={LeaderboardNode}
      modalTitle="Leaderboard"
    />
  );
};

export default LeaderboardModal;
