import React, { Dispatch, SetStateAction } from "react";
import "./menu.css";

interface MenuProps {
  setBlitzActive: Dispatch<SetStateAction<boolean>>;
  setMarathonActive: Dispatch<SetStateAction<boolean>>;
}

const Menu = (props: MenuProps) => {
  const { setBlitzActive, setMarathonActive } = props;
  return (
    <div className="menu-container">
      <button
        className="menu-button"
        onClick={() => {
          setBlitzActive(true);
        }}
      >
        Daily Blitz
      </button>
      <button
        className="menu-button"
        onClick={() => {
          setMarathonActive(true);
        }}
      >
        Marathon
      </button>
    </div>
  );
};

export default Menu;
