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
  fillNewNextLetters,
  getRandomLetter,
} from "./BoardFunctions";

const DAY = new Date().getDay();

interface BoardProps {
  gameMode: GameMode;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  setShowStatsModal: Dispatch<SetStateAction<boolean>>;
}

const Board = (props: BoardProps) => {
  const { gameMode, gameState, setGameState, setShowStatsModal } = props;

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
  const setNextLetters = useSetGameState("nextLetters");
  const setSwapCount = useSetGameState("swapCount");
  const setFoundWords = useSetGameState("foundWords");
  const setRecentFoundWords = useSetGameState("recentFoundWords");
  const setPoints = useSetGameState("points");
  const setPlayCount = useSetGameState("playCount");
  const setHasPlayed = useSetGameState("hasPlayed");
  const setHasPlayedToday = useSetGameState("hasPlayedToday");
  const setLastPlayedDate = useSetGameState("lastPlayedDate");
  const setWeeklyScores = useSetGameState("weeklyScores");
  const setWeeklyPoints = useSetGameState("weeklyPoints");
  const setUserName = useSetGameState("userName");
  const setGameId = useSetGameState("gameId");

  //Allow flipping animations to happen before allowing user to place another tile
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFlippingFound, setIsFlippingFound] = useState(false);
  //Blitz last second flip
  const [isFlippingFinal, setIsFlippingFinal] = useState(false);

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

  // BLITZ TIMER VARIABLES
  const duration = 2 * 60 * 1001; // 2 minutes in milliseconds
  // const duration = 15 * 1001;
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedState = localStorage.getItem("timeLeft");
    return storedState ? JSON.parse(storedState) : duration;
  });
  const [progress, setProgress] = useState(() => {
    const storedState = localStorage.getItem("progress");
    return storedState ? JSON.parse(storedState) : 100;
  });
  const [timerStarted, setTimerStarted] = useState(() => {
    const storedState = localStorage.getItem("timerStarted");
    return storedState ? JSON.parse(storedState) : false;
  });

  // RESET GAME
  const resetGame = useCallback(() => {
    //reset events from timer - blitz only
    if (gameMode === "blitz") {
      setIsFlipping(false);
      setIsFlippingFinal(false);
      localStorage.removeItem("startTime");
      setTimeLeft(duration);
      setProgress(100);
      setTimerStarted(false);
    }
    setGameState((prevState) => ({
      ...prevState,
      board: gameMode === "blitz" ? fillEmptyBoard(4) : fillEmptyBoard(5),
    }));
    setGameState((prevState) => ({ ...prevState, lastPlayedDate: DAY }));
    setGameState((prevState) => ({
      ...prevState,
      swapCount: gameMode === "blitz" ? 5 : 15,
    }));
    setGameState((prevState) => ({ ...prevState, points: 0 }));
    setGameState((prevState) => ({ ...prevState, foundWords: [] }));
    setGameState((prevState) => ({ ...prevState, recentFoundWords: [] }));
    setGameState((prevState) => ({
      ...prevState,
      nextLetters: fillNewNextLetters(),
    }));
  }, [setGameState, duration, gameMode]);

  // GAME Finish Logic
  const handleGameFinish = useCallback(() => {
    endGameAnimation(260);
    //update daily scores
    if (gameState.points > (gameState.weeklyPoints[DAY] ?? 0)) {
      gameState.weeklyPoints[DAY] = gameState.points;
    }
    if (gameState.foundWords.length > (gameState.weeklyScores[DAY] ?? 0)) {
      gameState.weeklyScores[DAY] = gameState.foundWords.length;
    }
    setTimeout(() => {
      //Temporary until game release
      setShowStatsModal(true);
      resetGame();
    }, 1060);
  }, [
    resetGame,
    setShowStatsModal,
    gameState.foundWords.length,
    gameState.points,
    gameState.weeklyPoints,
    gameState.weeklyScores,
  ]);

  // CHECKING FOR GAME OVER
  useEffect(() => {
    if (gameState.swapCount <= 0) {
      handleGameFinish();
    }
  }, [gameState.swapCount, resetGame, handleGameFinish]);

  ///////////////////////
  // BLITZ TIMER LOGIC //
  ///////////////////////
  useEffect(() => {
    if (gameMode === "blitz") {
      let startTime = localStorage.getItem("startTime");
      let start = startTime ? parseInt(startTime, 10) : new Date().getTime();
      let animationFrameId: number;
      const updateTimer = () => {
        const now = new Date().getTime();
        let diff = duration - (now - start);

        //Handle end of timer logic -- don't allow user to flip a tile when timer is super low
        if (diff <= 250) {
          if (isFlipping) {
            setIsFlippingFinal(true);
          }
          if (diff < 0) {
            if (gameState.swapCount > 0 && !isFlippingFound) {
              setTimerStarted(false);
              handleGameFinish();
              cancelAnimationFrame(animationFrameId);
              return;
            }
          }
        }

        setTimeLeft(diff);
        setProgress((diff / duration) * 100);
        localStorage.setItem("startTime", start.toString());
        animationFrameId = requestAnimationFrame(updateTimer);
      };
      if (timerStarted) {
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
    timerStarted,
    gameState.swapCount,
    isFlippingFound,
    isFlipping,
    handleGameFinish,
  ]);
  useEffect(() => {
    localStorage.setItem("timerStarted", JSON.stringify(timerStarted));
    localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
    localStorage.setItem("progress", JSON.stringify(progress));
  }, [timerStarted, timeLeft, progress]);
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  function handleTimerStart() {
    setTimerStarted(true);
    localStorage.setItem("startTime", new Date().getTime().toString());
  }
  //////////////////////////////////////////////////////////////////////

  // Handle clicked tile
  const handleBoard = (rowIndex: number, colIndex: number, letter: string) => {
    let prevLetter = gameState.board[rowIndex][colIndex];
    const newBoard = [...gameState.board];

    //Animate clicked tile
    const tile = document.getElementById(`${rowIndex}-${colIndex}`);
    applyAnimation(tile, setIsFlipping);

    // Replace letter with new selection
    newBoard[rowIndex][colIndex] = letter;
    setBoard(newBoard);

    //TODO Check if word has been created / wipe it from board if so
    const boardSize = gameMode === "blitz" ? 4 : 5;
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
      setAnimatedPoints
    );

    //TODO Animate swap counter if swap was used
    const swapCounter = document.querySelector(".swaps-container");
    if (prevLetter !== " " && !foundWord) {
      setSwapCount(gameState.swapCount - 1);
      swapCounter?.classList.add("flip");
      setTimeout(() => {
        swapCounter?.classList.remove("flip");
      }, 245);
    }

    // Update next letter
    let currentLetter = getRandomLetter();
    //no duplicates inside next letters boxes
    while (gameState.nextLetters.includes(currentLetter)) {
      currentLetter = getRandomLetter();
    }
    const shiftedArr = gameState.nextLetters.slice(1);
    const newArr = shiftedArr.concat(currentLetter);
    setNextLetters(newArr);
  };

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
    backgroundColor: "var(--light-gray)",
  };
  const emptyTile = {
    backgroundColor: "#FFFFFF",
  };

  return (
    <div className="board-container" ref={boardHeight}>
      {/* HUD */}
      <div className="hud-container">
        <div className="swaps-container">
          <b>Swaps</b>
          <span>{gameState.swapCount}</span>
        </div>
        <div className="next-letters-container">
          <b className="next-letters-title">Next:</b>
          {gameState.nextLetters.map((letter, index) => (
            <div
              key={index}
              className={index === 0 ? "tile tile-medium" : "tile tile-small"}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
      {/* BLITZ ONLY - Progress Bar Timer */}
      {gameMode === "blitz" && (
        <div className="progress-bar-container">
          <div className="progress-bar">
            <b>
              {minutes < 0
                ? "0:00"
                : `${minutes}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`}
            </b>
          </div>
          <div className="progress-background">
            <div
              className="progress"
              style={{
                width: `${progress}%`,
                backgroundColor:
                  minutes === 0 && seconds <= 30
                    ? "var(--red)"
                    : minutes >= 1
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
                className={gameMode === "blitz" ? "tile-blitz" : "tile"}
                id={`${rowIndex}-${colIndex}`}
                key={`${rowIndex}-${colIndex}`}
                style={mergeStyles(letter !== " " ? filledTile : emptyTile)}
                onClick={() => {
                  if (
                    !isFlipping &&
                    !isFlippingFound &&
                    !isFlippingFinal &&
                    gameState.swapCount > 0
                  ) {
                    if (gameMode === "blitz" && !timerStarted) {
                      handleTimerStart();
                    }
                    handleBoard(rowIndex, colIndex, gameState.nextLetters[0]);
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
          className="found-words-box"
          onClick={() => {
            toggleFoundWordsBox();
          }}
          style={{
            height: foundWordsExpand ? `${foundWordsExpandHeight + 20}px` : "",
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
