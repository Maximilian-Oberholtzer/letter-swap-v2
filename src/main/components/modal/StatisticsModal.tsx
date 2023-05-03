import React, { ReactNode } from "react";
import Modal from "./Modal";
import { GameState } from "../../Main";

const DAY = new Date().getDay();

const StatisticsNode = (
  blitzState: GameState,
  marathonState: GameState
): ReactNode => (
  <>
    <p className="modal-title">Statistics</p>
    <h3 className="modal-subtitle">
      Blitz Points: {blitzState.weeklyPoints[DAY]}
    </h3>
    <h3 className="modal-subtitle">
      Blitz Words: {blitzState.weeklyScores[DAY]}
    </h3>
    <h3 className="modal-subtitle">
      Marathon Points: {marathonState.weeklyPoints[DAY]}
    </h3>
    <h3 className="modal-subtitle">
      Marathon Words: {marathonState.weeklyScores[DAY]}
    </h3>
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
    />
  );
};

export default StatisticsModal;
