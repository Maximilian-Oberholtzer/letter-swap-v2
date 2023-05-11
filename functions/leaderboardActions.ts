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

const readLeaderboard = async (
  gameMode: string,
  start: string = "",
  end: string = ""
) => {
  let query = supabase
    .from("leaderboardv2")
    .select("*")
    .order("points", { ascending: false })
    .filter("game_mode", "eq", gameMode)
    .limit(10);

  if (start && end) {
    query = query
      .filter("created_at", "gte", start)
      .filter("created_at", "lte", end);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching ${gameMode} leaderboard data:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `An error occurred while reading from the ${gameMode} leaderboard`,
        error,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

const readAllLeaderboards = async (gameMode: string) => {
  const currentDate = new Date();
  const timeZone = "America/New_York"; // Eastern Time (ET)

  // Daily
  const startOfDayET = utcToZonedTime(currentDate, timeZone);
  startOfDayET.setHours(0, 0, 0, 0);
  const endOfDayET = new Date(startOfDayET);
  endOfDayET.setHours(23, 59, 59, 999);
  const startOfDayUTC = zonedTimeToUtc(startOfDayET, timeZone);
  const endOfDayUTC = zonedTimeToUtc(endOfDayET, timeZone);
  const startOfDayISOString = format(
    startOfDayUTC,
    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  );
  const endOfDayISOString = format(endOfDayUTC, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

  // Monthly
  const startOfMonthET = utcToZonedTime(startOfMonth(currentDate), timeZone);
  const endOfMonthET = utcToZonedTime(endOfMonth(currentDate), timeZone);
  const startOfMonthUTC = zonedTimeToUtc(startOfMonthET, timeZone);
  const endOfMonthUTC = zonedTimeToUtc(endOfMonthET, timeZone);
  const startOfMonthISOString = format(
    startOfMonthUTC,
    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  );
  const endOfMonthISOString = format(
    endOfMonthUTC,
    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  );

  const dailyLeaderboard = await readLeaderboard(
    gameMode,
    startOfDayISOString,
    endOfDayISOString
  );
  const monthlyLeaderboard = await readLeaderboard(
    gameMode,
    startOfMonthISOString,
    endOfMonthISOString
  );
  const allTimeLeaderboard = await readLeaderboard(gameMode);

  if (
    dailyLeaderboard.statusCode !== 200 ||
    monthlyLeaderboard.statusCode !== 200 ||
    allTimeLeaderboard.statusCode !== 200
  ) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while reading from the leaderboards",
        errors: {
          daily: dailyLeaderboard.body,
          monthly: monthlyLeaderboard.body,
          allTime: allTimeLeaderboard.body,
        },
      }),
    };
  }

  // Merge the data from all leaderboards
  const allLeaderboards = {
    daily: JSON.parse(dailyLeaderboard.body),
    monthly: JSON.parse(monthlyLeaderboard.body),
    allTime: JSON.parse(allTimeLeaderboard.body),
  };

  return {
    statusCode: 200,
    body: JSON.stringify(allLeaderboards),
  };
};

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
    case "readAllLeaderboards":
      return await readAllLeaderboards(payload);
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid action" }),
      };
  }
};
