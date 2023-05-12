import { Dispatch, SetStateAction } from "react";

export type LeaderboardEntry = {
  id: number;
  timestamp: string;
  name: string;
  score: number;
  points: number;
  gameMode: string;
};

export async function readAllLeaderboards(gameMode: string) {
  const response = await fetch("/.netlify/functions/leaderboardActions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "readAllLeaderboards", payload: gameMode }),
  });

  if (response.ok) {
    const data = await response.json();
    // console.log("Leaderboard data:", data);
    // setLeaderboardData(data);
    return data;
  } else {
    console.error("An error occurred while fetching leaderboard data");
  }
}

export async function writeToLeaderboard(
  entry: {
    id: number;
    name: string;
    score: number;
    points: number;
    gameMode: string;
    foundWords: string[];
    recentFoundWords: string[];
  },
  setSubmittedScore: Dispatch<SetStateAction<boolean>>
) {
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

    if (response.ok) {
      setSubmittedScore(true);
    }

    if (!response.ok) {
      throw new Error(`Error writing to leaderboard: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error writing to leaderboard:", error);
  }
}
