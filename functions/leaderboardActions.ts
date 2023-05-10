import { createClient } from "@supabase/supabase-js";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import format from "date-fns/format";
import { startOfMonth, endOfMonth } from "date-fns";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface GameData {
  id: number;
  timestamp: string;
  name: string;
  score: number;
  points: number;
  gameMode: string;
  foundWords: string[];
  recentFoundWords: string[];
}

const writeToLeaderboard = async (entry: GameData) => {
  const leaderboardEntry = {
    id: entry.id,
    name: entry.name,
    score: entry.score,
    points: entry.points,
    game_mode: entry.gameMode,
  };

  const { data, error } = await supabase
    .from("leaderboardv2")
    .insert([leaderboardEntry]);

  if (error) {
    console.error("Error writing to leaderboard:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while writing to the leaderboard",
        error,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

exports.handler = async (event: any) => {
  const { action, payload } = JSON.parse(event.body);

  switch (action) {
    case "writeToLeaderboard":
      return await writeToLeaderboard(payload);
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid action" }),
      };
  }
};
