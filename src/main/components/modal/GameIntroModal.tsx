import React, { ReactNode } from "react";
import Modal from "./Modal";
import { useTheme } from "../../../theme/Theme";
import { GameMode } from "../../Main";

const fixedStartDate = new Date("2023-05-08T00:00:00-05:00"); // Fixed start date in EST
const now = new Date(); // Current time in local timezone

// Get the UTC timestamp in milliseconds for the fixed start date and the current time
const fixedStartDateUTC = fixedStartDate.getTime();
const nowUTC = now.getTime();

// Get the EST offset in minutes, accounting for daylight savings time
const isDST = now.getTimezoneOffset() < fixedStartDate.getTimezoneOffset();
const estOffset = isDST ? -4 * 60 : -5 * 60; // -4 hours during DST, -5 hours otherwise

// Calculate the difference in hours between the fixed start date and the current time in EST, rounded down to the nearest integer
const hoursDiff = Math.floor(
  (nowUTC - fixedStartDateUTC) / (1000 * 60 * 60) + estOffset / 60
);

// Calculate the number of full days elapsed
const daysDiff = Math.floor(hoursDiff / 24);

interface GameIntroModalProps {
  closeModal: () => void;
  gameMode: GameMode;
  bonusLetter: string;
}

const GameIntroModal = (props: GameIntroModalProps) => {
  const { closeModal, gameMode, bonusLetter } = props;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const ModalTitle =
    gameMode === "blitz4x4"
      ? "4x4 Blitz ⚡"
      : gameMode === "blitz5x5"
      ? "5x5 Blitz  ⏰"
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
        Daily LetterSwap #{daysDiff + 1}
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
