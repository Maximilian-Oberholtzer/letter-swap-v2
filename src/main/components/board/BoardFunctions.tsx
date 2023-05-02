import { Dispatch, SetStateAction } from "react";
import { words } from "../../../words/words5letters";
import { Howl } from "howler";

const BOARDSIZE = 5;

const pointMap: { [key: string]: number } = {
  A: 1,
  B: 2,
  C: 2,
  D: 1,
  E: 1,
  F: 2,
  G: 2,
  H: 1,
  I: 1,
  J: 3,
  K: 3,
  L: 1,
  M: 2,
  N: 1,
  O: 1,
  P: 2,
  Q: 3,
  R: 1,
  S: 1,
  T: 1,
  U: 2,
  V: 3,
  W: 2,
  X: 3,
  Y: 2,
  Z: 3,
};

// const foundSound = new Howl({
//   src: ["/found.wav"],
// });

export const fillEmptyBoard = (): string[][] => {
  const newBoard = Array(BOARDSIZE)
    .fill(null)
    .map(() =>
      Array(BOARDSIZE)
        .fill(null)
        .map(() => " ")
    );
  return newBoard;
};

export const fillNewNextLetters = (): string[] => {
  let letters = [""];
  for (let i = 0; i < 3; i++) {
    let currentLetter = getRandomLetter();
    //no duplicates inside next letters boxes
    while (letters.includes(currentLetter)) {
      currentLetter = getRandomLetter();
    }
    letters[i] = currentLetter;
  }
  return letters;
};

//Board Checking and animation Handling
type Direction = "row" | "column" | "diagonalRight" | "diagonalLeft";

export const checkForWords = (
  board: string[][],
  setBoard: (newBoard: string[][]) => void,
  foundWords: string[],
  setFoundWords: (foundWords: string[]) => void,
  setRecentFoundWords: (recentFoundWords: string[]) => void,
  setIsFlippingFound: Dispatch<SetStateAction<boolean>>,
  points: number,
  setPoints: (points: number) => void,
  setAnimatedPoints: Dispatch<SetStateAction<number>>
): boolean => {
  let foundWord = false;
  let foundSequences = [];
  let currentPoints = 0;

  //check columns
  for (let i = 0; i < BOARDSIZE; i++) {
    let sequence = "";
    for (let j = 0; j < BOARDSIZE; j++) {
      sequence += board[i][j];
      if (j === BOARDSIZE - 1) {
        let reverseSequence = sequence.split("").reverse().join("");
        if (words.includes(sequence.toLowerCase())) {
          if (!foundWords.includes(sequence)) {
            foundWord = true;
            foundSequences.push(sequence);
            replaceRow(board, "column", i, setIsFlippingFound, setBoard);
          }
        } else if (words.includes(reverseSequence.toLowerCase())) {
          if (!foundWords.includes(reverseSequence)) {
            foundWord = true;
            foundSequences.push(reverseSequence);
            replaceRow(board, "column", i, setIsFlippingFound, setBoard);
          }
        }
      }
    }
  }

  //check rows
  for (let i = 0; i < BOARDSIZE; i++) {
    let sequence = "";
    for (let j = 0; j < BOARDSIZE; j++) {
      sequence += board[j][i];
      if (j === BOARDSIZE - 1) {
        let reverseSequence = sequence.split("").reverse().join("");
        if (words.includes(sequence.toLowerCase())) {
          if (!foundWords.includes(sequence)) {
            foundWord = true;
            foundSequences.push(sequence);
            replaceRow(board, "row", i, setIsFlippingFound, setBoard);
          }
        } else if (words.includes(reverseSequence.toLowerCase())) {
          if (!foundWords.includes(reverseSequence)) {
            foundWord = true;
            foundSequences.push(reverseSequence);
            replaceRow(board, "row", i, setIsFlippingFound, setBoard);
          }
        }
      }
    }
  }

  //check diagonal right (bottom left to top right)
  let i = 0;
  let j = BOARDSIZE - 1;
  let sequence = "";
  while (i < BOARDSIZE && j >= 0) {
    sequence += board[j][i];
    i++;
    j--;
  }
  let reverseSequence = sequence.split("").reverse().join("");
  if (words.includes(sequence.toLowerCase())) {
    if (!foundWords.includes(sequence)) {
      currentPoints += 3;
      foundWord = true;
      foundSequences.push(sequence);
      replaceRow(board, "diagonalRight", i, setIsFlippingFound, setBoard);
    }
  } else if (words.includes(reverseSequence.toLowerCase())) {
    if (!foundWords.includes(reverseSequence)) {
      currentPoints += 3;
      foundWord = true;
      foundSequences.push(reverseSequence);
      replaceRow(board, "diagonalRight", i, setIsFlippingFound, setBoard);
    }
  }

  //check diagonal left (top left to bottom right)
  i = 0;
  sequence = "";
  while (i < BOARDSIZE) {
    sequence += board[i][i];
    i++;
  }
  reverseSequence = sequence.split("").reverse().join("");
  if (words.includes(sequence.toLowerCase())) {
    if (!foundWords.includes(sequence)) {
      currentPoints += 3;
      foundWord = true;
      foundSequences.push(sequence);
      replaceRow(board, "diagonalLeft", i, setIsFlippingFound, setBoard);
    }
  } else if (words.includes(reverseSequence.toLowerCase())) {
    if (!foundWords.includes(reverseSequence)) {
      currentPoints += 3;
      foundWord = true;
      foundSequences.push(reverseSequence);
      replaceRow(board, "diagonalLeft", i, setIsFlippingFound, setBoard);
    }
  }

  if (foundWord) {
    //play sound effect
    // if (soundEnabled) {
    //   foundSound.play();
    // }
    //effect for easter egg
    // if (foundSequences.includes("PARTY")) {
    //   setEffect("confetti");
    // }
    setFoundWords([...foundWords, ...foundSequences]);
    setRecentFoundWords(foundSequences);
    //calculate score based on found words
    //bonus points for additional words
    if (foundSequences.length > 1) {
      currentPoints += 5 * (foundSequences.length - 1);
    }
    for (let i = 0; i < foundSequences.length; i++) {
      const currentWord = foundSequences[i];
      for (let j = 0; j < currentWord.length; j++) {
        const currentLetter = currentWord[j];
        // if (currentLetter === bonusLetter) {
        //   currentPoints += pointMap[currentLetter] * 2;
        // } else {
        //   currentPoints += pointMap[currentLetter];
        // }
        currentPoints += pointMap[currentLetter];
      }
    }
    setAnimatedPoints(currentPoints);
    setPoints(points + currentPoints);
  }

  return foundWord;
};

