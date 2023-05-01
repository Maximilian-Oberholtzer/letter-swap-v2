import React from "react";
import "./board.css";
import { GameMode } from "../../Main";
import { GameState } from "../../Main";

interface BoardProps {
  gameMode: GameMode;
  gameState: GameState;
}

const Board = (props: BoardProps) => {
  const { gameMode, gameState } = props;
  return <div className="board-container"></div>;
};

export default Board;
