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
  getRandomLetter,
} from "./BoardFunctions";

interface BoardProps {
  gameMode: GameMode;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}

const Board = (props: BoardProps) => {
  const { gameMode, gameState, setGameState } = props;

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
  const setTimeRemaining = useSetGameState("timeRemaining");
  const setHasPlayed = useSetGameState("hasPlayed");
  const setLastPlayedDate = useSetGameState("lastPlayedDate");
  const setWeeklyScores = useSetGameState("weeklyScores");
  const setWeeklyPoints = useSetGameState("weeklyPoints");
  const setUserName = useSetGameState("userName");
  const setGameId = useSetGameState("gameId");

  //Allow flipping animations to happen before allowing user to place another tile
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFlippingFound, setIsFlippingFound] = useState(false);
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

  // Logic specific to blitz

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
    const foundWord = checkForWords(
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
      }, 250);
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
      {/* Board Component */}
      <div className="board">
        {gameState.board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((letter, colIndex) => (
              <div
                className="tile"
                id={`${rowIndex}-${colIndex}`}
                key={`${rowIndex}-${colIndex}`}
                style={mergeStyles(letter !== " " ? filledTile : emptyTile)}
                onClick={() => {
                  if (!isFlipping && !isFlippingFound) {
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
            height: foundWordsExpand ? `${foundWordsExpandHeight + 10}px` : "",
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
