import React, { ReactNode } from "react";
import Modal from "./Modal";
import { GameState } from "../../Main";

const DAY = new Date().getDay();

const StatisticsNode = (
  blitzState: GameState,
  marathonState: GameState
): ReactNode => (
  <>
    <p className="modal-text">Blitz Points: {blitzState.weeklyPoints[DAY]}</p>
    <p className="modal-text">Blitz Words: {blitzState.weeklyScores[DAY]}</p>
    <p className="modal-text">
      Marathon Points: {marathonState.weeklyPoints[DAY]}
    </p>
    <p className="modal-text">
      Marathon Words: {marathonState.weeklyScores[DAY]}
    </p>
  </>
);

interface StatisticsModalProps {
  closeModal: () => void;
  blitzState: GameState;
  marathonState: GameState;
}

const StatisticsModal = (props: StatisticsModalProps) => {
  const { closeModal, blitzState, marathonState } = props;
  return (
    <Modal
      closeModal={closeModal}
      modalContent={StatisticsNode(blitzState, marathonState)}
      modalTitle="Statistics"
    />
  );
};

export default StatisticsModal;
