import React, { ReactNode } from "react";
import Modal from "./Modal";
import { GameState } from "../../Main";

const DAY = new Date().getDay();

interface StatisticsModalProps {
  closeModal: () => void;
  blitz4x4State: GameState;
  blitz5x5State: GameState;
  marathonState: GameState;
}

const StatisticsModal = (props: StatisticsModalProps) => {
  const { closeModal, blitz4x4State, blitz5x5State, marathonState } = props;

  const StatisticsNode = (
    blitz4x4State: GameState,
    blitz5x5State: GameState,
    marathonState: GameState
  ): ReactNode => (
    <div className="modal-content-container">
      <p className="modal-text text-align-center">Today's Results:</p>
      <table className="statistics-table">
        <thead>
          <tr>
            <th></th>
            <th>4x4 Blitz</th>
            <th>5x5 Blitz</th>
            <th>Marathon</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Points</td>
            <td>{blitz4x4State.weeklyPoints[DAY] ?? "-"}</td>
            <td>{blitz5x5State.weeklyPoints[DAY] ?? "-"}</td>
            <td>{marathonState.weeklyPoints[DAY] ?? "-"}</td>
          </tr>
          <tr>
            <td>Words</td>
            <td>{blitz4x4State.weeklyScores[DAY] ?? "-"}</td>
            <td>{blitz5x5State.weeklyScores[DAY] ?? "-"}</td>
            <td>{marathonState.weeklyScores[DAY] ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <Modal
      closeModal={closeModal}
      modalContent={StatisticsNode(blitz4x4State, blitz5x5State, marathonState)}
      modalTitle="Statistics"
    />
  );
};

export default StatisticsModal;
