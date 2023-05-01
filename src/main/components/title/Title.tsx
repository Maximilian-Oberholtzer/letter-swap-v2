import React, { useEffect } from "react";
import "./title.css";

const Title = () => {
  //animate title tiles when menu component is displayed
  useEffect(() => {
    const titleTile1 = document.querySelector(".title-tile-l");
    const titleTile2 = document.querySelector(".title-tile-s");
    setTimeout(() => {
      titleTile1?.classList.add("animate");
    }, 500);
    setTimeout(() => {
      titleTile2?.classList.add("animate");
    }, 800);
    setTimeout(() => {
      titleTile1?.classList.remove("animate");
      titleTile2?.classList.remove("animate");
    }, 1200);
  }, []);

  return (
    <div className="title-container">
      <div className="title-left-container">
        <span className="title-tile-l">L</span>etter
      </div>
      <div className="title-right-container">
        <span className="title-tile-s">S</span>wap
      </div>
    </div>
  );
};

export default Title;
