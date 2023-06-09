import React, { useState, useEffect, useLayoutEffect } from "react";
import { useTheme } from "../theme/Theme";
import "./main.css";
import Menu from "./components/menu/Menu";
import {
  fillEmptyBoard,
  generateGameId,
} from "./components/board/BoardFunctions";
import Board from "./components/board/Board";
import Appbar from "./components/appbar/Appbar";
import StatisticsModal from "./components/modal/StatisticsModal";
import InstructionsModal from "./components/modal/InstructionsModal";
import LeaderboardModal from "./components/modal/LeaderboardModal";
import SettingsModal from "./components/modal/SettingsModal";
import SupportModal from "./components/modal/SupportModal";
import { trackPageView } from "../analytics";
import { useLocation } from "react-router-dom";
import { getDaysElapsedSince } from "../DayCounter";
import { readAllLeaderboards } from "./components/leaderboard/leaderboardFunctions";

export type GameMode = "blitz4x4" | "blitz5x5" | "marathon";

export interface GameState {
  board: string[][];
  moveCount: number;
  swapCount: number;
  timerTimeLeft: number;
  timerProgress: number;
  timerStarted: boolean;
  timerStartTime: string;
  timerTimeAdjustment: number;
  foundWords: string[];
  recentFoundWords: string[];
  points: number;
  gameStarted: boolean;
  hasPlayedToday: boolean;
  lastPlayedPuzzle: number;
  weeklyScores: (number | null)[];
  weeklyPoints: (number | null)[];
  gameId: number;
  submittedScore: boolean;
}

function getDefaultGameState(gameMode: string): GameState {
  const storedState = localStorage.getItem(`${gameMode}Data`);
  return storedState
    ? JSON.parse(storedState)
    : {
        board: gameMode === "blitz4x4" ? fillEmptyBoard(4) : fillEmptyBoard(5),
        moveCount: 0,
        swapCount:
          gameMode === "blitz4x4" ? 5 : gameMode === "blitz5x5" ? 10 : 15,
        timerTimeLeft: gameMode === "blitz4x4" ? 3 * 60 * 1001 : 5 * 60 * 1001,
        timerProgress: 100,
        timerStarted: false,
        timerStartTime: new Date().getTime(),
        timerTimeAdjustment: 0,
        foundWords: [],
        recentFoundWords: [],
        points: 0,
        gameStarted: false,
        hasPlayedToday: false,
        playCount: 0,
        lastPlayedPuzzle: getDaysElapsedSince(),
        weeklyScores: Array.from({ length: 7 }, () => null),
        weeklyPoints: Array.from({ length: 7 }, () => null),
        gameId: generateGameId(),
        submittedScore: false,
      };
}

