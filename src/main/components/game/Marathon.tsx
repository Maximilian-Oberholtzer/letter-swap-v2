import React from "react";
import { GameState } from "../../Main";
import Board from "../board/Board";

interface MarathonProps {
  marathonState: GameState;
}

const Marathon = (props: MarathonProps) => {
  const { marathonState } = props;
  return (
    <>
      <Board gameState={marathonState} />
    </>
  );
};

export default Marathon;
