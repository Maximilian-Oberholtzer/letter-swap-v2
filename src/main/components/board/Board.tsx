import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./board.css";
import { GameMode } from "../../Main";
import { GameState } from "../../Main";
import {
  applyAnimation,
  checkForWords,
  fillEmptyBoard,
  generateFixedNextLetters,
  generateGameId,
} from "./BoardFunctions";
import Confetti from "react-confetti";
import { useTheme } from "../../../theme/Theme";
import GameIntroModal from "../modal/GameIntroModal";
import GameOverModal from "../modal/GameOverModal";

const DAY = new Date().getDay();

interface BoardProps {
  gameMode: GameMode;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  soundEnabled: boolean;
}

const Board = (props: BoardProps) => {
  const { gameMode, gameState, setGameState, soundEnabled } = props;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Updating game state for selected mode
  const useSetGameState = (key: string) => {
    return useCallback(
      (value: any) => {
        setGameState((prevState) => ({ ...prevState, [key]: value }));
      },
      [key]
    );
  };
  const setBoard = useSetGameState("board");
  const setMoveCount = useSetGameState("moveCount");
  const setTimerTimeLeft = useSetGameState("timerTimeLeft");
  const setTimerProgress = useSetGameState("timerProgress");
  const setTimerStarted = useSetGameState("timerStarted");
  const setTimerStartTime = useSetGameState("timerStartTime");
  const setSwapCount = useSetGameState("swapCount");
  const setFoundWords = useSetGameState("foundWords");
  const setRecentFoundWords = useSetGameState("recentFoundWords");
  const setPoints = useSetGameState("points");
  const setGameStarted = useSetGameState("gameStarted");
  const setHasPlayedToday = useSetGameState("hasPlayedToday");
  const setLastPlayedDate = useSetGameState("lastPlayedDate");
  const setWeeklyScores = useSetGameState("weeklyScores");
  const setWeeklyPoints = useSetGameState("weeklyPoints");
  const setGameId = useSetGameState("gameId");

  //Allow flipping animations to happen before allowing user to place another tile
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFlippingFound, setIsFlippingFound] = useState(false);
  //Blitz last second flip
  const [isFlippingFinal, setIsFlippingFinal] = useState(false);
  //Animation when loading back in - wait to click tile
  const [isFlippingLoadingAnimation, setIsFlippingLoadingAnimation] =
    useState(false);

  // Set Bonus Letter
  const bonusLetter = generateFixedNextLetters(1, 4);

  //Completed game animation when user loads back in to app
  const endGameAnimation = (delay: number) => {
    const row = 5;
    const col = 5;
    setTimeout(() => {
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          setTimeout(() => {
            const tile = document.getElementById(`${i}-${j}`);
            tile?.classList.add("flip");
            setTimeout(() => {
              tile?.classList.remove("flip");
            }, 250);
          }, i * 100);
        }
      }
    }, delay);
  };

  //Animated current points effect
  const [animatedPoints, setAnimatedPoints] = useState(0);
  //Easter egg effects
  const [effect, setEffect] = useState<string>("");
  //Remove easter egg effects after 6 seconds
  useEffect(() => {
    setTimeout(() => {
      setEffect("");
    }, 6000);
  }, [effect]);

  //Handle Dynamic Height for Found Words container
  const [foundWordsExpand, setFoundWordsExpand] = useState(false);
  const [foundWordsExpandHeight, setWordsExpandHeight] = useState(0);
  const boardHeight = useRef<HTMLDivElement>(null);
  const toggleFoundWordsBox = () => {
    setFoundWordsExpand(!foundWordsExpand);
  };
  useEffect(() => {
    if (boardHeight.current) {
      const containerHeight = boardHeight.current.clientHeight;
      setWordsExpandHeight(containerHeight);
    }
  }, [foundWordsExpand]);

  //Show intro modal if game has not started
  const [showIntroModal, setShowInroModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  useEffect(() => {
    if (!gameState.gameStarted) {
      setShowInroModal(true);
    }
  }, [gameState.gameStarted]);

  // BLITZ TIMER VARIABLES
  const duration = gameMode === "blitz4x4" ? 3 * 60 * 1001 : 5 * 60 * 1001;

  // RESET GAME
  const resetGame = useCallback(() => {
    setGameStarted(false);
    setHasPlayedToday(false);
    setGameId(generateGameId());
    //reset events from timer - blitz only
    if (gameMode === "blitz4x4" || gameMode === "blitz5x5") {
      setIsFlipping(false);
      setIsFlippingFinal(false);
      localStorage.removeItem(gameState.timerStartTime.toString());
      setTimerTimeLeft(duration);
      setTimerProgress(100);
      setTimerStarted(false);
    }
    setGameState((prevState) => ({
      ...prevState,
      board: gameMode === "blitz4x4" ? fillEmptyBoard(4) : fillEmptyBoard(5),
    }));
    setGameState((prevState) => ({ ...prevState, lastPlayedDate: DAY }));
    setGameState((prevState) => ({
      ...prevState,
      swapCount:
        gameMode === "blitz4x4" ? 5 : gameMode === "blitz5x5" ? 10 : 15,
    }));
    setGameState((prevState) => ({ ...prevState, moveCount: 0 }));
    setGameState((prevState) => ({ ...prevState, points: 0 }));
    setGameState((prevState) => ({ ...prevState, foundWords: [] }));
    setGameState((prevState) => ({ ...prevState, recentFoundWords: [] }));
  }, [
    setGameState,
    setGameId,
    setGameStarted,
    setHasPlayedToday,
    duration,
    gameMode,
    gameState.timerStartTime,
    setTimerProgress,
    setTimerStarted,
    setTimerTimeLeft,
  ]);

  //NEW DAY - GAME RESET
  useEffect(() => {
    if (gameState.lastPlayedDate !== DAY) {
      setLastPlayedDate(DAY);
      resetGame();
    } else {
      if (gameState.hasPlayedToday) {
        //Animate when user loads into finished game
        setIsFlippingLoadingAnimation(true);
        setTimeout(() => {
          endGameAnimation(260);
        }, 100);
        setTimeout(() => {
          setShowGameOverModal(true);
          setIsFlippingLoadingAnimation(false);
        }, 1100);
      }
    }
  }, [
    resetGame,
    gameState.lastPlayedDate,
    setLastPlayedDate,
    gameState.hasPlayedToday,
    setShowGameOverModal,
  ]);

  // GAME Finish Logic
  const handleGameFinish = useCallback(() => {
    setSwapCount(-1);
    setHasPlayedToday(true);
    setLastPlayedDate(DAY);
    endGameAnimation(260);
    //update weekly scores
    const weeklyScoreArr = [...gameState.weeklyScores];
    const weeklyPointsArr = [...gameState.weeklyPoints];
    weeklyScoreArr[DAY] = gameState.foundWords.length;
    weeklyPointsArr[DAY] = gameState.points;
    setWeeklyScores(weeklyScoreArr);
    setWeeklyPoints(weeklyPointsArr);
    setTimeout(() => {
      setShowGameOverModal(true);
    }, 1060);
  }, [
    setSwapCount,
    setHasPlayedToday,
    setWeeklyPoints,
    setWeeklyScores,
    setLastPlayedDate,
    setShowGameOverModal,
    gameState.foundWords.length,
    gameState.points,
    gameState.weeklyPoints,
    gameState.weeklyScores,
  ]);

  // CHECKING FOR GAME OVER
  useEffect(() => {
    if (gameState.swapCount === 0) {
      handleGameFinish();
    }
  }, [gameState.swapCount, resetGame, handleGameFinish]);

  ///////////////////////
  // BLITZ TIMER LOGIC //
  ///////////////////////
  useEffect(() => {
    if (gameMode === "blitz4x4" || gameMode === "blitz5x5") {
      let start = parseInt(gameState.timerStartTime, 10);
      let animationFrameId: number;
      const updateTimer = () => {
        const now = new Date().getTime();
        let diff = duration - (now - start);

        if (gameState.swapCount <= 0) {
          cancelAnimationFrame(animationFrameId);
          return;
        }

        //Handle end of timer logic -- don't allow user to flip a tile when timer is super low
        if (diff <= 250) {
          if (isFlipping) {
            setIsFlippingFinal(true);
          }
          if (diff < 0) {
            cancelAnimationFrame(animationFrameId);
            if (gameState.swapCount > 0 && !isFlippingFound) {
              setTimerStarted(false);
              handleGameFinish();
              return;
            }
          }
        }

        setTimerTimeLeft(diff);
        setTimerProgress((diff / duration) * 100);
        setTimerStartTime(start);
        animationFrameId = requestAnimationFrame(updateTimer);
      };
      if (gameState.timerStarted) {
        animationFrameId = requestAnimationFrame(updateTimer);
      }
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [
    gameMode,
    duration,
    resetGame,
    gameState.timerStartTime,
    setTimerProgress,
    setTimerStartTime,
    setTimerStarted,
    setTimerTimeLeft,
    gameState.timerStarted,
    gameState.swapCount,
    isFlippingFound,
    isFlipping,
    handleGameFinish,
  ]);
  const minutes = Math.floor(
    (gameState.timerTimeLeft % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((gameState.timerTimeLeft % (1000 * 60)) / 1000);
  function handleTimerStart() {
    setTimerStarted(true);
    setTimerStartTime(new Date().getTime().toString());
  }
  //////////////////////////////////////////////////////////////////////

  // Handle clicked tile
  const handleBoard = (rowIndex: number, colIndex: number, letter: string) => {
    let prevLetter = gameState.board[rowIndex][colIndex];
    const newBoard = [...gameState.board];

    //set game started
    if (!gameState.gameStarted) {
      setGameStarted(true);
    }

    //Animate clicked tile
    const tile = document.getElementById(`${rowIndex}-${colIndex}`);
    applyAnimation(tile, setIsFlipping);

    // Replace letter with new selection
    newBoard[rowIndex][colIndex] = letter;
    setBoard(newBoard);

    //Check if word has been created / wipe it from board if so
    const boardSize = gameMode === "blitz4x4" ? 4 : 5;
    const foundWord = checkForWords(
      boardSize,
      newBoard,
      setBoard,
      gameState.foundWords,
      setFoundWords,
      setRecentFoundWords,
      setIsFlippingFound,
      gameState.points,
      setPoints,
      bonusLetter[0],
      setAnimatedPoints,
      setEffect,
      soundEnabled
    );

    //Animate swap counter if swap was used
    const swapCounter = document.querySelector(".swaps-container");
    if (prevLetter !== " " && !foundWord) {
      setSwapCount(gameState.swapCount - 1);
      swapCounter?.classList.add("flip");
      setTimeout(() => {
        swapCounter?.classList.remove("flip");
      }, 245);
    }

    //Update move count
    setMoveCount(gameState.moveCount + 1);
  };

  // Next letters controller
  let nextLetterArr: string[] = [];
  if (gameMode === "blitz4x4") {
    nextLetterArr = generateFixedNextLetters(1200, 1);
  } else if (gameMode === "blitz5x5") {
    nextLetterArr = generateFixedNextLetters(2000, 2);
  } else if (gameMode === "marathon") {
    nextLetterArr = generateFixedNextLetters(5000, 3);
  }
  let nextLetters = [
    nextLetterArr[gameState.moveCount],
    nextLetterArr[gameState.moveCount + 1],
    nextLetterArr[gameState.moveCount + 2],
  ];

  // Conditional Styles
  const mergeStyles = (
    ...styles: React.CSSProperties[]
  ): React.CSSProperties => {
    return styles.reduce(
      (mergedStyles, style) => ({ ...mergedStyles, ...style }),
      {}
    );
  };
  const filledTile = {
    backgroundColor: isDark
      ? "var(--dark-tile-color)"
      : "var(--light-tile-color)",
    border: isDark
      ? "0.15rem solid var(--dark-tile-color)"
      : "0.15rem solid var(--light-tile-color)",
  };
  const emptyTile = {
    backgroundColor: isDark
      ? "var(--dark-background)"
      : "var(--light-background)",
    border: isDark
      ? "0.15rem solid var(--dark-tile-color)"
      : "0.15rem solid var(--light-tile-color)",
  };
  const bonusTile = {
    backgroundColor: "var(--yellow)",
    color: "#ffffff",
    border: "0.15rem solid var(--yellow)",
  };

  return (
    <div className="board-container" ref={boardHeight}>
      {/* Easter Egg Effects */}
      {effect === "confetti" && (
        <Confetti
          style={{ zIndex: "2000" }}
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={400}
          tweenDuration={12000}
          recycle={false}
          onConfettiComplete={() => {
            setEffect("");
          }}
        />
      )}
      {/* Intro and Game end Modals */}
      {showIntroModal && (
        <GameIntroModal
          closeModal={() => {
            setShowInroModal(false);
          }}
          gameMode={gameMode}
          bonusLetter={bonusLetter[0]}
        />
      )}
      {showGameOverModal && (
        <GameOverModal
          closeModal={() => {
            setShowGameOverModal(false);
          }}
          gameMode={gameMode}
          gameState={gameState}
        />
      )}
      {/* HUD */}
      <div className="hud-container">
        <div className="swaps-container">
          <b>Swaps</b>
          <span>{gameState.swapCount > 0 ? gameState.swapCount : "0"}</span>
        </div>
        <div className="next-letters-container">
          <b className="next-letters-title">Next:</b>
          {nextLetters.map((letter, index) => (
            <div
              key={index}
              style={mergeStyles(
                letter === bonusLetter[0] ? bonusTile : filledTile
              )}
              className={index === 0 ? "tile tile-medium" : "tile tile-small"}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
      {/* BLITZ ONLY - Progress Bar Timer */}
      {(gameMode === "blitz4x4" || gameMode === "blitz5x5") && (
        <div className="progress-bar-container">
          <div className="progress-bar">
            <b>
              {minutes < 0
                ? "0:00"
                : `${minutes}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`}
            </b>
          </div>
          <div
            className={`progress-background ${
              isDark ? "background-tile-dark" : "background-tile-light"
            }`}
          >
            <div
              className="progress"
              style={{
                width: `${gameState.timerProgress}%`,
                backgroundColor:
                  gameMode === "blitz4x4"
                    ? minutes === 0 && seconds <= 30
                      ? "var(--red)"
                      : minutes * 60 + seconds > 90
                      ? "var(--green)"
                      : "var(--yellow)"
                    : minutes === 0
                    ? "var(--red)"
                    : minutes * 60 + seconds > 150
                    ? "var(--green)"
                    : "var(--yellow)",
              }}
            />
          </div>
        </div>
      )}

      {/* Board Component */}
      <div className="board">
        {gameState.board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((letter, colIndex) => (
              <div
                className={gameMode === "blitz4x4" ? "tile-blitz" : "tile"}
                id={`${rowIndex}-${colIndex}`}
                key={`${rowIndex}-${colIndex}`}
                style={mergeStyles(
                  letter === " "
                    ? emptyTile
                    : letter === bonusLetter[0]
                    ? bonusTile
                    : filledTile
                )}
                onClick={() => {
                  if (
                    !isFlipping &&
                    !isFlippingFound &&
                    !isFlippingFinal &&
                    gameState.swapCount > 0
                  ) {
                    if (
                      (gameMode === "blitz4x4" || gameMode === "blitz5x5") &&
                      !gameState.timerStarted
                    ) {
                      handleTimerStart();
                    }
                    handleBoard(rowIndex, colIndex, nextLetters[0]);
                  } else if (
                    gameState.hasPlayedToday &&
                    !isFlippingLoadingAnimation
                  ) {
                    setShowGameOverModal(true);
                  }
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Found Words Container */}
      <div className="found-words-container">
        <div
          className={`found-words-box ${
            isDark ? "background-dark" : "background-light"
          }`}
          onClick={() => {
            toggleFoundWordsBox();
          }}
          style={{
            height: foundWordsExpand ? `${foundWordsExpandHeight + 25}px` : "",
            overflow: foundWordsExpand ? "auto" : "hidden",
            transition:
              "height 0.5s ease-out, width 0.5s, 300ms background-color, 300ms color, 300ms border",
          }}
        >
          <div className="found-words-title-container">
            <div className="animated-points">+{animatedPoints}</div>
            <div className="found-word-right-column">
              Words: <b>{gameState.foundWords.length}</b>
            </div>
            <div className="middle-divider">|</div>
            <div className="found-word-left-column">
              Points: <b>{gameState.points}</b>
            </div>
          </div>
          <div className="found-words-list">
            {foundWordsExpand &&
              gameState.foundWords.sort().map((word, i) => (
                <div className="found-word-text" key={i}>
                  {gameState.recentFoundWords.includes(word) ? (
                    <b className={"found-word-text recent-found-word-text"}>
                      {word}
                    </b>
                  ) : (
                    <>{word}</>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