// If a word is found apply animation then wipe it from the board
const replaceRow = (
  board: string[][],
  direction: Direction,
  row: number,
  setIsFlippingFound: Dispatch<SetStateAction<boolean>>,
  setBoard: (newBoard: string[][]) => void
) => {
  let j = BOARDSIZE - 1; //for diagonal right
  for (let i = 0; i < BOARDSIZE; i++) {
    let tile;
    switch (direction) {
      case "column":
        tile = document.getElementById(`${row}-${i}`);
        applyFoundAnimation(board, tile, row, i, setIsFlippingFound, setBoard);
        break;
      case "row":
        tile = document.getElementById(`${i}-${row}`);
        applyFoundAnimation(board, tile, i, row, setIsFlippingFound, setBoard);
        break;
      case "diagonalRight":
        tile = document.getElementById(`${j}-${i}`);
        applyFoundAnimation(board, tile, j, i, setIsFlippingFound, setBoard);
        j--;
        break;
      case "diagonalLeft":
        tile = document.getElementById(`${i}-${i}`);
        applyFoundAnimation(board, tile, i, i, setIsFlippingFound, setBoard);
        break;
    }
  }
};

const applyFoundAnimation = (
  board: string[][],
  tile: HTMLElement | null,
  row: number,
  col: number,
  setIsFlippingFound: Dispatch<SetStateAction<boolean>>,
  setBoard: (newBoard: string[][]) => void
) => {
  setIsFlippingFound(true);
  // isDark
  //   ? tile?.classList.add("found-word-dark")
  //   : tile?.classList.add("found-word-light");
  tile?.classList.add("found-word");
  //Animate title for a fun effect when a word is found
  const titleTile = document.querySelector(".title-tile-l");
  const titleTile2 = document.querySelector(".title-tile-s");
  titleTile?.classList.add("flip-delay-short");
  titleTile2?.classList.add("flip-delay-long");
  const animatedPoints = document.querySelector(".animated-points");
  animatedPoints?.classList.add("show-animated-points");
  setTimeout(() => {
    // tile?.classList.remove("found-word-light");
    // tile?.classList.remove("found-word-dark");
    tile?.classList.remove("found-word");
    titleTile?.classList.remove("flip-delay-short");
    titleTile2?.classList.remove("flip-delay-long");
    tile?.classList.add("flip");
    board[row][col] = " ";

    setTimeout(() => {
      setBoard(board);
    }, 100);

    setTimeout(() => {
      tile?.classList.remove("flip");
      animatedPoints?.classList.remove("show-animated-points");
      setIsFlippingFound(false);
    }, 300);
  }, 900);
};

export const applyAnimation = (
  tile: HTMLElement | null,
  setAnimateFlip: Dispatch<SetStateAction<boolean>>
) => {
  tile?.classList.add("flip");
  setAnimateFlip(true);

  setTimeout(() => {
    tile?.classList.remove("flip");
    setAnimateFlip(false);
  }, 250);
};

export const getRandomLetter = (): string => {
  type Letter = string;
  const alphabet: Letter[] = "abcdefghijklmnopqrstuvwxyz".split("");
  const weights: number[] = [
    8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153,
    0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987, 10.702, 9.056,
    2.758, 0.978, 2.36, 0.15, 1.974, 0.074,
  ];

  function weightedRandomIndex(weights: number[]): number {
    const totalWeight: number = weights.reduce(
      (acc: number, val: number) => acc + val,
      0
    );
    let random: number = Math.random() * totalWeight;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random < 0) {
        return i;
      }
    }
    return weights.length - 1;
  }

  const randomIndex: number = weightedRandomIndex(weights);
  const randomLetter: Letter = alphabet[randomIndex];
  return randomLetter.toUpperCase();
};

//Persists through each game to keep leaderboard entries unique
export function generateGameId(): number {
  const min = 10000000;
  const max = 99999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
