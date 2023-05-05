import React, { ReactNode } from "react";
import Modal from "./Modal";
import { GameState } from "../../Main";

const DAY = new Date().getDay();

interface StatisticsModalProps {
  closeModal: () => void;
  blitzState: GameState;
  marathonState: GameState;
}

const StatisticsModal = (props: StatisticsModalProps) => {
  const { closeModal, blitzState, marathonState } = props;

  const StatisticsNode = (
    blitzState: GameState,
    marathonState: GameState
  ): ReactNode => (
    <div className="modal-content-container">
      <p className="modal-text">Your results today:</p>
      <table className="statistics-table">
        <thead>
          <tr>
            <th></th>
            <th>Blitz</th>
            <th>Marathon</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Points</td>
            <td>{blitzState.weeklyPoints[DAY] ?? "-"}</td>
            <td>{marathonState.weeklyPoints[DAY] ?? "-"}</td>
          </tr>
          <tr>
            <td>Words</td>
            <td>{blitzState.weeklyScores[DAY] ?? "-"}</td>
            <td>{marathonState.weeklyScores[DAY] ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <Modal
      closeModal={closeModal}
      modalContent={StatisticsNode(blitzState, marathonState)}
      modalTitle="Statistics"
    />
  );
};

export default StatisticsModal;
