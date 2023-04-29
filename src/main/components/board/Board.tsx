import React, { useEffect, useRef, useState } from "react";
import { GameState } from "../../Main";
import "./board.css";

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

const foundWordsContainer = (
  foundWords: string[],
  recentFoundWords: string[],
  points: number,
  foundWordsExpand: boolean,
  foundWordsExpandHeight: number,
  toggleFoundWordsBox: () => void
) => (
  <div className="found-words-container" aria-label="Found Words">
    {/* <div className="animated-points">+{animatedPoints}</div> */}
    <div
      className="found-words-box"
      style={{
        height: foundWordsExpand ? `${foundWordsExpandHeight}px` : "",
        overflow: foundWordsExpand ? "auto" : "hidden",
        transition:
          "height 0.5s ease-out, width 0.5s, 300ms background-color, 300ms color, 300ms border",
      }}
      tabIndex={0}
      onClick={() => {
        toggleFoundWordsBox();
      }}
    >
      <div className="found-word-title">
        <div className="found-word-right-column">
          Words: <b>{foundWords.length}</b>
        </div>
        <div className="middle-divider">|</div>
        <div className="found-word-left-column">
          Points: <b>{points}</b>
        </div>
      </div>
      <div className="found-words-list">
        {foundWordsExpand &&
          foundWords.sort().map((word, i) => (
            <div className="found-word-text" key={i}>
              {recentFoundWords.includes(word) ? <b>{word}</b> : <>{word}</>}
            </div>
          ))}
      </div>
    </div>
  </div>
);

interface BoardProps {
  gameState: GameState;
}

const Board = (props: BoardProps) => {
  const { gameState } = props;

  //for calculating hieght for found words container
  const [foundWordsExpand, setFoundWordsExpand] = useState<boolean>(false);
  const [foundWordsExpandHeight, setWordsExpandHeight] = useState<number>(0);
  const boardHeight = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (boardHeight.current) {
      const containerHeight = boardHeight.current.clientHeight;
      setWordsExpandHeight(containerHeight);
    }
  }, [foundWordsExpand]);

  const toggleFoundWordsBox = () => {
    setFoundWordsExpand(!foundWordsExpand);
  };

  return (
    <section className="board-section">
      <div className="board-container" ref={boardHeight}>
        {hudContainer(gameState.nextLetters, gameState.swapCount)}
        {boardContainer(gameState.board)}
        {foundWordsContainer(
          gameState.foundWords,
          gameState.recentFoundWords,
          gameState.points,
          foundWordsExpand,
          foundWordsExpandHeight,
          toggleFoundWordsBox
        )}
      </div>
    </section>
  );
};

export default Board;
