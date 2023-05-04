import React, { ReactNode, useState } from "react";
import Modal from "./Modal";

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

  const [tutorialTile1, setTutorialTile1] = useState<string>("");
  const tutorialWord = ["H", "O", "R", "S", "E"];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const handleTutorialTileClick1 = () => {
    if (tutorialTile1 === "") {
      const tile = document.getElementById("tutorial-tile-1");
      tile?.classList.add("flip");
      tile?.classList.add("background-fill");
      tile?.classList.add("cursor-unset");
      setTutorialTile1(alphabet[Math.floor(Math.random() * 26)]);
    }
  };

  const instructionsNode: ReactNode = (
    <div className="modal-content-container">
      <p className="modal-text">
        Tap on a tile to replace it with the <b>NEXT</b> letter.
      </p>
      <div className="instructions-tutorial-container">
        <div className="modal-text margin-unset">
          <b>Tap Here:</b>
        </div>
        <div
          id="tutorial-tile-1"
          className="tile-tutorial"
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
        <b>ANY DIRECTION</b>. Words must span the <b>ENTIRE</b> row. Duplicated
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
      {pointArr.map((arr, index) => (
        <div key={arr[index]}>
          <div className="modal-text text-align-center">
            <b>
              {index + 1} {`${index === 0 ? "point" : "points"}`}
            </b>
          </div>
          <div key={index} className="modal-point-description-container">
            {arr.map((letter, index) => (
              <div key={index} className="tile tile-small">
                {" "}
                {letter}{" "}
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="modal-text">
        3 <b>BONUS</b> points for finding a word in a diagonal direction.
      </p>
      <p className="modal-text">
        5 <b>BONUS</b> points for each additional word found in one turn.
      </p>
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
