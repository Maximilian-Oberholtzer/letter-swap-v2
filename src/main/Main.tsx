import React, { useState, useEffect, useLayoutEffect } from "react";
import { useTheme } from "../theme/Theme";
import "./main.css";
import Menu from "./components/menu/Menu";
import {
  fillEmptyBoard,
  // fillNewNextLetters,
  generateFixedNextLetters,
  generateGameId,
} from "./components/board/BoardFunctions";
import Board from "./components/board/Board";
import Appbar from "./components/appbar/Appbar";
import StatisticsModal from "./components/modal/StatisticsModal";
import InstructionsModal from "./components/modal/InstructionsModal";
import LeaderboardModal from "./components/modal/LeaderboardModal";
import SettingsModal from "./components/modal/SettingsModal";
import SupportModal from "./components/modal/SupportModal";

const DAY = new Date().getDay();

export type GameMode = "blitz" | "marathon";

export interface GameState {
  board: string[][];
  moveCount: number;
  swapCount: number;
  foundWords: string[];
  recentFoundWords: string[];
  points: number;
  hasPlayed: boolean;
  hasPlayedToday: boolean;
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
        board: gameMode === "blitz" ? fillEmptyBoard(4) : fillEmptyBoard(5),
        moveCount: 0,
        swapCount: gameMode === "blitz" ? 5 : 15,
        foundWords: [],
        recentFoundWords: [],
        points: 0,
        hasPlayed: false,
        hasPlayedToday: false,
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

  //sound controller
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const soundEnabled = localStorage.getItem("soundEnabled");
    return soundEnabled ? JSON.parse(soundEnabled) : false;
  });

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
  //Don't transition if user loads into page
  const [canTransition, setCanTransition] = useState<boolean>(false);
  useLayoutEffect(() => {
    if (canTransition) {
      if (!menuActive && (blitzActive || marathonActive)) {
        const GameContainerElement = document.querySelector(".game-container");
        GameContainerElement?.classList.add("fade-in-right");
      }
      if (menuActive && !blitzActive && !marathonActive) {
        const MenuContainerElement = document.querySelector(".menu-container");
        MenuContainerElement?.classList.add("fade-in-left");
      }
    }
  }, [menuActive, blitzActive, marathonActive, canTransition]);
  useEffect(() => {
    localStorage.setItem("menuActive", JSON.stringify(menuActive));
    localStorage.setItem("blitzActive", JSON.stringify(blitzActive));
    localStorage.setItem("marathonActive", JSON.stringify(marathonActive));
  }, [menuActive, blitzActive, marathonActive]);

  //MODAL handling
  const [instructionsModal, setInstructionsModal] = useState<boolean>(false);
  const [statisticsModal, setStatisticsModal] = useState<boolean>(false);
  const [leaderboardModal, setLeaderboardModal] = useState<boolean>(false);
  const [settingsModal, setSettingsModal] = useState<boolean>(false);
  const [supportModal, setSupportModal] = useState<boolean>(false);
  const modals = [
    {
      isOpen: instructionsModal,
      component: (
        <InstructionsModal closeModal={() => setInstructionsModal(false)} />
      ),
    },
    {
      isOpen: statisticsModal,
      component: (
        <StatisticsModal
          closeModal={() => setStatisticsModal(false)}
          blitzState={blitzState}
          marathonState={marathonState}
        />
      ),
    },
    {
      isOpen: leaderboardModal,
      component: (
        <LeaderboardModal closeModal={() => setLeaderboardModal(false)} />
      ),
    },
    {
      isOpen: settingsModal,
      component: (
        <SettingsModal
          closeModal={() => setSettingsModal(false)}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />
      ),
    },
    {
      isOpen: supportModal,
      component: <SupportModal closeModal={() => setSupportModal(false)} />,
    },
  ];

  return (
    <div
      className="main-container"
      style={{
        backgroundColor: isDark
          ? "var(--dark-backdrop)"
          : "var(--light-backdrop)",
      }}
    >
      <div
        className="app-container"
        style={{
          backgroundColor: isDark
            ? "var(--dark-background)"
            : "var(--light-background)",
        }}
      >
        {/* CONDITIONAL MODALS */}
        {modals.map(
          ({ isOpen, component }, index) =>
            isOpen && (
              <div style={{ position: "absolute" }} key={index}>
                {component}
              </div>
            )
        )}
        {/* MENU */}
        {menuActive && (
          <div
            className="menu-container"
            style={{
              color: isDark ? "var(--dark-text)" : "var(--light-text)",
            }}
          >
            <Menu
              menuType="main"
              setInstructionsModal={setInstructionsModal}
              setStatisticsModal={setStatisticsModal}
              setLeaderboardModal={setLeaderboardModal}
              setSettingsModal={setSettingsModal}
              setSupportModal={setSupportModal}
              setMenuActive={setMenuActive}
              setBlitzActive={setBlitzActive}
              setMarathonActive={setMarathonActive}
              setCanTransition={setCanTransition}
            />
          </div>
        )}
        {/* GAME */}
        {!menuActive && (blitzActive || marathonActive) && (
          <div
            className="game-container"
            style={{
              color: isDark ? "var(--dark-text)" : "var(--light-text)",
            }}
          >
            <Appbar
              setMenuActive={setMenuActive}
              setBlitzActive={setBlitzActive}
              setMarathonActive={setMarathonActive}
              setInstructionsModal={setInstructionsModal}
              setStatisticsModal={setStatisticsModal}
              setLeaderboardModal={setLeaderboardModal}
              setSettingsModal={setSettingsModal}
              setSupportModal={setSupportModal}
              setCanTransition={setCanTransition}
            />
            {blitzActive && (
              <Board
                gameMode={"blitz"}
                gameState={blitzState}
                setGameState={setBlitzState}
                setStatisticsModal={setStatisticsModal}
                soundEnabled={soundEnabled}
              />
            )}
            {marathonActive && (
              <Board
                gameMode={"marathon"}
                gameState={marathonState}
                setGameState={setMarathonState}
                setStatisticsModal={setStatisticsModal}
                soundEnabled={soundEnabled}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
