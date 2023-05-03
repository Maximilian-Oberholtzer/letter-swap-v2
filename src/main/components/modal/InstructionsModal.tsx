import React, { ReactNode } from "react";
import Modal from "./Modal";

//point values
const onePoint = ["A", "D", "E", "H", "I", "L", "N", "O", "R", "S", "T"];
const twoPoints = ["B", "C", "F", "G", "M", "P", "U", "W", "Y"];
const threePoints = ["J", "K", "Q", "V", "X", "Z"];
const pointArr = [onePoint, twoPoints, threePoints];

const instructionsNode: ReactNode = (
  <div className="modal-content-container">
    <p className="modal-text">
      Tap on a tile to replace it with the <b>NEXT</b> letter.
    </p>
    <p className="modal-text">
      A <b>SWAP</b> is used if a tile with a letter on it is replaced,{" "}
      <b>UNLESS</b> a word was found in the process.
    </p>
    <p className="modal-text">
      Words can be created in <b>ANY DIRECTION</b>. Duplicated words are{" "}
      <b>NOT</b> counted.
    </p>
    <p className="modal-text">
      Running out of swaps <b>ENDS</b> the game.
    </p>
    <hr className="modal-line" />
    {/* <p className="modal-subtitle">Points</p> */}
    {pointArr.map((arr, index) => (
      <>
        <div className="modal-point-description-text">
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
      </>
    ))}
  </div>
);

interface instructionsModalProps {
  closeModal: () => void;
}

const InstructionsModal = (props: instructionsModalProps) => {
  const { closeModal } = props;
  return (
    <Modal
      closeModal={closeModal}
      modalContent={instructionsNode}
      modalTitle="How To Play"
    />
  );
};

export default InstructionsModal;
