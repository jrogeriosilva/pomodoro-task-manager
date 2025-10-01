import { useLocalStorage } from "./useLocalStorage";
import { TomatoPoints } from "../types";

const defaultTomatoPoints: TomatoPoints = {
  total: 0,
  earnedToday: 0,
  lastEarnedDate: new Date().toDateString(),
};

export function useTomatoPoints() {
  const [tomatoPoints, setTomatoPoints] = useLocalStorage<TomatoPoints>(
    "pomodoro-tomato-points",
    defaultTomatoPoints
  );

  const addTomatoPoints = (points: number) => {
    const today = new Date().toDateString();

    setTomatoPoints((prev) => {
      // Reset daily count if it's a new day
      const isNewDay = prev.lastEarnedDate !== today;

      return {
        total: prev.total + points,
        earnedToday: isNewDay ? points : prev.earnedToday + points,
        lastEarnedDate: today,
      };
    });
  };

  const spendTomatoPoints = (points: number): boolean => {
    if (tomatoPoints.total < points) {
      return false; // Not enough points
    }

    setTomatoPoints((prev) => ({
      ...prev,
      total: prev.total - points,
    }));

    return true; // Successfully spent points
  };

  const resetDailyPoints = () => {
    const today = new Date().toDateString();

    setTomatoPoints((prev) => ({
      ...prev,
      earnedToday: 0,
      lastEarnedDate: today,
    }));
  };

  // Check if it's a new day and reset daily counter
  const checkAndResetDaily = () => {
    const today = new Date().toDateString();
    if (tomatoPoints.lastEarnedDate !== today) {
      resetDailyPoints();
    }
  };

  return {
    tomatoPoints,
    addTomatoPoints,
    spendTomatoPoints,
    resetDailyPoints,
    checkAndResetDaily,
  };
}
