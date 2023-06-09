import React, { ReactNode, useState } from "react";
import Modal from "./Modal";
import { useTheme } from "../../../theme/Theme";

//point values
const onePoint = ["A", "D", "E", "H", "I", "L", "N", "O", "R", "S", "T"];
const twoPoints = ["B", "C", "F", "G", "M", "P", "U", "W", "Y"];
const threePoints = ["J", "K", "Q", "V", "X", "Z"];
const pointArr = [onePoint, twoPoints, threePoints];

interface instructionsModalProps {
  closeModal: () => void;
}

const InstructionsModal = (props: instructionsModalProps) => {
  const { closeModal } = props;

  const ranks = [
    {
      title: [
        "1 Star",
        "2 Stars",
        "3 Stars",
        "4 Stars",
        "5 Stars",
        "Master",
        "Grandmaster",
      ],
      blitz4x4Points: [0, 20, 40, 75, 100, 140, 180],
      blitz5x5Points: [0, 20, 40, 75, 100, 120, 150],
      marathonPoints: [0, 50, 100, 200, 300, 400, 500],
    },
  ];

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tutorialTile1, setTutorialTile1] = useState<string>("");
  const tutorialWord = ["H", "O", "R", "S", "E"];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const handleTutorialTileClick1 = () => {
    if (tutorialTile1 === "") {
      const tile = document.getElementById("tutorial-tile-1");
      tile?.classList.add("flip");
      tile?.classList.add(
        isDark ? "background-fill-dark" : "background-fill-light"
      );
      tile?.classList.add("cursor-unset");
      setTutorialTile1(alphabet[Math.floor(Math.random() * 26)]);
    }
  };

  const instructionsNode: ReactNode = (
    <div className="modal-content-container">
      <p className="modal-text">
        Tap on any tile to place the <b>NEXT</b> letter.
      </p>
      <div className="instructions-tutorial-container">
        <div className="modal-text margin-unset">
          <b>Tap Here:</b>
        </div>
        <div
          id="tutorial-tile-1"
          className={`tile-tutorial ${
            isDark ? "tile-border-dark" : "tile-border-light"
          }`}
          onClick={() => {
            handleTutorialTileClick1();
          }}
        >
          {tutorialTile1}
        </div>
      </div>

      <p className="modal-text">
        A <b>SWAP</b> is used if a tile with a letter on it is replaced,{" "}
        <b>UNLESS</b> a word was found in the process.
      </p>
      <div className="instructions-tutorial-container"></div>
      <p className="modal-text">
        Creating a word <b>CLEARS</b> the row. Words can be created in{" "}
        <b>ANY DIRECTION</b>. Words must span the <b>ENTIRE</b> row. Duplicate
        words are <b>NOT</b> counted.
      </p>
      <div className="instructions-tutorial-container small-gap">
        {tutorialWord.map((letter, index) => (
          <div key={index} className="tile-tutorial-filled">
            {letter}
          </div>
        ))}
      </div>
      <div className="instructions-tutorial-container"></div>
      <p className="modal-text">
        Tap on the <b>BOTTOM BOX</b> to view your previous found words.
      </p>
      <p className="modal-text">
        Running out of swaps <b>ENDS</b> the game.
      </p>
      <hr className="modal-line" />
      <p className="modal-subtitle text-align-center">
        <b>Point System</b>
      </p>
      <p className="modal-text">
        When a word is created, you will be awarded <b>POINTS</b> for each
        letter used.
      </p>
      <p className="modal-text">
        The <b>BONUS</b> letter is worth 2x points.
      </p>
      <p className="modal-text">
        3 <b>BONUS</b> points for finding a word in a diagonal direction.
      </p>
      <p className="modal-text">
        5 <b>BONUS</b> points for each additional word found in one turn.
      </p>
      {pointArr.map((arr, index) => (
        <div key={arr[index]}>
          <div className="modal-text text-align-center">
            <b>
              {index + 1} {`${index === 0 ? "point" : "points"}`}
            </b>
          </div>
          <div key={index} className="modal-point-description-container">
            {arr.map((letter, index) => (
              <div
                key={index}
                className={`tile-tutorial-filled ${
                  isDark
                    ? "background-fill-dark color-dark"
                    : "background-fill-light color-light"
                }`}
              >
                {" "}
                {letter}{" "}
              </div>
            ))}
          </div>
        </div>
      ))}
      <hr className="modal-line" />
      <p className="modal-subtitle text-align-center">
        <b>Rank System</b>
      </p>
      <p className="modal-text">
        Upon completion of a game, you will be assigned a <b>RANK</b> ⭐ based
        on your performance. Below are the required amount of points needed to
        achieve a rank.
      </p>
      <div className="instructions-table-container">
        <table className="instructions-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>4x4 Blitz</th>
              <th>5x5 Blitz</th>
              <th>Marathon</th>
            </tr>
          </thead>
          <tbody>
            {ranks[0].title.map((title, index) => (
              <tr key={index}>
                <td>{title}</td>
                <td>{ranks[0].blitz4x4Points[index]}</td>
                <td>{ranks[0].blitz5x5Points[index]}</td>
                <td>{ranks[0].marathonPoints[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Modal
      closeModal={closeModal}
      modalContent={instructionsNode}
      modalTitle="How To Play"
    />
  );
};

export default InstructionsModal;
