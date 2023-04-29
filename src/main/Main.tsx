import React, { useState, useEffect } from "react";
import { useTheme } from "../theme/Theme";
import "./main.css";
import Menu from "./components/menu/Menu";
import Blitz from "./components/game/Blitz";
import Marathon from "./components/game/Marathon";
import Appbar from "./components/appbar/Appbar";
import {
  fillEmptyBoard,
  fillNewNextLetters,
  generateGameId,
} from "./components/board/BoardFunctions";

const SWAPCOUNT = 15;
const DAY = new Date().getDay();

export interface GameState {
  board: string[][];
  nextLetters: string[];
  swapCount: number;
  foundWords: string[];
  recentFoundWords: string[];
  points: number;
  hasPlayed: boolean;
  playCount: number;
  lastPlayedDate: number;
  weeklyScores: (number | null)[];
  weeklyPoints: (number | null)[];
  gameId: number;
}

const Main = () => {
  //google analytics

  const { theme } = useTheme();
  const isDark = theme === "dark";

  //show menu or game modes in game container
  const [menuActive, setMenuActive] = useState(true);
  const [blitzActive, setBlitzActive] = useState(false);
  const [marathonActive, setMarathonActive] = useState(false);
  useEffect(() => {
    if (blitzActive || marathonActive) {
      setMenuActive(false);
    }
  }, [blitzActive, marathonActive]);

  //game user state - local storage
  const [username, setUsername] = useState<string>(() => {
    const storedState = localStorage.getItem("username");
    return storedState ? JSON.parse(storedState) : "User";
  });
  const [blitzState, setBlitzState] = useState<GameState>(() => {
    const storedState = localStorage.getItem("blitzData");
    return storedState
      ? JSON.parse(storedState)
      : {
          board: fillEmptyBoard(),
          nextLetters: fillNewNextLetters(),
          swapCount: SWAPCOUNT,
          foundWords: [],
          recentFoundWords: [],
          points: 0,
          hasPlayed: false,
          playCount: 0,
          lastPlayedDate: DAY,
          weeklyScores: Array.from({ length: 7 }, () => null),
          weeklyPoints: Array.from({ length: 7 }, () => null),
          gameId: generateGameId(),
        };
  });
  const [marathonState, setMarathonState] = useState<GameState>(() => {
    const storedState = localStorage.getItem("marathonData");
    return storedState
      ? JSON.parse(storedState)
      : {
          board: fillEmptyBoard(),
          nextLetters: fillNewNextLetters(),
          swapCount: SWAPCOUNT,
          foundWords: [],
          recentFoundWords: [],
          points: 0,
          hasPlayed: false,
          playCount: 0,
          lastPlayedDate: DAY,
          weeklyScores: Array.from({ length: 7 }, () => null),
          weeklyPoints: Array.from({ length: 7 }, () => null),
          gameId: generateGameId(),
        };
  });

  return (
    <div className="main-container">
      <div className="app-container">
        <Appbar />
        {menuActive && (
          <Menu
            setBlitzActive={setBlitzActive}
            setMarathonActive={setMarathonActive}
          />
        )}
        {blitzActive && <Blitz blitzState={blitzState} />}
        {marathonActive && <Marathon marathonState={marathonState} />}
      </div>
    </div>
  );
};

export default Main;
