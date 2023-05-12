import React, { ReactNode, useState } from "react";
import Modal from "./Modal";
import { LeaderboardEntry } from "../leaderboard/leaderboardFunctions";
import { useTheme } from "../../../theme/Theme";

interface LeaderboardModalProps {
  closeModal: () => void;
  leaderboardData: any[];
}

const LeaderboardModal = (props: LeaderboardModalProps) => {
  const { closeModal, leaderboardData } = props;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedGameMode, setSelectedGameMode] = useState("blitz4x4");
  const [selectedLeaderboardType, setSelectedLeaderboardType] =
    useState("daily");

  const selectedLeaderboard = leaderboardData.find(
    (leaderboard) => leaderboard.gameMode === selectedGameMode
  )?.data[selectedLeaderboardType];

  const LeaderboardNode: ReactNode = (
    <div className="modal-content-container">
      <div className="leaderboard-select-container">
        <select
          className={`leaderboard-select ${
            isDark ? "leaderboard-select-dark" : "leaderboard-select-light"
          }`}
          value={selectedGameMode}
          onChange={(e) => setSelectedGameMode(e.target.value)}
        >
          <option value="blitz4x4">Blitz 4x4</option>
          <option value="blitz5x5">Blitz 5x5</option>
          <option value="marathon">Marathon</option>
        </select>
        <select
          className={`leaderboard-select ${
            isDark ? "leaderboard-select-dark" : "leaderboard-select-light"
          }`}
          value={selectedLeaderboardType}
          onChange={(e) => setSelectedLeaderboardType(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="allTime">All Time</option>
        </select>
      </div>

      {leaderboardData.length === 0 ? (
        <p className="modal-text text-align-center">
          Error fetching leaderboard data ❌
        </p>
      ) : (
        <div className="leaderboard-table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Words</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {selectedLeaderboard?.map(
                (entry: LeaderboardEntry, index: number) => (
                  <tr key={index}>
                    <td className="leaderboard-table-cell">
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : index + 1}
                    </td>
                    <td className="leaderboard-table-cell">{entry.name}</td>
                    <td className="leaderboard-table-cell">{entry.score}</td>
                    <td className="leaderboard-table-cell">{entry.points}</td>
                  </tr>
                )
              )}
              {selectedLeaderboard.length < 10 &&
                Array(10 - selectedLeaderboard.length)
                  .fill(null)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="leaderboard-table-cell">
                        {index + selectedLeaderboard.length === 0
                          ? "🥇"
                          : index + selectedLeaderboard.length === 1
                          ? "🥈"
                          : index + selectedLeaderboard.length === 2
                          ? "🥉"
                          : index + 1 + selectedLeaderboard.length}
                      </td>
                      <td className="leaderboard-table-cell">MMMMMMMM</td>
                      <td className="leaderboard-table-cell">-</td>
                      <td className="leaderboard-table-cell">-</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
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
