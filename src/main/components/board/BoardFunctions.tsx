import { Dispatch, SetStateAction } from "react";
import { wordsFiveLetters } from "../../../words/words5letters";
import { wordsFourLetters } from "../../../words/words4letters";
import randomSeed from "random-seed";
import { Howl } from "howler";

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

const weights: number[] = [
  8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772,
  4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987, 10.702, 9.056, 2.758, 0.978,
  2.36, 0.15, 1.974, 0.074,
];

const foundSound = new Howl({
  src: ["/found.wav"],
});

export const fillEmptyBoard = (boardSize: number): string[][] => {
  const newBoard = Array(boardSize)
    .fill(null)
    .map(() =>
      Array(boardSize)
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

//Generate sequence for blitz mode based on day
export const fillBlitzNextLetters = (): string[] => {
  const date = new Date();
  const seed =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  const rand = randomSeed.create(seed);
  const frequency: { [key: string]: number } = {
    A: 0.08167,
    B: 0.01492,
    C: 0.02782,
    D: 0.04253,
    E: 0.12702,
    F: 0.02228,
    G: 0.02015,
    H: 0.06094,
    I: 0.06966,
    J: 0.00153,
    K: 0.00772,
    L: 0.04025,
    M: 0.02406,
    N: 0.06749,
    O: 0.07507,
    P: 0.01929,
    Q: 0.00095,
    R: 0.05987,
    S: 0.10702,
    T: 0.09056,
    U: 0.02758,
    V: 0.00978,
    W: 0.0236,
    X: 0.0015,
    Y: 0.01974,
    Z: 0.00074,
  };
  function getRandomLetter(): string {
    const random = rand.floatBetween(0, 1);
    let total = 0;
    for (const letter in frequency) {
      total += frequency[letter];
      if (random <= total) {
        return letter;
      }
    }
    return "";
  }
  const letters = [];
  for (let i = 0; i < 1200; i++) {
    letters.push(getRandomLetter());
  }

  return letters;
};

//Board Checking and animation Handling
type Direction = "row" | "column" | "diagonalRight" | "diagonalLeft";

export const checkForWords = (
  boardSize: number,
  board: string[][],
  setBoard: (newBoard: string[][]) => void,
  foundWords: string[],
  setFoundWords: (foundWords: string[]) => void,
  setRecentFoundWords: (recentFoundWords: string[]) => void,
  setIsFlippingFound: Dispatch<SetStateAction<boolean>>,
  points: number,
  setPoints: (points: number) => void,
  setAnimatedPoints: Dispatch<SetStateAction<number>>,
  soundEnabled: boolean
): boolean => {
  let foundWord = false;
  let foundSequences = [];
  let currentPoints = 0;

  let words = boardSize === 4 ? wordsFourLetters : wordsFiveLetters;

  //check columns
  for (let i = 0; i < boardSize; i++) {
    let sequence = "";
    for (let j = 0; j < boardSize; j++) {
      sequence += board[i][j];
      if (j === boardSize - 1) {
        let reverseSequence = sequence.split("").reverse().join("");
        if (words.includes(sequence.toLowerCase())) {
          if (!foundWords.includes(sequence)) {
            foundWord = true;
            foundSequences.push(sequence);
            replaceRow(
              boardSize,
              board,
              "column",
              i,
              setIsFlippingFound,
              setBoard
            );
          }
        } else if (words.includes(reverseSequence.toLowerCase())) {
          if (!foundWords.includes(reverseSequence)) {
            foundWord = true;
            foundSequences.push(reverseSequence);
            replaceRow(
              boardSize,
              board,
              "column",
              i,
              setIsFlippingFound,
              setBoard
            );
          }
        }
      }
    }
  }

  //check rows
  for (let i = 0; i < boardSize; i++) {
    let sequence = "";
    for (let j = 0; j < boardSize; j++) {
      sequence += board[j][i];
      if (j === boardSize - 1) {
        let reverseSequence = sequence.split("").reverse().join("");
        if (words.includes(sequence.toLowerCase())) {
          if (!foundWords.includes(sequence)) {
            foundWord = true;
            foundSequences.push(sequence);
            replaceRow(
              boardSize,
              board,
              "row",
              i,
              setIsFlippingFound,
              setBoard
            );
          }
        } else if (words.includes(reverseSequence.toLowerCase())) {
          if (!foundWords.includes(reverseSequence)) {
            foundWord = true;
            foundSequences.push(reverseSequence);
            replaceRow(
              boardSize,
              board,
              "row",
              i,
              setIsFlippingFound,
              setBoard
            );
          }
        }
      }
    }
  }

  //check diagonal right (bottom left to top right)
  let i = 0;
  let j = boardSize - 1;
  let sequence = "";
  while (i < boardSize && j >= 0) {
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
      replaceRow(
        boardSize,
        board,
        "diagonalRight",
        i,
        setIsFlippingFound,
        setBoard
      );
    }
  } else if (words.includes(reverseSequence.toLowerCase())) {
    if (!foundWords.includes(reverseSequence)) {
      currentPoints += 3;
      foundWord = true;
      foundSequences.push(reverseSequence);
      replaceRow(
        boardSize,
        board,
        "diagonalRight",
        i,
        setIsFlippingFound,
        setBoard
      );
    }
  }

  //check diagonal left (top left to bottom right)
  i = 0;
  sequence = "";
  while (i < boardSize) {
    sequence += board[i][i];
    i++;
  }
  reverseSequence = sequence.split("").reverse().join("");
  if (words.includes(sequence.toLowerCase())) {
    if (!foundWords.includes(sequence)) {
      currentPoints += 3;
      foundWord = true;
      foundSequences.push(sequence);
      replaceRow(
        boardSize,
        board,
        "diagonalLeft",
        i,
        setIsFlippingFound,
        setBoard
      );
    }
  } else if (words.includes(reverseSequence.toLowerCase())) {
    if (!foundWords.includes(reverseSequence)) {
      currentPoints += 3;
      foundWord = true;
      foundSequences.push(reverseSequence);
      replaceRow(
        boardSize,
        board,
        "diagonalLeft",
        i,
        setIsFlippingFound,
        setBoard
      );
    }
  }

  if (foundWord) {
    //play sound effect
    if (soundEnabled) {
      foundSound.play();
    }
    //effect for easter egg
    // if (foundSequences.includes("PARTY")) {
    //   setEffect("confetti");
    // }

    //Make sure found suquences don't have duplicates
    let nonDuplicateSequences = [""];
    for (let word of foundSequences) {
      if (!nonDuplicateSequences.includes(word)) {
        nonDuplicateSequences.push(word);
      }
    }
    nonDuplicateSequences.shift();
    setFoundWords([...foundWords, ...nonDuplicateSequences]);
    setRecentFoundWords(nonDuplicateSequences);
    //calculate score based on found words
    //bonus points for additional words
    if (nonDuplicateSequences.length > 1) {
      currentPoints += 5 * (nonDuplicateSequences.length - 1);
    }
    for (let i = 0; i < nonDuplicateSequences.length; i++) {
      const currentWord = nonDuplicateSequences[i];
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
  boardSize: number,
  board: string[][],
  direction: Direction,
  row: number,
  setIsFlippingFound: Dispatch<SetStateAction<boolean>>,
  setBoard: (newBoard: string[][]) => void
) => {
  let j = boardSize - 1; //for diagonal right
  for (let i = 0; i < boardSize; i++) {
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
