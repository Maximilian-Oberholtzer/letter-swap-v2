import React from "react";
import { GameState } from "../../Main";
import "./board.css";

const hudContainer = (nextLetters: string[], swapCount: number) => (
  <div className="hud-container">
    <div className="swaps-container" aria-label="Swap Count">
      <b>Swaps: </b>
      <div>{swapCount >= 0 ? swapCount : 0}</div>
    </div>
    <div className="next-letters-container" aria-label="Next Letters">
      <b className="next-letters-title">Next:</b>
      {nextLetters.map((letter, index) => (
        <div
          key={index}
          className={index === 0 ? "tile medium-tile" : "tile small-tile"}
        >
          {letter}
        </div>
      ))}
    </div>
  </div>
);

const boardContainer = (board: string[][]) => (
  <div className="board">
    {board.map((row, rowIndex) => (
      <div key={rowIndex}>
        {row.map((letter, colIndex) => (
          <div
            className="tile"
            id={`${rowIndex}-${colIndex}`}
            key={`${rowIndex}-${colIndex}`}
          >
            {letter}
          </div>
        ))}
      </div>
    ))}
  </div>
);

interface BoardProps {
  gameState: GameState;
}

const Board = (props: BoardProps) => {
  const { gameState } = props;
  console.log(gameState);
  return (
    <section className="board-section">
      <div className="board-container">
        {hudContainer(gameState.nextLetters, gameState.swapCount)}
        {boardContainer(gameState.board)}
      </div>
    </section>
  );
};

export default Board;
