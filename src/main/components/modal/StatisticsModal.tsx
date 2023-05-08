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

  const todaysResults = [
    {
      mode: "4x4 Blitz",
      score: blitz4x4State.weeklyScores[DAY],
      points: blitz4x4State.weeklyPoints[DAY],
    },
    {
      mode: "5x5 Blitz",
      score: blitz5x5State.weeklyScores[DAY],
      points: blitz5x5State.weeklyPoints[DAY],
    },
    {
      mode: "Marathon",
      score: marathonState.weeklyScores[DAY],
      points: marathonState.weeklyPoints[DAY],
    },
  ];

  const StatisticsNode: ReactNode = (
    <div className="modal-content-container">
      <p className="modal-text text-align-center">Today's Results:</p>
      <div className="statistics-todays-results-container">
        <table className="statistics-table">
          <thead>
            <tr>
              <th>Mode</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {todaysResults.map(({ mode, score, points }, index) => (
              <tr key={index}>
                <td className="statistics-table-cell">{mode}</td>
                <td className="statistics-table-cell">
                  {score !== null
                    ? `${score} ${
                        score === 1 ? "word" : "words"
                      } / ${points} points`
                    : "No results today"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Modal
      closeModal={closeModal}
      modalContent={StatisticsNode}
      modalTitle="Statistics"
    />
  );
};

export default StatisticsModal;
