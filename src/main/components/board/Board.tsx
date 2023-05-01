import React, { Dispatch, SetStateAction, useCallback } from "react";
import "./board.css";
import { GameMode } from "../../Main";
import { GameState } from "../../Main";

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

  // Logic specific to blitz

  // Conditional Styles
  const mergeStyles = (
    ...styles: React.CSSProperties[]
  ): React.CSSProperties => {
    return styles.reduce(
      (mergedStyles, style) => ({ ...mergedStyles, ...style }),
      {}
    );
  };

  return (
    <div className="board-container">
      {/* Board Component */}
      <div className="board">
        {gameState.board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((letter, colIndex) => (
              <div
                className="tile"
                id={`${rowIndex}-${colIndex}`}
                key={`${rowIndex}-${colIndex}`}
                onClick={() => {
                  console.log(1);
                }}
              >
                {letter}B
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
