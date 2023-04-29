import React from "react";
import "./appbar.css";

const Appbar = () => {
  return (
    <div className="appbar-container">
      <div className="title-container">
        <div className="title-left-container">
          <span className="title-tile-l">L</span>etter
        </div>
        <div className="title-right-container">
          <span className="title-tile-s">S</span>wap
        </div>
      </div>
    </div>
  );
};

export default Appbar;
