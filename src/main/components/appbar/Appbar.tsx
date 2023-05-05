import React, { Dispatch, SetStateAction, useState } from "react";
import "./appbar.css";
import Title from "../title/Title";
import { useTheme } from "../../../theme/Theme";

interface AppbarProps {
  setMenuActive: Dispatch<SetStateAction<boolean>>;
  setBlitzActive: Dispatch<SetStateAction<boolean>>;
  setMarathonActive: Dispatch<SetStateAction<boolean>>;
  setCanTransition: Dispatch<SetStateAction<boolean>>;
}

const Appbar = (props: AppbarProps) => {
  const { setMenuActive, setBlitzActive, setMarathonActive, setCanTransition } =
    props;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  const handleDrawerClose = () => {
    const drawerElement = document.querySelector(".drawer-content");
    drawerElement?.classList.add("drawer-out");
    setTimeout(() => {
      drawerElement?.classList.add("display-none");
      setShowDrawer(false);
    }, 280);
  };

  const drawer = (
    <div className="drawer" onClick={handleDrawerClose}>
      <div
        className="drawer-content"
        style={{
          backgroundColor: isDark
            ? "var(--dark-drawer-background)"
            : "var(--light-drawer-background)",
          color: isDark ? "var(--dark-text)" : "var(--light-text)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-title-container">
          <div className="drawer-title">Menu</div>
          <button
            className="modal-close-button margin-unset"
            onClick={handleDrawerClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const boardFadeOut = () => {
    const GameContainerElement = document.querySelector(".game-container");
    GameContainerElement?.classList.remove("fade-in-right");
    GameContainerElement?.classList.add("fade-out-right");
    setTimeout(() => {
      setCanTransition(true);
      setBlitzActive(false);
      setMarathonActive(false);
    }, 270);
    setTimeout(() => {
      setMenuActive(true);
      GameContainerElement?.classList.remove("fade-out-right");
    }, 320);
  };

  return (
    <div
      className="appbar-container"
      style={{
        backgroundColor: isDark
          ? "var(--dark-background)"
          : "var(--light-background)",
        color: isDark ? "var(--dark-text)" : "var(--light-text)",
      }}
    >
      {/* Drawer */}
      {showDrawer && drawer}
      {/* Modals */}
      <div className="appbar-left-container">
        <button
          className="appbar-svg-button"
          onClick={() => {
            boardFadeOut();
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
        <button
          className="appbar-svg-button"
          onClick={() => {
            setShowDrawer(true);
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
