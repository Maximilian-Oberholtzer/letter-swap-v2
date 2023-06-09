import React, {
  ReactNode,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import Modal from "./Modal";
import { useTheme } from "../../../theme/Theme";
import { GameMode, GameState } from "../../Main";
import { getDaysElapsedSince } from "../../../DayCounter";
import { intervalToDuration } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { writeToLeaderboard } from "../leaderboard/leaderboardFunctions";
import { isMobile } from "react-device-detect";
import { bannedWords } from "../../../words/bannedWords";

interface GameOverModalProps {
  closeModal: () => void;
  gameMode: GameMode;
  gameState: GameState;
  setSubmittedScore: Dispatch<SetStateAction<boolean>>;
  username: string;
  setCopyToClipboard: Dispatch<SetStateAction<boolean>>;
}

//Function to share score at end of the game
const handleShare = async (
  score: number,
  points: number,
  rank: string,
  gameTitle: string,
  setCopyToClipboard: Dispatch<SetStateAction<boolean>>
) => {
  const data = {
    title: `Daily LetterSwap #${getDaysElapsedSince() + 1}`,
    text: `Daily LetterSwap #${
      getDaysElapsedSince() + 1
    }\n${gameTitle}: ${rank}\n${score} ${
      score === 1 ? "word" : "words"
    } for ${points} points.`,
    url: window.location.href,
  };

  if (isMobile) {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(data);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard
        .writeText(`${data.title}\n${data.text}\n${data.url}`)
        .then(() => {
          setCopyToClipboard(true);
        })
        .catch((err) => {
          console.error("Error trying to copy text to clipboard: ", err);
        });
    }
  } else {
    navigator.clipboard
      .writeText(`${data.title}\n${data.text}\n${data.url}`)
      .then(() => {
        setCopyToClipboard(true);
      })
      .catch((err) => {
        console.error("Error trying to copy text to clipboard: ", err);
      });
  }
};

const GameOverModal = (props: GameOverModalProps) => {
  const {
    closeModal,
    gameMode,
    gameState,
    setSubmittedScore,
    username,
    setCopyToClipboard,
  } = props;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  //Set valid username for table entry
  let name = "";
  if (
    username === "" ||
    bannedWords.includes(username.toLowerCase()) ||
    username.length > 10
  ) {
    name = "User" + gameState.gameId.toString().substring(0, 4);
  } else {
    name = username;
  }

  //Try to write score to leaderboard
  useEffect(() => {
    let entry = {
      id: gameState.gameId,
      name: name,
      score: gameState.foundWords.length,
      points: gameState.points,
      gameMode: gameMode,
      foundWords: gameState.foundWords,
      recentFoundWords: gameState.recentFoundWords,
    };
    //Check if entry should be added
    if (entry.points > 0 && !gameState.submittedScore) {
      writeToLeaderboard(entry, setSubmittedScore);
      // console.log("Entry added to db");
    }
  }, [
    name,
    gameMode,
    gameState.foundWords,
    gameState.gameId,
    gameState.points,
    gameState.recentFoundWords,
    gameState.submittedScore,
    setSubmittedScore,
  ]);

  //COUNTDOWN TIMER TO NEXT PUZZLE
  const [timeRemaining, setTimeRemaining] = useState("");
  useEffect(() => {
    const onTimerComplete = () => {
      // Refresh the page when the timer hits 0
      setTimeout(() => {
        window.location.reload();
      }, 900);
    };
    const updateTimeRemaining = () => {
      const currentTime = utcToZonedTime(new Date(), "America/New_York");
      const midnight = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate() + 1,
        0,
        0,
        0
      );
      const duration = intervalToDuration({
        start: currentTime,
        end: midnight,
      });

      const hours = String(duration.hours || 0).padStart(2, "0");
      const minutes = String(duration.minutes || 0).padStart(2, "0");
      const seconds = String(duration.seconds || 0).padStart(2, "0");

      if (hours === "00" && minutes === "00" && seconds === "00") {
        onTimerComplete();
      }

      setTimeRemaining(`${hours}:${minutes}:${seconds}`);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  const daysElapsed = getDaysElapsedSince();

  const ModalTitle =
    gameMode === "blitz4x4"
      ? "4x4 Blitz ⚡"
      : gameMode === "blitz5x5"
      ? "5x5 Blitz ⏰"
      : "Marathon 🏃";

  const rankInfo = {
    title: [
      "⭐",
      "⭐⭐",
      "⭐⭐⭐",
      "⭐⭐⭐⭐",
      "⭐⭐⭐⭐⭐",
      "Master ✨",
      "Grandmaster 🌠",
    ],
    blitz4x4Points: [0, 20, 40, 75, 100, 140, 180],
    blitz5x5Points: [0, 20, 40, 75, 100, 120, 150],
    marathonPoints: [0, 50, 100, 200, 300, 400, 500],
  };

  const rankArr =
    gameMode === "blitz4x4"
      ? rankInfo.blitz4x4Points
      : gameMode === "blitz5x5"
      ? rankInfo.blitz5x5Points
      : rankInfo.marathonPoints;

  let rank = "";

  for (let i = 0; i < rankArr.length; i++) {
    if (gameState.points >= rankArr[i]) {
      rank = rankInfo.title[i];
    }
  }

  const GameOverNode: ReactNode = (
    <div className="modal-content-container">
      <div className="modal-text text-align-center">Today's Rank: {rank}</div>
      <div className="modal-text text-align-center">
        You found{" "}
        <b>
          {gameState.foundWords.length}{" "}
          {gameState.foundWords.length === 1 ? "word" : "words"}
        </b>{" "}
        for <b>{gameState.points} points.</b>
      </div>
      <div className="game-over-modal-bottom-container">
        <div className="game-over-countdown-container">
          <div style={{ color: "#818181" }}>Next Puzzle</div>
          <div>{timeRemaining}</div>
        </div>

        <button
          id="share-button"
          type="button"
          aria-label="Share"
          onClick={() => {
            handleShare(
              gameState.foundWords.length,
              gameState.points,
              rank,
              ModalTitle,
              setCopyToClipboard
            );
          }}
          className={`share-button outline ${
            isDark ? "share-button-dark" : "share-button-light"
          }`}
          style={{
            backgroundColor: isDark
              ? "var(--dark-tile-color)"
              : "var(--light-tile-color)",
          }}
        >
          Share{" "}
          <svg
            className="share-svg"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        </button>
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
      modalContent={GameOverNode}
      modalTitle={ModalTitle}
    />
  );
};

export default GameOverModal;
