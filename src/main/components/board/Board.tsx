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

  return <div className="board-container">board</div>;
};

export default Board;
