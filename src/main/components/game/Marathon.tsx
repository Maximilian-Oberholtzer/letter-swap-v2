import React from "react";
import { GameState } from "../../Main";

interface MarathonProps {
  marathonState: GameState;
}

const Marathon = (props: MarathonProps) => {
  const { marathonState } = props;
  return <div>Marathon</div>;
};

export default Marathon;
