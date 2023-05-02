import React, { Dispatch, SetStateAction, useState } from "react";
import Title from "../title/Title";
import "./menu.css";
import InstructionsModal from "../modal/InstructionsModal";
import StatisticsModal from "../modal/StatisticsModal";
import LeaderboardModal from "../modal/LeaderboardModal";
import SettingsModal from "../modal/SettingsModal";
import SupportModal from "../modal/SupportModal";

interface MenuProps {
  setMenuActive: Dispatch<SetStateAction<boolean>>;
  setBlitzActive: Dispatch<SetStateAction<boolean>>;
  setMarathonActive: Dispatch<SetStateAction<boolean>>;
  setCanTransition: Dispatch<SetStateAction<boolean>>;
}

const Menu = (props: MenuProps) => {
  const { setBlitzActive, setMarathonActive, setMenuActive, setCanTransition } =
    props;

  //handle modals
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
        <StatisticsModal closeModal={() => setStatisticsModal(false)} />
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
      component: <SettingsModal closeModal={() => setSettingsModal(false)} />,
    },
    {
      isOpen: supportModal,
      component: <SupportModal closeModal={() => setSupportModal(false)} />,
    },
  ];

  //Svg icon buttons
  const buttons = [
    {
      name: "Instructions",
      openModal: () => {
        setInstructionsModal(true);
      },
      svgContent: (
        <>
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </>
      ),
    },
    {
      name: "Statistics",
      openModal: () => {
        setStatisticsModal(true);
      },
      svgContent: (
        <>
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </>
      ),
    },
    {
      name: "Leaderboard",
      openModal: () => {
        setLeaderboardModal(true);
      },
      svgContent: (
        <>
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </>
      ),
    },
    {
      name: "Settings",
      openModal: () => {
        setSettingsModal(true);
      },
      svgContent: (
        <>
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </>
      ),
    },
    {
      name: "Support",
      openModal: () => {
        setSupportModal(true);
      },
      svgContent: (
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      ),
    },
  ];

  const menuFadeOut = (setGameActive: Dispatch<SetStateAction<boolean>>) => {
    const MenuContainerElement = document.querySelector(".menu-container");
    MenuContainerElement?.classList.remove("fade-in-left");
    MenuContainerElement?.classList.add("fade-out-left");
    setTimeout(() => {
      setCanTransition(true);
      setMenuActive(false);
    }, 250);
    setTimeout(() => {
      setGameActive(true);
      const GameContainerElement = document.querySelector(".game-container");
      GameContainerElement?.classList.add("fade-in-right");
      MenuContainerElement?.classList.remove("fade-out-left");
    }, 400);
  };

  return (
    <>
      {/* Modals */}
      {modals.map(({ isOpen, component }) => isOpen && component)}
      <Title />
      <div className="title-subtext">
        Create as many 5-letter words as possible.
      </div>
      <button
        className="menu-button"
        onClick={() => {
          menuFadeOut(setBlitzActive);
        }}
      >
        Daily Blitz ⚡
      </button>
      <button
        className="menu-button"
        onClick={() => {
          menuFadeOut(setMarathonActive);
        }}
      >
        Marathon 🏃
      </button>
      <div className="menu-bottom-container">
        {buttons.map(({ name, openModal, svgContent }) => (
          <button className="menu-svg-button" key={name} onClick={openModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {svgContent}
            </svg>
          </button>
        ))}
      </div>
    </>
  );
};

export default Menu;
