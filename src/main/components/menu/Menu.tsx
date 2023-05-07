import React, { Dispatch, SetStateAction } from "react";
import Title from "../title/Title";
import "./menu.css";
import { useTheme } from "../../../theme/Theme";

interface MenuProps {
  menuType: string;
  setInstructionsModal: Dispatch<SetStateAction<boolean>>;
  setStatisticsModal: Dispatch<SetStateAction<boolean>>;
  setLeaderboardModal: Dispatch<SetStateAction<boolean>>;
  setSettingsModal: Dispatch<SetStateAction<boolean>>;
  setSupportModal: Dispatch<SetStateAction<boolean>>;
  setMenuActive: Dispatch<SetStateAction<boolean>>;
  setBlitzActive: Dispatch<SetStateAction<boolean>>;
  setMarathonActive: Dispatch<SetStateAction<boolean>>;
  setCanTransition: Dispatch<SetStateAction<boolean>>;
  closeDrawer?: () => void;
}

const Menu = (props: MenuProps) => {
  const {
    menuType,
    setInstructionsModal,
    setStatisticsModal,
    setLeaderboardModal,
    setSettingsModal,
    setSupportModal,
    setBlitzActive,
    setMarathonActive,
    setMenuActive,
    setCanTransition,
    closeDrawer,
  } = props;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  //Svg icon buttons
  const buttons = [
    {
      name: "Help",
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

  const socialButtons = [
    {
      name: "Twitter",
      link: "https://twitter.com/letterswapgame",
      svgContent: (
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
      ),
    },
    {
      name: "Instagram",
      link: "https://www.instagram.com/letterswap.io/",
      svgContent: (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </>
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
    }, 270);
    setTimeout(() => {
      setGameActive(true);
      MenuContainerElement?.classList.remove("fade-out-left");
    }, 320);
  };

  //MAIN MENU
  const mainMenu = (
    <>
      <Title />
      <div className="title-subtext">Create as many words as possible.</div>
      <button
        className={`menu-button ${
          isDark ? "menu-button-dark" : "menu-button-light"
        }`}
        onClick={() => {
          menuFadeOut(setBlitzActive);
        }}
      >
        4x4 Blitz ⚡
      </button>
      <button
        className={`menu-button ${
          isDark ? "menu-button-dark" : "menu-button-light"
        }`}
        onClick={() => {
          menuFadeOut(setMarathonActive);
        }}
      >
        Marathon 🏃
      </button>
      <div className="menu-bottom-container">
        {buttons.map(({ name, openModal, svgContent }) => (
          <button
            className={`menu-svg-button ${
              isDark ? "menu-svg-button-dark" : "menu-svg-button-light"
            }`}
            key={name}
            onClick={openModal}
          >
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

  //GAME MENU CONTENT
  const gameMenu = (
    <>
      <div className="game-menu-container">
        {buttons.map(({ name, openModal, svgContent }) => (
          <div
            className={`game-menu-button-container ${
              isDark
                ? "game-menu-background-dark"
                : "game-menu-background-light"
            }`}
            onClick={() => {
              if (closeDrawer) {
                closeDrawer();
                openModal();
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {svgContent}
            </svg>

            <div className="game-menu-text">{name}</div>
          </div>
        ))}
      </div>
      <hr className="game-menu-line" />
      <div className="game-menu-socials-container">
        {socialButtons.map(({ name, link, svgContent }) => (
          <a
            className="game-menu-socials-link"
            href={link}
            target="_blank"
            rel="noreferrer"
            key={name}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {svgContent}
            </svg>
          </a>
        ))}
      </div>
    </>
  );

  return (
    <>
      {menuType === "main" && mainMenu}
      {menuType === "game" && gameMenu}
    </>
  );
};

export default Menu;
