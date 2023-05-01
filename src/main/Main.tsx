import React, { useState, useEffect } from "react";
import { useTheme } from "../theme/Theme";
import "./main.css";
import Menu from "./components/menu/Menu";
import {
  fillEmptyBoard,
  fillNewNextLetters,
  generateGameId,
} from "./components/board/BoardFunctions";
import Board from "./components/board/Board";
import Appbar from "./components/appbar/Appbar";

const SWAPCOUNT = 15;
const DAY = new Date().getDay();

export type GameMode = "blitz" | "marathon";

export interface GameState {
  board: string[][];
  nextLetters: string[];
  swapCount: number;
  foundWords: string[];
  recentFoundWords: string[];
  timeRemaining: number;
  points: number;
  hasPlayed: boolean;
  playCount: number;
  lastPlayedDate: number;
  weeklyScores: (number | null)[];
  weeklyPoints: (number | null)[];
  gameId: number;
}

function getDefaultGameState(gameMode: string): GameState {
  const storedState = localStorage.getItem(`${gameMode}Data`);
  return storedState
    ? JSON.parse(storedState)
    : {
        board: fillEmptyBoard(),
        nextLetters: fillNewNextLetters(),
        swapCount: SWAPCOUNT,
        foundWords: [],
        recentFoundWords: [],
        timeRemaining: gameMode === "blitz" ? 300 : undefined,
        points: 0,
        hasPlayed: false,
        playCount: 0,
        lastPlayedDate: DAY,
        weeklyScores: Array.from({ length: 7 }, () => null),
        weeklyPoints: Array.from({ length: 7 }, () => null),
        gameId: generateGameId(),
      };
}

const Main = () => {
  //google analytics

  const { theme } = useTheme();
  const isDark = theme === "dark";

  //handle animation transitions between menu and board
  const [menuActive, setMenuActive] = useState(() => {
    const menuActive = localStorage.getItem("menuActive");
    return menuActive ? JSON.parse(menuActive) : true;
  });
  const [blitzActive, setBlitzActive] = useState(() => {
    const blitzActive = localStorage.getItem("blitzActive");
    return blitzActive ? JSON.parse(blitzActive) : false;
  });
  const [marathonActive, setMarathonActive] = useState(() => {
    const marathonActive = localStorage.getItem("marathonActive");
    return marathonActive ? JSON.parse(marathonActive) : false;
  });
  const [canTransition, setCanTransition] = useState(false);
  useEffect(() => {
    localStorage.setItem("menuActive", JSON.stringify(menuActive));
    localStorage.setItem("blitzActive", JSON.stringify(blitzActive));
    localStorage.setItem("marathonActive", JSON.stringify(marathonActive));
    const MenuContainerElement = document.querySelector(".menu-container");
    const GameContainerElement = document.querySelector(".game-container");
    if (blitzActive || marathonActive) {
      if (canTransition) {
        MenuContainerElement?.classList.add("fade-out-left");
        GameContainerElement?.classList.add("fade-in-right");
        setTimeout(() => {
          setMenuActive(false);
        }, 220);
        setTimeout(() => {
          MenuContainerElement?.classList.remove("fade-out-left");
          GameContainerElement?.classList.remove("fade-in-right");
        }, 250);
      }
    } else {
      if (canTransition) {
        MenuContainerElement?.classList.add("fade-in-left");
        GameContainerElement?.classList.add("fade-out-right");
        setTimeout(() => {
          setMenuActive(true);
        }, 220);
        setTimeout(() => {
          MenuContainerElement?.classList.remove("fade-in-left");
          GameContainerElement?.classList.remove("fade-out-right");
        }, 250);
      }
    }
    setTimeout(() => {
      setCanTransition(true);
    }, 100);
  }, [menuActive, blitzActive, marathonActive]);

  //game user state - local storage
  const [blitzState, setBlitzState] = useState<GameState>(() =>
    getDefaultGameState("blitz")
  );
  const [marathonState, setMarathonState] = useState<GameState>(() =>
    getDefaultGameState("marathon")
  );

  //save user's game
  useEffect(() => {
    localStorage.setItem("blitzData", JSON.stringify(blitzState));
    localStorage.setItem("marathonData", JSON.stringify(marathonState));
  }, [blitzState, marathonState]);

  return (
    <div className="main-container">
      <div className="app-container">
        {menuActive && (
          <Menu
            setBlitzActive={setBlitzActive}
            setMarathonActive={setMarathonActive}
          />
        )}
        {!menuActive && (
          <div className="game-container">
            <Appbar
              setBlitzActive={setBlitzActive}
              setMarathonActive={setMarathonActive}
            />
            {blitzActive && <Board gameMode={"blitz"} gameState={blitzState} />}
            {marathonActive && (
              <Board gameMode={"marathon"} gameState={marathonState} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
