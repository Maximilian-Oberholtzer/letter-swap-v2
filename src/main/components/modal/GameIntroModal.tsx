import React, { ReactNode } from "react";
import Modal from "./Modal";
import { useTheme } from "../../../theme/Theme";
import { GameMode } from "../../Main";
import { getDaysElapsedSince } from "../../../DayCounter";

interface GameIntroModalProps {
  closeModal: () => void;
  gameMode: GameMode;
  bonusLetter: string;
}

const GameIntroModal = (props: GameIntroModalProps) => {
  const { closeModal, gameMode, bonusLetter } = props;

  const daysElapsed = getDaysElapsedSince();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const ModalTitle =
    gameMode === "blitz4x4"
      ? "4x4 Blitz ⚡"
      : gameMode === "blitz5x5"
      ? "5x5 Blitz ⏰"
      : "Marathon 🏃";

  const GameIntroNode: ReactNode = (
    <div className="modal-content-container">
      <div className="modal-text text-align-center">
        Create as many {gameMode === "blitz4x4" ? "4-letter" : "5-letter"} words
        as possible
        {gameMode === "blitz4x4"
          ? " within 3 minutes."
          : gameMode === "blitz5x5"
          ? " within 5 minutes."
          : "."}{" "}
        Each puzzle has a <b>FIXED</b> letter sequence per day.
      </div>
      <div className="modal-text text-align-center">
        Your leaderboard <b>USERNAME</b> can be changed in the settings.
      </div>
      <div className="bonus-letter-container">
        <div className="settings-text text-align-center">
          Today's <b>BONUS</b> Letter:{" "}
        </div>
        <div
          className={`tile tile-medium bonus-tile-border ${
            isDark ? "backgorund-tile-dark" : "background-tile-light"
          }`}
        >
          {bonusLetter}
        </div>
      </div>

      <div
        className="modal-text text-align-center"
        style={{ color: "#818181" }}
      >
        Daily LetterSwap #{daysElapsed + 1}
      </div>
    </div>
  );

  return (
    <Modal
      closeModal={closeModal}
      modalContent={GameIntroNode}
      modalTitle={ModalTitle}
    />
  );
};

export default GameIntroModal;
