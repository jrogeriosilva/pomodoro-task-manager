import { useLocalStorage } from "./useLocalStorage";
import { Settings } from "../types";

const defaultSettings: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesForLongBreak: 4,
  soundEnabled: true,
  notificationsEnabled: true,
  fortuneTigerMode: false,
  storeMode: true,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>(
    "pomodoro-settings",
    defaultSettings
  );

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}
