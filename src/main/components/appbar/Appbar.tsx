import React, { Dispatch, SetStateAction } from "react";
import "./appbar.css";
import Title from "../title/Title";

interface AppbarProps {
  setBlitzActive: Dispatch<SetStateAction<boolean>>;
  setMarathonActive: Dispatch<SetStateAction<boolean>>;
}

const Appbar = (props: AppbarProps) => {
  const { setBlitzActive, setMarathonActive } = props;
  return (
    <div className="appbar-container">
      <div className="appbar-left-container">
        <button
          className="menu-svg-button"
          onClick={() => {
            setBlitzActive(false);
            setMarathonActive(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