const Main = () => {
  //google analytics
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  //username controller
  const [username, setUsername] = useState<string>(() => {
    const username = localStorage.getItem("username");
    return username ? JSON.parse(username) : "";
  });
  //sound controller
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const soundEnabled = localStorage.getItem("soundEnabled");
    return soundEnabled ? JSON.parse(soundEnabled) : false;
  });

  useEffect(() => {
    localStorage.setItem("username", JSON.stringify(username));
    localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
  }, [username, soundEnabled]);

  //game user state - local storage
  const [blitz4x4State, setBlitz4x4State] = useState<GameState>(() =>
    getDefaultGameState("blitz4x4")
  );
  const [blitz5x5State, setBlitz5x5State] = useState<GameState>(() =>
    getDefaultGameState("blitz5x5")
  );
  const [marathonState, setMarathonState] = useState<GameState>(() =>
    getDefaultGameState("marathon")
  );

  //save user's game
  useEffect(() => {
    localStorage.setItem("blitz4x4Data", JSON.stringify(blitz4x4State));
    localStorage.setItem("blitz5x5Data", JSON.stringify(blitz5x5State));
    localStorage.setItem("marathonData", JSON.stringify(marathonState));
  }, [blitz4x4State, blitz5x5State, marathonState]);

  //handle animation transitions between menu and board
  const [menuActive, setMenuActive] = useState(() => {
    const menuActive = localStorage.getItem("menuActive");
    return menuActive ? JSON.parse(menuActive) : true;
  });
  const [blitz4x4Active, setBlitz4x4Active] = useState(() => {
    const blitz4x4Active = localStorage.getItem("blitz4x4Active");
    return blitz4x4Active ? JSON.parse(blitz4x4Active) : false;
  });
  const [blitz5x5Active, setBlitz5x5Active] = useState(() => {
    const blitz5x5Active = localStorage.getItem("blitz5x5Active");
    return blitz5x5Active ? JSON.parse(blitz5x5Active) : false;
  });
  const [marathonActive, setMarathonActive] = useState(() => {
    const marathonActive = localStorage.getItem("marathonActive");
    return marathonActive ? JSON.parse(marathonActive) : false;
  });
  //Don't transition if user loads into page
  const [canTransition, setCanTransition] = useState<boolean>(false);
  useLayoutEffect(() => {
    if (canTransition) {
      if (!menuActive && (blitz4x4Active || blitz5x5Active || marathonActive)) {
        const GameContainerElement = document.querySelector(".game-container");
        GameContainerElement?.classList.add("fade-in-right");
      }
      if (
        (menuActive && !blitz4x4Active) ||
        (blitz5x5Active && !marathonActive)
      ) {
        const MenuContainerElement = document.querySelector(".menu-container");
        MenuContainerElement?.classList.add("fade-in-left");
      }
    }
  }, [
    menuActive,
    blitz4x4Active,
    blitz5x5Active,
    marathonActive,
    canTransition,
  ]);
  useEffect(() => {
    localStorage.setItem("menuActive", JSON.stringify(menuActive));
    localStorage.setItem("blitz4x4Active", JSON.stringify(blitz4x4Active));
    localStorage.setItem("blitz5x5Active", JSON.stringify(blitz5x5Active));
    localStorage.setItem("marathonActive", JSON.stringify(marathonActive));
  }, [menuActive, blitz4x4Active, blitz5x5Active, marathonActive]);

  // LEADERBOARD LOAD DATA
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  useEffect(() => {
    const fetchLeaderboards = async () => {
      const gameModes = ["blitz4x4", "blitz5x5", "marathon"];
      const leaderboardData = await Promise.all(
        gameModes.map(async (gameMode) => {
          const data = await readAllLeaderboards(gameMode);
          if (data) {
            return {
              gameMode,
              data,
            };
          } else {
            console.error(`Error fetching ${gameMode} leaderboard`);
            return null;
          }
        })
      );

      // Filter out any failed fetches
      const validLeaderboards = leaderboardData.filter(Boolean);
      setLeaderboardData(validLeaderboards);
    };

    fetchLeaderboards();
  }, [
    blitz4x4State.submittedScore,
    blitz5x5State.submittedScore,
    marathonState.submittedScore,
  ]);

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
          blitz4x4State={blitz4x4State}
          blitz5x5State={blitz5x5State}
          marathonState={marathonState}
        />
      ),
    },
    {
      isOpen: leaderboardModal,
      component: (
        <LeaderboardModal
          closeModal={() => setLeaderboardModal(false)}
          leaderboardData={leaderboardData}
        />
      ),
    },
    {
      isOpen: settingsModal,
      component: (
        <SettingsModal
          closeModal={() => setSettingsModal(false)}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          username={username}
          setUsername={setUsername}
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
              setBlitz4x4Active={setBlitz4x4Active}
              setBlitz5x5Active={setBlitz5x5Active}
              setMarathonActive={setMarathonActive}
              setCanTransition={setCanTransition}
            />
          </div>
        )}
        {/* GAME */}
        {!menuActive &&
          (blitz4x4Active || blitz5x5Active || marathonActive) && (
            <div
              className="game-container"
              style={{
                color: isDark ? "var(--dark-text)" : "var(--light-text)",
              }}
            >
              <Appbar
                setMenuActive={setMenuActive}
                setBlitz4x4Active={setBlitz4x4Active}
                setBlitz5x5Active={setBlitz5x5Active}
                setMarathonActive={setMarathonActive}
                setInstructionsModal={setInstructionsModal}
                setStatisticsModal={setStatisticsModal}
                setLeaderboardModal={setLeaderboardModal}
                setSettingsModal={setSettingsModal}
                setSupportModal={setSupportModal}
                setCanTransition={setCanTransition}
              />
              {blitz4x4Active && (
                <Board
                  gameMode={"blitz4x4"}
                  gameState={blitz4x4State}
                  setGameState={setBlitz4x4State}
                  soundEnabled={soundEnabled}
                  username={username}
                />
              )}
              {blitz5x5Active && (
                <Board
                  gameMode={"blitz5x5"}
                  gameState={blitz5x5State}
                  setGameState={setBlitz5x5State}
                  soundEnabled={soundEnabled}
                  username={username}
                />
              )}
              {marathonActive && (
                <Board
                  gameMode={"marathon"}
                  gameState={marathonState}
                  setGameState={setMarathonState}
                  soundEnabled={soundEnabled}
                  username={username}
                />
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default Main;
