import React from "react";
import { GameState } from "../../Main";

interface BlitzProps {
  blitzState: GameState;
}

const Blitz = (props: BlitzProps) => {
  const { blitzState } = props;
  return <div>Blitz</div>;
};

export default Blitz;
