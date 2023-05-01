import React, { Dispatch, SetStateAction } from "react";
import "./appbar.css";
import Title from "../title/Title";

interface AppbarProps {
  setMenuActive: Dispatch<SetStateAction<boolean>>;
  setBlitzActive: Dispatch<SetStateAction<boolean>>;
  setMarathonActive: Dispatch<SetStateAction<boolean>>;
}

const Appbar = (props: AppbarProps) => {
  const { setMenuActive, setBlitzActive, setMarathonActive } = props;

  //handle transition back to menu
  const transitionToMenu = () => {
    const GameContainerElement = document.querySelector(".game-container");
    GameContainerElement?.classList.add("fade-out-right");
    setTimeout(() => {
      setBlitzActive(false);
      setMarathonActive(false);
      setMenuActive(true);
      setTimeout(() => {
        const MenuContainerElement = document.querySelector(".menu-container");
        MenuContainerElement?.classList.add("fade-in-left");
        setTimeout(() => {
          MenuContainerElement?.classList.remove("fade-in-left");
        }, 300);
      }, 0);
    }, 230);

    setTimeout(() => {
      GameContainerElement?.classList.remove("fade-out-right");
    }, 280);
  };

  return (
    <div className="appbar-container">
      <div className="appbar-left-container">
        <button
          className="menu-svg-button"
          onClick={() => {
            transitionToMenu();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </div>
      <div className="appbar-center-container">
        <Title />
      </div>

      <div className="appbar-right-container">
        <button className="menu-svg-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Appbar;
