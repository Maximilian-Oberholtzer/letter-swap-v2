import React, { useEffect } from "react";
import "./title.css";
import { useTheme } from "../../../theme/Theme";

const Title = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  //animate title tiles when menu component is displayed
  useEffect(() => {
    const titleTile1 = document.querySelector(".title-tile-l");
    const titleTile2 = document.querySelector(".title-tile-s");
    setTimeout(() => {
      titleTile1?.classList.add("flip");
    }, 500);
    setTimeout(() => {
      titleTile2?.classList.add("flip");
    }, 800);
    setTimeout(() => {
      titleTile1?.classList.remove("flip");
      titleTile2?.classList.remove("flip");
    }, 1200);
  }, []);

  return (
    <div className="title-container">
      <div className="title-left-container">
        <span
          className="title-tile-l"
          style={{
            border: isDark
              ? "0.2rem solid var(--dark-border-color)"
              : "0.2rem solid var(--light-border-color)",
          }}
        >
          L
        </span>
        etter
      </div>
      <div className="title-right-container">
        <span
          className="title-tile-s"
          style={{
            border: isDark
              ? "0.2rem solid var(--dark-border-color)"
              : "0.2rem solid var(--light-border-color)",
          }}
        >
          S
        </span>
        wap
      </div>
    </div>
  );
};

export default Title;
