import { Dispatch, SetStateAction } from "react";

export type LeaderboardEntry = {
  id: number;
  timestamp: string;
  name: string;
  score: number;
  points: number;
  gameMode: string;
};

export async function writeToLeaderboard(entry: {
  id: number;
  name: string;
  score: number;
  points: number;
  gameMode: string;
  foundWords: string[];
  recentFoundWords: string[];
}) {
  try {
    const response = await fetch("/.netlify/functions/leaderboardActions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "writeToLeaderboard",
        payload: entry,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error writing to leaderboard: ${response.status}`);
    }

    const data = await response.json();
    console.log("Leaderboard entry added:", data);
  } catch (error) {
    console.error("Error writing to leaderboard:", error);
  }
}
