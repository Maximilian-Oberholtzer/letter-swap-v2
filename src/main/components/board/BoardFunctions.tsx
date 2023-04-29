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
