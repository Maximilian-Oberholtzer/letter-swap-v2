import { differenceInCalendarDays } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const startDate = new Date("2023-05-08T00:00:00-05:00");

export const getDaysElapsedSince = (): number => {
  const now = new Date();
  const currentEST = utcToZonedTime(now, "America/New_York");
  const startDateEST = utcToZonedTime(startDate, "America/New_York");
  const daysDifference = differenceInCalendarDays(currentEST, startDateEST);
  return daysDifference;
};
